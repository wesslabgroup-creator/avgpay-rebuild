-- Migration 003: Enrichment queue improvements + entity tracking fields
-- Adds: entityKey uniqueness, runAfter backoff, locking, enrichment tracking on entities

-- ============================================================
-- 1. Add enrichment tracking columns to entity tables
-- ============================================================

ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "enrichmentStatus" TEXT DEFAULT 'none';
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "enrichedAt" TIMESTAMP(3);
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "enrichmentError" TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "analysisVersion" INTEGER DEFAULT 1;

ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "enrichmentStatus" TEXT DEFAULT 'none';
ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "enrichedAt" TIMESTAMP(3);
ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "enrichmentError" TEXT;
ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "analysisVersion" INTEGER DEFAULT 1;

ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "enrichmentStatus" TEXT DEFAULT 'none';
ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "enrichedAt" TIMESTAMP(3);
ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "enrichmentError" TEXT;
ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "analysisVersion" INTEGER DEFAULT 1;

-- ============================================================
-- 2. Add new columns to EnrichmentQueue
-- ============================================================

-- entityKey for deduplication (e.g., "Company:google", "City:austin-tx")
ALTER TABLE "EnrichmentQueue" ADD COLUMN IF NOT EXISTS "entityKey" TEXT;
-- Backoff: do not process before this timestamp
ALTER TABLE "EnrichmentQueue" ADD COLUMN IF NOT EXISTS "runAfter" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
-- Locking: prevent double-processing
ALTER TABLE "EnrichmentQueue" ADD COLUMN IF NOT EXISTS "lockedAt" TIMESTAMP(3);
ALTER TABLE "EnrichmentQueue" ADD COLUMN IF NOT EXISTS "lockedBy" TEXT;

-- Populate entityKey for existing rows
UPDATE "EnrichmentQueue"
SET "entityKey" = "entityType" || ':' || LOWER(REPLACE(REPLACE(TRIM("entityName"), ' ', '-'), ',', ''))
WHERE "entityKey" IS NULL;

-- Make entityKey NOT NULL after populating
ALTER TABLE "EnrichmentQueue" ALTER COLUMN "entityKey" SET NOT NULL;

-- Unique constraint: only one active (pending/processing) job per entity key
CREATE UNIQUE INDEX IF NOT EXISTS "EnrichmentQueue_entityKey_active_idx"
ON "EnrichmentQueue"("entityKey")
WHERE "status" IN ('pending', 'processing');

-- Index for worker polling: pending jobs ready to run
CREATE INDEX IF NOT EXISTS "EnrichmentQueue_worker_poll_idx"
ON "EnrichmentQueue"("status", "runAfter")
WHERE "status" = 'pending';
