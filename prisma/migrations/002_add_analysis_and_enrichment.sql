-- Add analysis JSONB columns to entity tables for Gemini-generated content
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "analysis" JSONB;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "analysisGeneratedAt" TIMESTAMP(3);

ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "analysis" JSONB;
ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "analysisGeneratedAt" TIMESTAMP(3);

ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "analysis" JSONB;
ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "analysisGeneratedAt" TIMESTAMP(3);

-- Create EnrichmentQueue table for async background processing
CREATE TABLE IF NOT EXISTS "EnrichmentQueue" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,       -- 'Company', 'City', 'Job'
    "entityId" TEXT NOT NULL,         -- FK to the entity table
    "entityName" TEXT NOT NULL,       -- Human-readable name for the prompt
    "contextData" JSONB,             -- Additional context (e.g., state tax status, COL tier)
    "status" TEXT NOT NULL DEFAULT 'pending',  -- pending, processing, completed, failed
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "result" JSONB,                  -- The generated analysis JSON
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "EnrichmentQueue_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EnrichmentQueue_status_idx" ON "EnrichmentQueue"("status");
CREATE INDEX IF NOT EXISTS "EnrichmentQueue_entityType_entityId_idx" ON "EnrichmentQueue"("entityType", "entityId");
