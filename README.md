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

This migration creates:
- `"EnrichmentQueue"` table (async enrichment jobs)
- `"analysis"` + `"analysisGeneratedAt"` on `"Company"`, `"Role"`, and `"Location"`


### Enrichment pipeline troubleshooting checklist
Use this when queueing/processing appears stalled.

1. **DB trigger wiring (required for direct Salary table inserts)**
   - Run `supabase/migrations/20260217_enrichment_pipeline_repair.sql`.
   - This guarantees the `enqueue_enrichment_from_salary` trigger exists on `public."Salary"` and inserts into `public."EnrichmentQueue"`.

2. **Processing worker (required for LLM output to appear)**
   - Supabase cron is **not** required for this project path.
   - Processing is done by app endpoints:
     - `GET /api/cron/process-enrichment` (daily safety + backfill)
     - `POST /api/enrichment-queue?mode=single` (near-real-time worker call)

3. **Hobby plan limitation workaround**
   - Because Supabase cron can be 1/day on hobby, use a DB webhook on `public.EnrichmentQueue` INSERT to call `POST /api/enrichment-queue?mode=single`.
   - Keep daily Vercel cron for retries/recovery.

4. **Manual recovery for missing analysis**
   - Run: `select public.backfill_missing_enrichment_jobs(100);`
   - This queues entities where analysis is null or status is `none/error`.

### Hobby-plan stabilization pattern (cron runs once/day)
- Keep daily cron enabled for safety (`/api/cron/process-enrichment`).
- Add a Supabase Database Webhook on `public.EnrichmentQueue` `INSERT` that calls `POST /api/enrichment-queue?mode=single`.
- Send `Authorization: Bearer <ENRICHMENT_API_KEY>` in webhook headers.

This gives near-real-time processing on queue inserts while the daily cron still handles retries/backfill.

## Security Checks
```bash
npm run audit:deps
```

This wrapper runs `npm audit --audit-level=moderate` and treats registry advisory endpoint blocks (HTTP 403) as an environment warning so local runs in restricted networks don't fail noisily. Run the same check in CI with unrestricted registry access for enforcement.
