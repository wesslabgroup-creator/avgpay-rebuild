import { supabaseAdmin } from '@/lib/supabaseClient';
import {
  generateSEOFinancialContent,
  type EntityType,
  type SEOContentResponse,
} from '@/lib/seoContentGenerator';

const CONTENT_TYPE = 'seo_financial_analysis';
const GENERATOR_ID = 'gemini-1.5-flash';

/**
 * Retrieves cached SEO financial content from Supabase, or generates
 * fresh content via Gemini and caches it. This ensures:
 * - Each entity gets unique, AI-generated content exactly once
 * - Pages load fast (DB read vs. API call)
 * - No duplicate content across pages (each entity's content is distinct)
 */
export async function getCachedSEOContent(
  entityType: EntityType,
  entityName: string,
  contextData: string,
): Promise<SEOContentResponse> {
  // 1. Check the cache
  const cached = await readFromCache(entityType, entityName);
  if (cached) return cached;

  // 2. Cache miss — generate fresh content
  const content = await generateSEOFinancialContent(entityType, entityName, contextData);

  // 3. Store in cache (fire and forget — don't block the response)
  writeToCache(entityType, entityName, content).catch((err) =>
    console.error('Failed to cache SEO content:', err),
  );

  return content;
}

/**
 * Pre-generates and caches SEO content for a newly created entity.
 * Called from submit-salary when a new company, job, or location is created.
 */
export async function preGenerateSEOContent(
  entityType: EntityType,
  entityName: string,
  contextData: string,
): Promise<void> {
  // Check if already cached (idempotent)
  const existing = await readFromCache(entityType, entityName);
  if (existing) return;

  const content = await generateSEOFinancialContent(entityType, entityName, contextData);
  await writeToCache(entityType, entityName, content);
}

// ── Internal helpers ────────────────────────────────────────────────────────

async function readFromCache(
  entityType: EntityType,
  entityName: string,
): Promise<SEOContentResponse | null> {
  try {
    const dbEntityType = entityType.toLowerCase(); // 'company' | 'city' | 'job'

    const { data, error } = await supabaseAdmin
      .from('ai_content_log')
      .select('content')
      .eq('entity_type', dbEntityType)
      .eq('content_type', CONTENT_TYPE)
      .ilike('generated_by', entityName)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data?.content) return null;

    return JSON.parse(data.content) as SEOContentResponse;
  } catch {
    return null;
  }
}

async function writeToCache(
  entityType: EntityType,
  entityName: string,
  content: SEOContentResponse,
): Promise<void> {
  const dbEntityType = entityType.toLowerCase();

  await supabaseAdmin.from('ai_content_log').insert({
    entity_type: dbEntityType,
    entity_id: crypto.randomUUID(),
    content_type: CONTENT_TYPE,
    generated_by: entityName, // Use entity name for lookup (no FK needed)
    content: JSON.stringify(content),
  });
}
