CREATE TABLE IF NOT EXISTS "EntityEnrichmentMetadata" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "entitySummary" TEXT,
  "faqBlocks" JSONB,
  "internalLinkingRecommendations" JSONB,
  "confidenceScore" DOUBLE PRECISION,
  "sources" JSONB,
  "disclaimer" TEXT,
  "modelLastUpdated" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("entityType", "entityId")
);

CREATE INDEX IF NOT EXISTS "idx_entity_enrichment_metadata_entity" ON "EntityEnrichmentMetadata" ("entityType", "entityId");
