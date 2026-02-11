import { genAI } from '@/lib/geminiClient';
import { supabaseAdmin } from '@/lib/supabaseClient';
import {
  buildComparisonMetricsContextBlock,
  buildEntityMetricsContextBlock,
  computeAggregateMetrics,
  type EntityMetricsScope,
  type EntityMetricsSnapshot,
} from '@/lib/marketStats';
import { buildEntityKey } from '@/lib/normalization';
import { log } from '@/lib/enrichmentLogger';

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
  entityKey: string;
  contextData?: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  lastError?: string;
  result?: AnalysisResult;
  runAfter: string;
  lockedAt?: string;
  lockedBy?: string;
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
let autoProcessorRequestedWhileRunning = false;

const AUTO_PROCESS_MAX_JOBS_PER_PASS = 20;
const AUTO_PROCESS_DELAY_MS = 750;

/** Unique worker ID for locking (per-instance) */
const WORKER_ID = `worker-${crypto.randomUUID().slice(0, 8)}`;

/** Lock timeout: if a job has been locked for longer than this, it's considered stale */
const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Compute exponential backoff delay for failed jobs.
 * attempt 1 → 30s, attempt 2 → 120s, attempt 3+ → 300s
 */
function computeBackoffMs(attempts: number): number {
  const delays = [30_000, 120_000, 300_000];
  return delays[Math.min(attempts, delays.length - 1)];
}

/** Map EntityType → DB table name */
function entityTableName(entityType: string): string | null {
  switch (entityType) {
    case 'City': return 'Location';
    case 'Job': return 'Role';
    case 'Company': return 'Company';
    default: return null;
  }
}

async function hasPendingEnrichmentJobs(): Promise<boolean> {
  const { count, error } = await supabaseAdmin
    .from('EnrichmentQueue')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
    .lte('runAfter', new Date().toISOString());

  if (error) {
    log('error', 'queue_check', 'Failed checking pending enrichment jobs', { error: error.message });
    return false;
  }

  return (count ?? 0) > 0;
}

/**
 * Best-effort local trigger so newly queued jobs don't rely solely on external cron/webhooks.
 */
