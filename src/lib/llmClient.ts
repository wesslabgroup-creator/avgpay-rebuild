import 'server-only';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { log } from '@/lib/enrichmentLogger';

export type LlmProvider = 'gemini' | 'openrouter';

export interface LlmAttemptFailure {
  provider: LlmProvider;
  model: string;
  reason: 'malformed_json' | 'api_error' | 'model_error' | 'low_quality';
  message: string;
}

export interface LlmGenerationResult {
  content: string;
  provider: LlmProvider;
  model: string;
  attempts: LlmAttemptFailure[];
}

interface LlmModelConfig {
  provider: LlmProvider;
  model: string;
}

const DEFAULT_PROVIDER = (process.env.LLM_PROVIDER ?? 'gemini').toLowerCase() as LlmProvider;

const GEMINI_PRIMARY_MODEL = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';
const OPENROUTER_PRIMARY_MODEL = process.env.OPENROUTER_PRIMARY_MODEL ?? 'arcee-ai/trinity-large-preview:free';
const OPENROUTER_SECONDARY_MODEL = process.env.OPENROUTER_SECONDARY_MODEL ?? 'x-ai/grok-4.1-fast';
const OPENROUTER_TERTIARY_MODEL = process.env.OPENROUTER_TERTIARY_MODEL ?? 'stepfun/step-3.5-flash:free';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function buildModelChain(): LlmModelConfig[] {
  if (DEFAULT_PROVIDER === 'openrouter') {
    return [
      { provider: 'openrouter', model: OPENROUTER_PRIMARY_MODEL },
      { provider: 'openrouter', model: OPENROUTER_SECONDARY_MODEL },
      { provider: 'openrouter', model: OPENROUTER_TERTIARY_MODEL },
    ];
  }

  return [{ provider: 'gemini', model: GEMINI_PRIMARY_MODEL }];
}

async function generateWithGemini(modelName: string, prompt: string): Promise<string> {
  if (!geminiClient) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const model = geminiClient.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateWithOpenRouter(modelName: string, prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const payload = await response.json() as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };

  if (payload.error?.message) {
    throw new Error(`OpenRouter model error: ${payload.error.message}`);
  }

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenRouter returned no message content.');
  }

  return content;
}

function classifyFailure(error: unknown): Pick<LlmAttemptFailure, 'reason' | 'message'> {
  const message = error instanceof Error ? error.message : 'Unknown LLM error';

  if (/json/i.test(message)) {
    return { reason: 'malformed_json', message };
  }

  if (/api|status|network|timeout/i.test(message)) {
    return { reason: 'api_error', message };
  }

  return { reason: 'model_error', message };
}

export async function generateWithFallback(
  prompt: string,
  qualityGate: (content: string) => { valid: boolean; reason?: string }
): Promise<LlmGenerationResult> {
  const chain = buildModelChain();
  const failures: LlmAttemptFailure[] = [];

  for (const entry of chain) {
    try {
      const content = entry.provider === 'openrouter'
        ? await generateWithOpenRouter(entry.model, prompt)
        : await generateWithGemini(entry.model, prompt);

      const qualityCheck = qualityGate(content);
      if (!qualityCheck.valid) {
        failures.push({
          provider: entry.provider,
          model: entry.model,
          reason: 'low_quality',
          message: qualityCheck.reason ?? 'Generated content did not pass quality checks.',
        });
        continue;
      }

      return {
        content,
        provider: entry.provider,
        model: entry.model,
        attempts: failures,
      };
    } catch (error) {
      const failure = classifyFailure(error);
      failures.push({
        provider: entry.provider,
        model: entry.model,
        reason: failure.reason,
        message: failure.message,
      });

      log('warn', 'llm_attempt_failed', 'LLM generation attempt failed; moving to fallback model', {
        provider: entry.provider,
        model: entry.model,
        reason: failure.reason,
        message: failure.message,
      });
    }
  }

  const summary = failures.map(f => `${f.provider}/${f.model}: ${f.reason} (${f.message})`).join(' | ');
  throw new Error(`All LLM fallback attempts failed. ${summary}`);
}

export function getConfiguredLlmProvider(): LlmProvider {
  return DEFAULT_PROVIDER;
}
