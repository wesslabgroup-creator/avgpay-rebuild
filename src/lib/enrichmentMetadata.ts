import type { AnalysisResult, EntityType } from '@/lib/types/enrichment';

interface FAQBlock {
  question: string;
  answer: string;
}

export interface EnrichmentMetadataPayload {
  entitySummary: string | null;
  faqBlocks: FAQBlock[];
  internalLinkingRecommendations: string[];
  confidenceScore: number | null;
  sources: string[];
  disclaimer: string | null;
  lastUpdated: string | null;
  analysisCore: Record<string, unknown>;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0).map((v) => v.trim());
}

function asFaqArray(value: unknown): FAQBlock[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const question = asString(record.question);
      const answer = asString(record.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((v): v is FAQBlock => v !== null);
}

export function splitAnalysisAndMetadata(analysis: AnalysisResult): EnrichmentMetadataPayload {
  const record = analysis as Record<string, unknown>;
  const {
    entity_summary,
    faq_blocks,
    internal_linking_recommendations,
    confidence_score,
    sources,
    disclaimer,
    last_updated,
    ...analysisCore
  } = record;

  const parsedConfidence =
    typeof confidence_score === 'number'
      ? confidence_score
      : typeof confidence_score === 'string' && confidence_score.trim().length > 0
        ? Number(confidence_score)
        : null;

  return {
    entitySummary: asString(entity_summary),
    faqBlocks: asFaqArray(faq_blocks),
    internalLinkingRecommendations: asStringArray(internal_linking_recommendations),
    confidenceScore: Number.isFinite(parsedConfidence as number) ? (parsedConfidence as number) : null,
    sources: asStringArray(sources),
    disclaimer: asString(disclaimer),
    lastUpdated: asString(last_updated),
    analysisCore,
  };
}

export function buildMetadataUpsertPayload(entityType: EntityType, entityId: string, meta: EnrichmentMetadataPayload) {
  return {
    entityType,
    entityId,
    entitySummary: meta.entitySummary,
    faqBlocks: meta.faqBlocks,
    internalLinkingRecommendations: meta.internalLinkingRecommendations,
    confidenceScore: meta.confidenceScore,
    sources: meta.sources,
    disclaimer: meta.disclaimer,
    modelLastUpdated: meta.lastUpdated,
    updatedAt: new Date().toISOString(),
  };
}
