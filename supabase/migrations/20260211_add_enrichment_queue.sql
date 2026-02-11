-- Gemini enrichment support for Company/Role/Location detail pages.
-- Run this in Supabase SQL editor (or via `supabase db push`) if these objects do not exist.

-- 1) Add analysis columns to entity tables.
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "analysis" JSONB;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "analysisGeneratedAt" TIMESTAMP(3);

ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "analysis" JSONB;
ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "analysisGeneratedAt" TIMESTAMP(3);

ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "analysis" JSONB;
ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "analysisGeneratedAt" TIMESTAMP(3);

-- 2) Create async queue table used by /api/enrichment-queue and /api/enrichment-status.
CREATE TABLE IF NOT EXISTS "EnrichmentQueue" (
  "id" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "entityName" TEXT NOT NULL,
  "contextData" JSONB,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "result" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  CONSTRAINT "EnrichmentQueue_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EnrichmentQueue_status_idx" ON "EnrichmentQueue"("status");
CREATE INDEX IF NOT EXISTS "EnrichmentQueue_entityType_entityId_idx" ON "EnrichmentQueue"("entityType", "entityId");
