import { genAI } from '@/lib/geminiClient';
import { supabaseAdmin } from '@/lib/supabaseClient';
import {
  buildComparisonMetricsContextBlock,
  buildEntityMetricsContextBlock,
  computeAggregateMetrics,
  type EntityMetricsScope,
  type EntityMetricsSnapshot,
} from '@/lib/marketStats';

// ============================================================
// Types
// ============================================================

export type EntityType = 'Company' | 'City' | 'Job' | 'Combo' | 'Comparison';

export interface CompanyAnalysis {
  comp_philosophy: string;
  benefit_sentiment: string;
  hiring_bar: string;
  [key: string]: string; // Dynamic schema expansion
}

export interface CityAnalysis {
  buying_power: string;
  market_drivers: string;
  lifestyle_economics: string;
  [key: string]: string;
}

export interface JobAnalysis {
  career_leverage: string;
  skill_premium: string;
  remote_viability: string;
  [key: string]: string;
}

export interface ComboAnalysis {
  local_market_leverage: string;
  disposable_income_index: string;
  commute_economics: string;
  [key: string]: string;
}

export interface ComparisonAnalysis {
  philosophical_divergence: string;
  cultural_tradeoff: string;
  winner_profile: string;
  [key: string]: string;
}

export type AnalysisResult = CompanyAnalysis | CityAnalysis | JobAnalysis | ComboAnalysis | ComparisonAnalysis;

interface PromptContextSnapshot {
  mode: 'single' | 'comparison';
  entity?: EntityMetricsSnapshot;
  entityA?: EntityMetricsSnapshot;
  entityB?: EntityMetricsSnapshot;
  contextBlock: string;
}

export interface EnrichmentJob {
  id: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  contextData?: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  lastError?: string;
  result?: AnalysisResult;
  createdAt: string;
  processedAt?: string;
}

// ============================================================
// Master System Prompt
// ============================================================

const MASTER_SYSTEM_PROMPT = `You are the Lead Data Analyst for AvgPay. Your goal is to generate "Timeless Financial Analysis" that is deep, unique, and SEO-compliant.

**OBJECTIVE:**
Analyze the provided Entity ({{entityName}}) and return a JSON object with unique insights.

**CRITICAL SEO RULES (Must Follow to Avoid "Spam" Penalty):**
1.  **ANTI-REPETITION:** Do NOT use the same sentence starters for every response (e.g., never start every response with "This company is..."). Vary your sentence structure and vocabulary.
2.  **THE "FINGERPRINT" RULE:** Focus on the *specific* economic attributes of this entity.
    * *Bad (Generic):* "Austin is a tech hub with good jobs."
    * *Good (Specific):* "Austin's 'Silicon Hills' status creates a salary floor that competes with the West Coast, specifically in semiconductor and SaaS sectors."
3.  **DEPTH REQUIREMENT:** Each JSON value must be 2-3 sentences long and contain at least one "Why" statement (Cause & Effect). Surface-level content will be rejected as "thin."
4.  **TIMELESSNESS:** Do not use dates (2024, 2025) or words like "currently/now." Use "Historically," "Typically," or "Market fundamentals."

**OUTPUT JSON STRUCTURE:**

IF ENTITY_TYPE == "Company":
{
  "comp_philosophy": "Analyze the pay mix. Does this specific company rely on stock options, bonuses, or high base pay? Why?",
  "benefit_sentiment": "Identify the *unique* perks or culture aspects this company is known for (e.g. 'work-from-anywhere' vs 'in-office mandates').",
  "hiring_bar": "Describe the interview difficulty. Is it LeetCode-heavy? Behavioral? Portfolio-based?"
}

IF ENTITY_TYPE == "City":
{
  "buying_power": "Analyze local taxes (State Income Tax?) vs. Cost of Living. Does a dollar go further here than the national average?",
  "market_drivers": "Which specific industries (e.g., Logistics, Fintech, GovTech) dominate this city's hiring market?",
  "lifestyle_economics": "Hidden costs or savings (e.g., 'Requires a car,' 'Cheap energy,' 'High insurance rates')."
}

IF ENTITY_TYPE == "Job":
{
  "career_leverage": "How does one get promoted in this specific role? Is it years of experience or specific outcomes?",
  "skill_premium": "Which *niche* skills pay the highest for this role? (e.g., 'React' vs 'jQuery' or 'Crisis Management').",
  "remote_viability": "Is this role historically tied to an office, or does it command a 'Remote Premium'?"
}

IF ENTITY_TYPE == "Combo":
{
  "local_market_leverage": "How does this specific job title perform in this specific city? Is there a talent shortage or surplus here?",
  "disposable_income_index": "After local taxes and specific city costs, what is the 'real' quality of life for this role?",
  "commute_economics": "Does this role in this city typically require a physical presence in a high-cost hub or is it suburban-friendly?"
}

IF ENTITY_TYPE == "Comparison":
{
  "philosophical_divergence": "Contrast the two entities. One might prioritize 'Base Salary' while the other prioritizes 'Equity/RSUs.' Explain the 'Why' behind these different paths.",
  "cultural_tradeoff": "What does a candidate sacrifice when choosing A over B? (e.g., Stability vs. Rapid Growth).",
  "winner_profile": "Describe the specific type of professional who thrives at Entity A vs. Entity B."
}

**DYNAMIC SCHEMA EXPANSION:**
If you identify a highly relevant data point (e.g., a specific tax loophole, a notorious vesting schedule, or a unique certification requirement) that provides extreme value, ADD a new key-value pair to the JSON with a descriptive key name (e.g., "tax_alert").`;

