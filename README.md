# AvgPay - Data-Driven Salary Insights

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Prisma + PostgreSQL
- Recharts (data visualization)
- Lucide React (icons)

## Features
- **Offer Analyzer**: Compare your compensation against verified market data
- **Programmatic SEO**: Dynamic pages for company/role/location combinations
- **PAS Copy Framework**: Problem-Agitation-Solution messaging
- **Dark Mode**: Built-in dark theme
- **Responsive**: Mobile-first design

## Data Sources
- Bureau of Labor Statistics (BLS)
- H-1B Labor Condition Applications
- Pay Transparency Law Postings

## Development
```bash
npm install
npm run dev
```

## Database
```bash
npx prisma generate
npx prisma db push
npx prisma studio
```

### Supabase migration required for Gemini enrichment
If company/job pages are missing Gemini analysis and Supabase errors mention missing columns/table, run:

```bash
supabase db push
```

Or paste `supabase/migrations/20260211_add_enrichment_queue.sql` into the Supabase SQL Editor.

Then apply `supabase/migrations/20260216_salary_enrichment_triggers.sql` to enable DB-level queueing from `Salary` inserts/updates (recommended for hobby plans).

Important: SQL migrations do **not** run automatically in production just because they exist in the repo. You must apply them once (via `supabase db push` or Supabase SQL Editor). After they are applied, the DB trigger runs automatically on every matching `Salary` insert/update event.

This migration creates:
- `"EnrichmentQueue"` table (async enrichment jobs)
- `"analysis"` + `"analysisGeneratedAt"` on `"Company"`, `"Role"`, and `"Location"`

### Hobby-plan stabilization pattern (cron runs once/day)
- Keep daily cron enabled for safety (`/api/cron/process-enrichment`).
- Add a Supabase Database Webhook on `public.EnrichmentQueue` `INSERT` that calls `POST /api/enrichment-queue?mode=single`.
- Send `Authorization: Bearer <ENRICHMENT_API_KEY>` in webhook headers.

This gives near-real-time processing on queue inserts while the daily cron still handles retries/backfill.

### If queue items stay `pending`/`processing` with no `result`
Common root causes:
- No active scheduler/trigger calling `/api/enrichment-queue` or `/api/cron/process-enrichment`.
- Invalid LLM credentials/model (e.g., Gemini API key invalid or unsupported model).
- Old malformed `entityKey` values from early trigger SQL (fixed by `20260216_fix_enrichment_entity_key_normalization.sql`).

Quick checks:
```sql
-- Count queue by status
select status, count(*) from public."EnrichmentQueue" group by status order by status;

-- See latest failures
select id, "entityType", "entityName", attempts, "lastError", "runAfter"
from public."EnrichmentQueue"
order by "createdAt" desc
limit 25;
```

Operational note:
- Supabase **Cron** is optional if your webhook is correctly firing to `/api/enrichment-queue?mode=single`.
- But you still want at least one periodic runner (daily is fine) for retries/backfill.

## Security Checks
```bash
npm run audit:deps
```

This wrapper runs `npm audit --audit-level=moderate` and treats registry advisory endpoint blocks (HTTP 403) as an environment warning so local runs in restricted networks don't fail noisily. Run the same check in CI with unrestricted registry access for enforcement.
