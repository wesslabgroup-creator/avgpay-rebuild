CREATE TABLE IF NOT EXISTS "Comparison" (
    "id" TEXT NOT NULL,
    "entityAType" TEXT NOT NULL,
    "entityAId" TEXT NOT NULL,
    "entityAName" TEXT NOT NULL,
    "entityASlug" TEXT NOT NULL,
    "entityBType" TEXT NOT NULL,
    "entityBId" TEXT NOT NULL,
    "entityBName" TEXT NOT NULL,
    "entityBSlug" TEXT NOT NULL,
    "statsSnapshot" JSONB,
    "insights" JSONB,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comparison_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Comparison_entityAType_entityAId_entityBType_entityBId_key"
ON "Comparison"("entityAType", "entityAId", "entityBType", "entityBId");

CREATE INDEX IF NOT EXISTS "Comparison_status_updatedAt_idx"
ON "Comparison"("status", "updatedAt");