// ============================================================
// Validation
// ============================================================

/**
 * Validates the Gemini analysis response for quality before saving.
 * Rejects thin content and content with banned temporal words.
 */
// Required keys per entity type — analysis must contain at least these
const REQUIRED_KEYS: Record<EntityType, string[]> = {
  Company: ['comp_philosophy', 'benefit_sentiment', 'hiring_bar'],
  City: ['buying_power', 'market_drivers', 'lifestyle_economics'],
  Job: ['career_leverage', 'skill_premium', 'remote_viability'],
  Combo: ['local_market_leverage', 'disposable_income_index', 'commute_economics'],
  Comparison: ['philosophical_divergence', 'cultural_tradeoff', 'winner_profile'],
};

const COMPARATIVE_LANGUAGE_PATTERN = /\b(whereas|alternatively|in contrast|on the other hand|however)\b/i;

export function validateAnalysis(
  jsonResponse: Record<string, string>,
  entityType?: EntityType
): { valid: boolean; reason?: string } {
  const entries = Object.entries(jsonResponse);

  if (entries.length === 0) {
    return { valid: false, reason: 'Empty analysis response' };
  }

  // Structural check: ensure the response contains the correct keys for this entity type
  if (entityType && REQUIRED_KEYS[entityType]) {
    const missingKeys = REQUIRED_KEYS[entityType].filter(k => !(k in jsonResponse));
    if (missingKeys.length > 0) {
      return { valid: false, reason: `Missing required keys for ${entityType}: ${missingKeys.join(', ')}` };
    }
  }

  // Fail if any section is too short (Thin Content Risk)
  const thinValues = entries.filter(([, text]) => typeof text === 'string' && text.length < 50);
  if (thinValues.length > 0) {
    return { valid: false, reason: `${thinValues.length} section(s) are too short (under 50 chars). Thin content risk.` };
  }

  // Fail if it uses banned words (temporal references)
  // Use word boundaries (\b) so "known", "knowledge", "innovation" don't false-positive on "now"
  const bannedPattern = /\b(2024|2025|currently|now)\b/i;
  const jsonStr = JSON.stringify(jsonResponse);
  if (bannedPattern.test(jsonStr)) {
    return { valid: false, reason: 'Contains banned temporal words (2024, 2025, currently, now). Must be timeless.' };
  }

  if (entityType === 'Comparison' && !COMPARATIVE_LANGUAGE_PATTERN.test(jsonStr)) {
    return {
      valid: false,
      reason: 'Comparison analysis must include comparative language such as "whereas", "alternatively", or "in contrast".',
    };
  }

  return { valid: true };
}

/**
 * Determines whether an analysis payload is usable for rendering.
 * We require the core schema keys for the entity and non-empty text values.
 */