async function triggerAutoQueueProcessor() {
  if (isAutoProcessorRunning) {
    autoProcessorRequestedWhileRunning = true;
    return;
  }

  isAutoProcessorRunning = true;
  log('info', 'auto_processor_start', 'Auto queue processor started');

  try {
    let processedInPass = 0;

    while (processedInPass < AUTO_PROCESS_MAX_JOBS_PER_PASS) {
      const result = await processNextEnrichmentJob();

      if (!result.processed) {
        break;
      }

      processedInPass++;
      log('info', 'auto_processor_job', `Auto-processed enrichment job ${result.jobId} (${result.status})`, {
        jobId: result.jobId,
        entityType: result.entityType,
        entityName: result.entityName,
        status: result.status,
      });

      await sleep(AUTO_PROCESS_DELAY_MS);
    }

    const hasMorePendingJobs = await hasPendingEnrichmentJobs();
    const shouldContinue = autoProcessorRequestedWhileRunning || hasMorePendingJobs;

    if (shouldContinue) {
      autoProcessorRequestedWhileRunning = false;
      setTimeout(() => {
        void triggerAutoQueueProcessor();
      }, AUTO_PROCESS_DELAY_MS);
    }
  } catch (error) {
    log('error', 'auto_processor_error', 'Auto queue processor failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    isAutoProcessorRunning = false;
    log('info', 'auto_processor_end', 'Auto queue processor finished');
  }
}

/**
 * Queue an entity for enrichment. Idempotent: skips if a pending/processing
 * job already exists for the same entityKey.
 *
 * If a previous job for this entity failed and its backoff has expired,
 * it resets the job to pending.
 */
export async function queueEnrichment(
  entityType: EntityType,
  entityId: string,
  entityName: string,
  contextData?: Record<string, unknown>
): Promise<string | null> {
  const entityKey = buildEntityKey(entityType, entityName);

  log('info', 'queue_attempt', `Attempting to queue enrichment`, {
    entityType, entityId, entityName, entityKey,
  });

  // Check if there's already an active job for this entity key
  const { data: existing } = await supabaseAdmin
    .from('EnrichmentQueue')
    .select('id, status, runAfter, attempts')
    .eq('entityKey', entityKey)
    .in('status', ['pending', 'processing'])
    .maybeSingle();

  if (existing) {
    log('info', 'queue_dedup', `Enrichment already queued for ${entityType} "${entityName}" (${existing.status})`, {
      existingJobId: existing.id, entityKey,
    });
    return existing.id;
  }

  // Check if there's a failed job whose backoff has expired — reset it instead of creating a new one
  const { data: failedJob } = await supabaseAdmin
    .from('EnrichmentQueue')
    .select('id, attempts, runAfter')
    .eq('entityKey', entityKey)
    .eq('status', 'failed')
    .order('createdAt', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (failedJob) {
    const runAfter = failedJob.runAfter ? new Date(failedJob.runAfter) : new Date(0);
    if (runAfter <= new Date()) {
      // Reset the failed job back to pending
      await supabaseAdmin
        .from('EnrichmentQueue')
        .update({
          status: 'pending',
          lastError: null,
          contextData: contextData || null,
          runAfter: new Date().toISOString(),
          lockedAt: null,
          lockedBy: null,
        })
        .eq('id', failedJob.id);

      log('info', 'queue_reset', `Reset failed job to pending for ${entityType} "${entityName}"`, {
        jobId: failedJob.id, entityKey,
      });

      // Update entity status
      const table = entityTableName(entityType);
      if (table) {
        await supabaseAdmin
          .from(table)
          .update({ enrichmentStatus: 'pending' })
          .eq('id', entityId);
      }

      void triggerAutoQueueProcessor();
      return failedJob.id;
    } else {
      log('info', 'queue_backoff', `Failed job still in backoff for ${entityType} "${entityName}"`, {
        jobId: failedJob.id, runAfter: failedJob.runAfter,
      });
      return failedJob.id;
    }
  }

  // Create a new job
  const jobId = crypto.randomUUID();
  const { error } = await supabaseAdmin
    .from('EnrichmentQueue')
    .insert({
      id: jobId,
      entityType,
      entityId,
      entityName,
      entityKey,
      contextData: contextData || null,
      status: 'pending',
      attempts: 0,
      runAfter: new Date().toISOString(),
    });

  if (error) {
    // Handle unique constraint violation (race condition — another request already inserted)
    if (error.code === '23505') {
      log('info', 'queue_dedup_constraint', `Duplicate prevented by constraint for ${entityType} "${entityName}"`, {
        entityKey,
      });
      return null;
    }
    log('error', 'queue_insert_error', `Failed to queue enrichment for ${entityType} "${entityName}"`, {
      error: error.message, entityKey,
    });
    return null;
  }

  // Update entity enrichmentStatus
  const table = entityTableName(entityType);
  if (table) {
    await supabaseAdmin
      .from(table)
      .update({ enrichmentStatus: 'pending' })
      .eq('id', entityId);
  }

  void triggerAutoQueueProcessor();

  log('info', 'queue_created', `Queued enrichment job ${jobId} for ${entityType} "${entityName}"`, {
    jobId, entityType, entityId, entityName, entityKey,
  });
  return jobId;
}

/**
 * Process the next pending enrichment job from the queue.
 * Uses locking to prevent double-processing and respects runAfter for backoff.
 */
export async function processNextEnrichmentJob(): Promise<{
  processed: boolean;
  jobId?: string;
  entityType?: string;
  entityName?: string;
  status?: string;
  error?: string;
}> {
  const now = new Date();
  const staleThreshold = new Date(now.getTime() - LOCK_TIMEOUT_MS).toISOString();

  // First, release any stale locks (processing for too long)
  await supabaseAdmin
    .from('EnrichmentQueue')
    .update({ status: 'pending', lockedAt: null, lockedBy: null })
    .eq('status', 'processing')
    .lt('lockedAt', staleThreshold);

  // Fetch the oldest pending job that is ready to run
  const { data: job, error: fetchError } = await supabaseAdmin
    .from('EnrichmentQueue')
    .select('*')
    .eq('status', 'pending')
    .lte('runAfter', now.toISOString())
    .order('createdAt', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    log('error', 'worker_fetch_error', `Failed to fetch queue`, { error: fetchError.message });
    return { processed: false, error: `Failed to fetch queue: ${fetchError.message}` };
  }

  if (!job) {
    return { processed: false, error: 'No pending jobs ready to process' };
  }

  // Claim the job with a lock
  const newAttempts = job.attempts + 1;
  const { error: lockError } = await supabaseAdmin
    .from('EnrichmentQueue')
    .update({
      status: 'processing',
      attempts: newAttempts,
      lockedAt: now.toISOString(),
      lockedBy: WORKER_ID,
    })
    .eq('id', job.id)
    .eq('status', 'pending'); // Optimistic lock: only update if still pending

  if (lockError) {
    log('warn', 'worker_lock_failed', `Failed to lock job ${job.id}`, { error: lockError.message });
    return { processed: false, error: `Failed to lock job: ${lockError.message}` };
  }

  log('info', 'worker_start', `Processing job ${job.id} for ${job.entityType} "${job.entityName}" (attempt ${newAttempts})`, {
    jobId: job.id, entityType: job.entityType, entityName: job.entityName, attempt: newAttempts,
  });

  // Update entity status to processing
  const entityTable = entityTableName(job.entityType);
  if (entityTable) {
    await supabaseAdmin
      .from(entityTable)
      .update({ enrichmentStatus: 'processing' })
      .eq('id', job.entityId);
  }

  try {
    // Generate analysis
    const { analysis, statsSnapshot } = await generateTimelessAnalysis(
      job.entityType as EntityType,
      job.entityName,
      job.contextData as Record<string, unknown> | undefined
    );

    log('info', 'gemini_response', `Received Gemini response for ${job.entityType} "${job.entityName}"`, {
      jobId: job.id, keys: Object.keys(analysis),
    });

    // Validate the analysis
    const validation = validateAnalysis(analysis as Record<string, string>, job.entityType as EntityType);

    if (!validation.valid) {
      log('warn', 'validation_failed', `Analysis validation failed for ${job.entityType} "${job.entityName}": ${validation.reason}`, {
        jobId: job.id, attempt: newAttempts, reason: validation.reason,
      });

      if (newAttempts < MAX_ATTEMPTS) {
        const backoffMs = computeBackoffMs(newAttempts);
        const runAfter = new Date(now.getTime() + backoffMs).toISOString();

        await supabaseAdmin
          .from('EnrichmentQueue')
          .update({
            status: 'pending',
            lastError: `Validation failed: ${validation.reason}`,
            runAfter,
            lockedAt: null,
            lockedBy: null,
          })
          .eq('id', job.id);

        if (entityTable) {
          await supabaseAdmin.from(entityTable).update({ enrichmentStatus: 'pending' }).eq('id', job.entityId);
        }

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
          processedAt: now.toISOString(),
          lockedAt: null,
          lockedBy: null,
        })
        .eq('id', job.id);

      if (entityTable) {
        await supabaseAdmin.from(entityTable).update({
          enrichmentStatus: 'error',
          enrichmentError: `Validation failed after ${MAX_ATTEMPTS} attempts: ${validation.reason}`,
        }).eq('id', job.entityId);
      }

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
        processedAt: now.toISOString(),
        lockedAt: null,
        lockedBy: null,
      })
      .eq('id', job.id);

    // Update the entity record with the analysis
    if (entityTable) {
      const analysisPayload = statsSnapshot
        ? {
          ...(analysis as Record<string, unknown>),
          source_context_snapshot: statsSnapshot,
        }
        : analysis;

      await supabaseAdmin
        .from(entityTable)
        .update({
          analysis: analysisPayload,
          analysisGeneratedAt: now.toISOString(),
          enrichmentStatus: 'complete',
          enrichedAt: now.toISOString(),
          enrichmentError: null,
        })
        .eq('id', job.entityId);
    }

    log('info', 'worker_complete', `Enrichment completed for ${job.entityType} "${job.entityName}"`, {
      jobId: job.id, entityType: job.entityType, entityName: job.entityName,
    });

    return {
      processed: true,
      jobId: job.id,
      entityType: job.entityType,
      entityName: job.entityName,
      status: 'completed',
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    log('error', 'worker_error', `Enrichment failed for ${job.entityType} "${job.entityName}": ${errorMessage}`, {
      jobId: job.id, attempt: newAttempts, error: errorMessage,
    });

    if (newAttempts < MAX_ATTEMPTS) {
      const backoffMs = computeBackoffMs(newAttempts);
      const runAfter = new Date(now.getTime() + backoffMs).toISOString();

      await supabaseAdmin
        .from('EnrichmentQueue')
        .update({
          status: 'pending',
          lastError: errorMessage,
          runAfter,
          lockedAt: null,
          lockedBy: null,
        })
        .eq('id', job.id);

      if (entityTable) {
        await supabaseAdmin.from(entityTable).update({ enrichmentStatus: 'pending' }).eq('id', job.entityId);
      }
    } else {
      await supabaseAdmin
        .from('EnrichmentQueue')
        .update({
          status: 'failed',
          lastError: `Failed after ${MAX_ATTEMPTS} attempts: ${errorMessage}`,
          processedAt: now.toISOString(),
          lockedAt: null,
          lockedBy: null,
        })
        .eq('id', job.id);

      if (entityTable) {
        await supabaseAdmin.from(entityTable).update({
          enrichmentStatus: 'error',
          enrichmentError: `Failed after ${MAX_ATTEMPTS} attempts: ${errorMessage}`,
        }).eq('id', job.entityId);
      }
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
 * Hard cap at 50 to prevent runaway processing.
 */
export async function processAllPendingJobs(): Promise<{
  totalProcessed: number;
  results: Array<{ jobId: string; entityName: string; status: string }>;
}> {
  const results: Array<{ jobId: string; entityName: string; status: string }> = [];
  let totalProcessed = 0;
  const HARD_CAP = 50;

  log('info', 'batch_start', 'Starting batch processing of all pending jobs');

  // eslint-disable-next-line no-constant-condition
  while (totalProcessed < HARD_CAP) {
    const result = await processNextEnrichmentJob();

    if (!result.processed) break;

    totalProcessed++;
    results.push({
      jobId: result.jobId!,
      entityName: result.entityName!,
      status: result.status!,
    });

    // Brief pause between jobs to respect rate limits
    await sleep(1000);
  }

  log('info', 'batch_end', `Batch processing completed: ${totalProcessed} jobs processed`, {
    totalProcessed,
  });

  return { totalProcessed, results };
}

/**
 * Check the enrichment status for a specific entity.
 */
export async function getEnrichmentStatus(
  entityType: EntityType,
  entityId: string
): Promise<{ status: string; analysis?: AnalysisResult } | null> {
  const table = entityTableName(entityType);
  if (!table) return null;

  const { data: entity } = await supabaseAdmin
    .from(table)
    .select('analysis, analysisGeneratedAt, enrichmentStatus')
    .eq('id', entityId)
    .single();

  if (entity?.analysis && hasRenderableAnalysis(entity.analysis, entityType)) {
    return { status: 'completed', analysis: entity.analysis as AnalysisResult };
  }

  // Check the queue for more detailed status
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
// Backfill: find entities with missing analysis
// ============================================================

/**
 * Scan entity tables for records missing analysis and enqueue them.
 * Rate-limited: processes at most `batchSize` entities per call.
 *
 * Designed to be called from a cron job endpoint.
 */
export async function backfillMissingAnalysis(batchSize = 25): Promise<{
  enqueued: number;
  scanned: { companies: number; roles: number; locations: number };
}> {
  log('info', 'backfill_start', `Starting backfill scan (batch size: ${batchSize})`);

  let enqueued = 0;
  const remaining = () => batchSize - enqueued;

  // 1. Companies missing analysis
  const { data: companies } = await supabaseAdmin
    .from('Company')
    .select('id, name')
    .or('analysis.is.null,enrichmentStatus.eq.error,enrichmentStatus.eq.none')
    .limit(remaining());

  const companiesScanned = companies?.length ?? 0;
  if (companies) {
    for (const c of companies) {
      if (enqueued >= batchSize) break;
      const result = await queueEnrichment('Company', c.id, c.name);
      if (result) enqueued++;
    }
  }

  // 2. Roles (Jobs) missing analysis
  const { data: roles } = await supabaseAdmin
    .from('Role')
    .select('id, title')
    .or('analysis.is.null,enrichmentStatus.eq.error,enrichmentStatus.eq.none')
    .limit(remaining());

  const rolesScanned = roles?.length ?? 0;
  if (roles) {
    for (const r of roles) {
      if (enqueued >= batchSize) break;
      const result = await queueEnrichment('Job', r.id, r.title);
      if (result) enqueued++;
    }
  }

  // 3. Locations (Cities) missing analysis
  const { data: locations } = await supabaseAdmin
    .from('Location')
    .select('id, city, state')
    .or('analysis.is.null,enrichmentStatus.eq.error,enrichmentStatus.eq.none')
    .limit(remaining());

  const locationsScanned = locations?.length ?? 0;
  if (locations) {
    for (const loc of locations) {
      if (enqueued >= batchSize) break;
      const cityName = `${loc.city}, ${loc.state}`;
      const contextData = buildCityContextData({ city: loc.city, state: loc.state });
      const result = await queueEnrichment('City', loc.id, cityName, contextData);
      if (result) enqueued++;
    }
  }

  log('info', 'backfill_end', `Backfill completed: ${enqueued} enqueued`, {
    enqueued,
    scanned: { companies: companiesScanned, roles: rolesScanned, locations: locationsScanned },
  });

  return {
    enqueued,
    scanned: { companies: companiesScanned, roles: rolesScanned, locations: locationsScanned },
  };
}

// ============================================================
// Health check: recent enrichment jobs
// ============================================================

/**
 * Return the last N enrichment jobs for debugging/admin visibility.
 */
export async function getRecentEnrichmentJobs(limit = 20): Promise<EnrichmentJob[]> {
  const { data, error } = await supabaseAdmin
    .from('EnrichmentQueue')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(limit);

  if (error) {
    log('error', 'health_check_error', 'Failed to fetch recent jobs', { error: error.message });
    return [];
  }

  return (data || []) as EnrichmentJob[];
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
