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

export interface QualityGateResult {
  valid: boolean;
  reason?: string;
  reasonType?: 'malformed_json' | 'low_quality';
}

interface LlmModelConfig {
  provider: LlmProvider;
  model: string;
}

const providerFromEnv = (process.env.LLM_PROVIDER ?? 'openrouter').toLowerCase();
const DEFAULT_PROVIDER: LlmProvider = providerFromEnv === 'gemini' || providerFromEnv === 'openrouter'
  ? providerFromEnv
  : 'openrouter';

const GEMINI_PRIMARY_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';
const OPENROUTER_PRIMARY_MODEL = process.env.OPENROUTER_PRIMARY_MODEL ?? 'arcee-ai/trinity-large-preview:free';
const OPENROUTER_SECONDARY_MODEL = process.env.OPENROUTER_SECONDARY_MODEL ?? 'x-ai/grok-4.1-fast';
const OPENROUTER_TERTIARY_MODEL = process.env.OPENROUTER_TERTIARY_MODEL ?? 'stepfun/step-3.5-flash:free';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/** Per-model request timeout. Default 60s — LLM generation with complex prompts needs much more than 12s. */
const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS ?? 60_000);

/** How many times to retry the same model before falling back to the next one. */
const OPENROUTER_RETRIES_PER_MODEL = Number(process.env.OPENROUTER_RETRIES_PER_MODEL ?? 1);

/** Delay between retries of the same model (scales with retry index). */
const OPENROUTER_RETRY_DELAY_MS = 3_000;

const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function buildModelChain(): LlmModelConfig[] {
  const openrouterChain: LlmModelConfig[] = [
    { provider: 'openrouter', model: OPENROUTER_PRIMARY_MODEL },
    { provider: 'openrouter', model: OPENROUTER_SECONDARY_MODEL },
    { provider: 'openrouter', model: OPENROUTER_TERTIARY_MODEL },
  ];

  if (DEFAULT_PROVIDER === 'openrouter') {
    return openrouterChain;
  }

  // Gemini-first configuration still falls back to OpenRouter so one provider outage
  // does not stall the enrichment pipeline.
  return [
    { provider: 'gemini', model: GEMINI_PRIMARY_MODEL },
    ...openrouterChain,
  ];
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


function modelSupportsJsonResponseFormat(modelName: string): boolean {
  // Models known to NOT support structured response_format
  return !/stepfun\/step-3\.5-flash/i.test(modelName);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateWithOpenRouter(
  modelName: string,
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

  // Build messages — use proper system/user roles when a system prompt is provided
  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });
  } else {
    messages.push({ role: 'user', content: prompt });
  }

  const requestPayload: Record<string, unknown> = {
    model: modelName,
    messages,
    temperature: 0.3,
    max_tokens: 4096,
  };

  if (modelSupportsJsonResponseFormat(modelName)) {
    requestPayload.response_format = { type: 'json_object' };
  }

  // Use AbortController with proper cleanup to prevent timer leaks
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      let errorText: string;
      try {
        errorText = await response.text();
      } catch {
        errorText = '(could not read error body)';
      }
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const responsePayload = await response.json() as {
      error?: { message?: string; code?: number };
      choices?: Array<{ message?: { content?: string } }>;
    };

    if (responsePayload.error?.message) {
      throw new Error(`OpenRouter model error: ${responsePayload.error.message}`);
    }

    const content = responsePayload.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('OpenRouter returned no message content.');
    }

    return content;
  } catch (err) {
    // Provide a clear message for timeout aborts instead of generic "This operation was aborted"
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        `OpenRouter request timed out after ${OPENROUTER_TIMEOUT_MS}ms for model ${modelName}`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function classifyFailure(error: unknown): Pick<LlmAttemptFailure, 'reason' | 'message'> {
  const message = error instanceof Error ? error.message : 'Unknown LLM error';

  if (/json/i.test(message)) {
    return { reason: 'malformed_json', message };
  }

  if (/api|status|network|timeout|abort|timed out/i.test(message)) {
    return { reason: 'api_error', message };
  }

  return { reason: 'model_error', message };
}

/**
 * Generate content using the configured LLM provider with fallback chain and per-model retries.
 *
 * @param prompt       The user/content prompt
 * @param qualityGate  Validation function run on each model's output
 * @param options.systemPrompt  Optional system prompt (sent as a separate system message for OpenRouter)
 */
export async function generateWithFallback(
  prompt: string,
  qualityGate: (content: string) => QualityGateResult,
  options?: { systemPrompt?: string },
): Promise<LlmGenerationResult> {
  // Validate at least one configured provider can be used.
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

  if (!hasGemini && !hasOpenRouter) {
    throw new Error('No LLM API keys are configured. Set GEMINI_API_KEY and/or OPENROUTER_API_KEY.');
  }

  const chain = buildModelChain();
  const failures: LlmAttemptFailure[] = [];

  for (const entry of chain) {
    for (let retry = 0; retry <= OPENROUTER_RETRIES_PER_MODEL; retry++) {
      try {
        if (entry.provider === 'openrouter' && !process.env.OPENROUTER_API_KEY) {
          failures.push({
            provider: entry.provider,
            model: entry.model,
            reason: 'api_error',
            message: 'OPENROUTER_API_KEY is not configured.',
          });
          break;
        }

        if (entry.provider === 'gemini' && !process.env.GEMINI_API_KEY) {
          failures.push({
            provider: entry.provider,
            model: entry.model,
            reason: 'api_error',
            message: 'GEMINI_API_KEY is not configured.',
          });
          break;
        }

        const content = entry.provider === 'openrouter'
          ? await generateWithOpenRouter(entry.model, prompt, options?.systemPrompt)
          : await generateWithGemini(
              entry.model,
              options?.systemPrompt
                ? options.systemPrompt + '\n\n---\n\n' + prompt
                : prompt,
            );

        const qualityCheck = qualityGate(content);
        if (!qualityCheck.valid) {
          failures.push({
            provider: entry.provider,
            model: entry.model,
            reason: qualityCheck.reasonType ?? 'low_quality',
            message: qualityCheck.reason ?? 'Generated content did not pass quality checks.',
          });
          // Quality failures won't improve with a simple retry — move to next model
          break;
        }

        return {
          content,
          provider: entry.provider,
          model: entry.model,
          attempts: failures,
        };
      } catch (error) {
        const failure = classifyFailure(error);

        log('warn', 'llm_attempt_failed', `LLM attempt failed (model=${entry.model}, retry=${retry}/${OPENROUTER_RETRIES_PER_MODEL})`, {
          provider: entry.provider,
          model: entry.model,
          retry,
          maxRetries: OPENROUTER_RETRIES_PER_MODEL,
          reason: failure.reason,
          message: failure.message,
        });

        // If we have retries left for this model, wait and retry
        if (retry < OPENROUTER_RETRIES_PER_MODEL) {
          await sleep(OPENROUTER_RETRY_DELAY_MS * (retry + 1));
          continue;
        }

        // No more retries for this model — record failure and move to next model
        failures.push({
          provider: entry.provider,
          model: entry.model,
          reason: failure.reason,
          message: failure.message,
        });
      }
    }
  }

  const summary = failures.map(f => `${f.provider}/${f.model}: ${f.reason} (${f.message})`).join(' | ');
  throw new Error(`All LLM fallback attempts failed. ${summary}`);
}

export function getConfiguredLlmProvider(): LlmProvider {
  return DEFAULT_PROVIDER;
}