export function hasRenderableAnalysis(
  analysis: unknown,
  entityType: EntityType
): analysis is Record<string, string> {
  if (!analysis || typeof analysis !== 'object') return false;

  const record = analysis as Record<string, unknown>;
  const requiredKeys = REQUIRED_KEYS[entityType] || [];

  if (requiredKeys.length === 0) return false;

  return requiredKeys.every((key) => typeof record[key] === 'string' && record[key].trim().length > 0);
}

// ============================================================
// Core Generation Function
// ============================================================

/**
 * Generate timeless financial analysis using Gemini 1.5 Flash.
 * Returns a structured JSON analysis for the given entity.
 */
export async function generateTimelessAnalysis(
  entityType: EntityType,
  entityName: string,
  contextData?: Record<string, unknown>
): Promise<{ analysis: AnalysisResult; statsSnapshot?: PromptContextSnapshot }> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  // Build the prompt with entity-specific context
  const systemPrompt = MASTER_SYSTEM_PROMPT
    .replace('{{entityName}}', entityName);

  let userPrompt = `ENTITY_TYPE: "${entityType}"\nENTITY_NAME: "${entityName}"\n`;
  let statsSnapshot: PromptContextSnapshot | undefined;

  if ((entityType === 'City' || entityType === 'Combo') && contextData) {
    userPrompt += `\nADDITIONAL CONTEXT:\n`;
    if (contextData.stateIncomeTaxStatus) {
      userPrompt += `- State Income Tax Status: ${contextData.stateIncomeTaxStatus}\n`;
    }
    if (contextData.costOfLivingTier) {
      userPrompt += `- Cost of Living Tier: ${contextData.costOfLivingTier}\n`;
    }
    if (contextData.state) {
      userPrompt += `- State: ${contextData.state}\n`;
    }
  }

  if (contextData?.additionalContext) {
    userPrompt += `\nADDITIONAL CONTEXT: ${contextData.additionalContext}\n`;
  }

  const comparisonScope = contextData?.comparison as {
    entityA?: EntityMetricsScope;
    entityB?: EntityMetricsScope;
    labelA?: string;
    labelB?: string;
  } | undefined;

  if (comparisonScope?.entityA && comparisonScope?.entityB) {
    const [entityAStats, entityBStats] = await Promise.all([
      computeAggregateMetrics(comparisonScope.entityA),
      computeAggregateMetrics(comparisonScope.entityB),
    ]);

    const comparisonContext = buildComparisonMetricsContextBlock(
      entityAStats,
      entityBStats,
      comparisonScope.labelA ?? comparisonScope.entityA.entityName ?? 'A',
      comparisonScope.labelB ?? comparisonScope.entityB.entityName ?? 'B'
    );

    userPrompt += `\n${comparisonContext}\n`;
    statsSnapshot = {
      mode: 'comparison',
      entityA: entityAStats,
      entityB: entityBStats,
      contextBlock: comparisonContext,
    };
  } else {
    const metricsEntityType: EntityMetricsScope['entityType'] =
      entityType === 'Company' || entityType === 'City' || entityType === 'Job'
        ? entityType
        : undefined;

    const inferredScope: EntityMetricsScope = {
      ...(contextData?.metricsScope as EntityMetricsScope | undefined),
      entityType: metricsEntityType,
      entityName,
      state: typeof contextData?.state === 'string' ? contextData.state : undefined,
    };

    const entityStats = await computeAggregateMetrics(inferredScope);
    const entityContext = buildEntityMetricsContextBlock(entityStats, entityName);
    userPrompt += `\n${entityContext}\n`;
    statsSnapshot = {
      mode: 'single',
      entity: entityStats,
      contextBlock: entityContext,
    };
  }

  userPrompt += `\nGenerate the timeless financial analysis JSON for this ${entityType}. Return ONLY valid JSON matching the schema for ENTITY_TYPE "${entityType}".`;

  const result = await model.generateContent(systemPrompt + '\n\n---\n\n' + userPrompt);

  const responseText = result.response.text();
  const analysis = JSON.parse(responseText) as AnalysisResult;

  return { analysis, statsSnapshot };
}

// ============================================================
// Enrichment Queue Operations
// ============================================================

/** Maximum retry attempts for failed enrichment jobs */
const MAX_ATTEMPTS = 3;
let isAutoProcessorRunning = false;

/**
 * Best-effort local trigger so newly queued jobs don't rely solely on external cron/webhooks.
 */
async function triggerAutoQueueProcessor() {
  if (isAutoProcessorRunning) return;
  isAutoProcessorRunning = true;

  try {
    const result = await processNextEnrichmentJob();

    if (result.processed) {
      console.log(`Auto-processed enrichment job ${result.jobId} (${result.status})`);
    }
  } catch (error) {
    console.error('Auto queue processor failed:', error);
  } finally {
    isAutoProcessorRunning = false;
  }
}

/**
 * Queue an entity for enrichment. Skips if a pending/processing job already exists.
 */
export async function queueEnrichment(
  entityType: EntityType,
  entityId: string,
  entityName: string,
  contextData?: Record<string, unknown>
): Promise<string | null> {
  // Check if there's already a pending or processing job for this entity
  const { data: existing } = await supabaseAdmin
    .from('EnrichmentQueue')
    .select('id, status')
    .eq('entityType', entityType)
    .eq('entityId', entityId)
    .in('status', ['pending', 'processing'])
    .maybeSingle();

  if (existing) {
    console.log(`Enrichment already queued for ${entityType} "${entityName}" (${existing.status})`);
    return existing.id;
  }

  const jobId = crypto.randomUUID();
  const { error } = await supabaseAdmin
    .from('EnrichmentQueue')
    .insert({
      id: jobId,
      entityType,
      entityId,
      entityName,
      contextData: contextData || null,
      status: 'pending',
      attempts: 0,
    });

  if (error) {
    console.error(`Failed to queue enrichment for ${entityType} "${entityName}":`, error);
    return null;
  }

  // Fire a best-effort processing pass immediately after queueing.
  // This keeps enrichment moving even if cron/webhook workers are not configured.
  void triggerAutoQueueProcessor();

  console.log(`Queued enrichment job ${jobId} for ${entityType} "${entityName}"`);
  return jobId;
}

/**
 * Process the next pending enrichment job from the queue.
 * This is designed to be called from a cron/API endpoint.
 */
export async function processNextEnrichmentJob(): Promise<{
  processed: boolean;
  jobId?: string;
  entityType?: string;
  entityName?: string;
  status?: string;
  error?: string;
}> {
  // Fetch the oldest pending job
  const { data: job, error: fetchError } = await supabaseAdmin
    .from('EnrichmentQueue')
    .select('*')
    .eq('status', 'pending')
    .order('createdAt', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    return { processed: false, error: `Failed to fetch queue: ${fetchError.message}` };
  }

  if (!job) {
    return { processed: false, error: 'No pending jobs in queue' };
  }

  // Mark as processing
  await supabaseAdmin
    .from('EnrichmentQueue')
    .update({ status: 'processing', attempts: job.attempts + 1 })
    .eq('id', job.id);

  try {
    // Generate analysis
    const { analysis, statsSnapshot } = await generateTimelessAnalysis(
      job.entityType as EntityType,
      job.entityName,
      job.contextData as Record<string, unknown> | undefined
    );

    // Validate the analysis (pass entityType for structural key checking)
    const validation = validateAnalysis(analysis as Record<string, string>, job.entityType as EntityType);

    if (!validation.valid) {
      // If validation fails and we have retries left, re-queue
      if (job.attempts + 1 < MAX_ATTEMPTS) {
        await supabaseAdmin
          .from('EnrichmentQueue')
          .update({
            status: 'pending',
            lastError: `Validation failed: ${validation.reason}`,
          })
          .eq('id', job.id);

        return {
          processed: true,
          jobId: job.id,
          entityType: job.entityType,
          entityName: job.entityName,
          status: 'retrying',
          error: validation.reason,
        };
      }

      // Max retries exceeded
      await supabaseAdmin
        .from('EnrichmentQueue')
        .update({
          status: 'failed',
          lastError: `Validation failed after ${MAX_ATTEMPTS} attempts: ${validation.reason}`,
          processedAt: new Date().toISOString(),
        })
        .eq('id', job.id);

      return {
        processed: true,
        jobId: job.id,
        entityType: job.entityType,
        entityName: job.entityName,
        status: 'failed',
        error: validation.reason,
      };
    }

    // Validation passed — save to queue result
    await supabaseAdmin
      .from('EnrichmentQueue')
      .update({
        status: 'completed',
        result: {
          analysis,
          statsSnapshot: statsSnapshot || null,
        },
        processedAt: new Date().toISOString(),
      })
      .eq('id', job.id);

    // Update the entity record with the analysis
    const entityTable = job.entityType === 'City'
      ? 'Location'
      : job.entityType === 'Job'
        ? 'Role'
        : job.entityType === 'Company'
          ? 'Company'
          : null;

    if (entityTable) {
      await supabaseAdmin
        .from(entityTable)
        .update({
          analysis: statsSnapshot
            ? {
              ...(analysis as Record<string, unknown>),
              source_context_snapshot: statsSnapshot,
            }
            : analysis,
          analysisGeneratedAt: new Date().toISOString(),
        })
        .eq('id', job.entityId);
    }

    console.log(`Enrichment completed for ${job.entityType} "${job.entityName}"`);

    return {
      processed: true,
      jobId: job.id,
      entityType: job.entityType,
      entityName: job.entityName,
      status: 'completed',
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    // Check retries
    if (job.attempts + 1 < MAX_ATTEMPTS) {
      await supabaseAdmin
        .from('EnrichmentQueue')
        .update({
          status: 'pending',
          lastError: errorMessage,
        })
        .eq('id', job.id);
    } else {
      await supabaseAdmin
        .from('EnrichmentQueue')
        .update({
          status: 'failed',
          lastError: `Failed after ${MAX_ATTEMPTS} attempts: ${errorMessage}`,
          processedAt: new Date().toISOString(),
        })
        .eq('id', job.id);
    }

    return {
      processed: true,
      jobId: job.id,
      entityType: job.entityType,
      entityName: job.entityName,
      status: 'failed',
      error: errorMessage,
    };
  }
}

/**
 * Process all pending enrichment jobs in the queue (batch mode).
 */
export async function processAllPendingJobs(): Promise<{
  totalProcessed: number;
  results: Array<{ jobId: string; entityName: string; status: string }>;
}> {
  const results: Array<{ jobId: string; entityName: string; status: string }> = [];
  let totalProcessed = 0;

  // Process jobs one at a time to avoid overwhelming the API
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await processNextEnrichmentJob();

    if (!result.processed) break;

    totalProcessed++;
    results.push({
      jobId: result.jobId!,
      entityName: result.entityName!,
      status: result.status!,
    });

    // Brief pause between jobs to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { totalProcessed, results };
}

/**
 * Check the enrichment status for a specific entity.
 */
export async function getEnrichmentStatus(
  entityType: EntityType,
  entityId: string
): Promise<{ status: string; analysis?: AnalysisResult } | null> {
  // First check if the entity already has analysis
  const entityTable = entityType === 'City' ? 'Location' : entityType === 'Job' ? 'Role' : 'Company';

  const { data: entity } = await supabaseAdmin
    .from(entityTable)
    .select('analysis, analysisGeneratedAt')
    .eq('id', entityId)
    .single();

  if (entity?.analysis) {
    return { status: 'completed', analysis: entity.analysis as AnalysisResult };
  }

  // Check the queue
  const { data: job } = await supabaseAdmin
    .from('EnrichmentQueue')
    .select('status, result, lastError')
    .eq('entityType', entityType)
    .eq('entityId', entityId)
    .order('createdAt', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!job) return null;

  return {
    status: job.status,
    analysis: job.result?.analysis as AnalysisResult | undefined,
  };
}

// ============================================================
// Helpers for City Context
// ============================================================

/**
 * Build context data for City enrichment from location fields.
 */
export function buildCityContextData(location: {
  city: string;
  state: string;
  costOfLivingIndex?: number;
}): Record<string, unknown> {
  const noIncomeTaxStates = new Set(['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY']);

  const taxStatus = noIncomeTaxStates.has(location.state.toUpperCase())
    ? 'No state income tax'
    : 'Has state income tax';

  let costTier = 'medium';
  if (location.costOfLivingIndex !== undefined) {
    if (location.costOfLivingIndex > 120) costTier = 'high';
    else if (location.costOfLivingIndex < 95) costTier = 'low';
  }

  return {
    stateIncomeTaxStatus: taxStatus,
    costOfLivingTier: costTier,
    state: location.state,
  };
}
