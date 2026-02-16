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
   - Configure `ENRICHMENT_API_KEY` (or reuse `CRON_SECRET`) and send it as `Authorization: Bearer <key>`; the endpoint now validates against those dedicated keys.
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

## Pricing storefront & simulated checkout funnel

### New routes
- `/pricing`
- `/products/salary-negotiation-kit`
- `/products/compensation-benchmark-report`
- `/products/career-pay-blueprint`
- `/checkout/[productSlug]` (simulated checkout)
- `/delivery/[productSlug]?token=demo` (post-purchase demo delivery; noindex)

### Digital product assets
All downloadable deliverables are under:
- `public/products/salary-negotiation-kit/` (source files for kit bundle)
- `public/products/compensation-benchmark-report/`
- `public/products/career-pay-blueprint/`
- `src/app/api/download/salary-negotiation-kit/route.ts` (runtime ZIP bundle endpoint)

### Replacing simulated checkout with real payment later
Current flow routes users from `/checkout/[productSlug]` to `/delivery/[productSlug]?token=demo` when they click **Complete purchase (simulated)**.
To enable real checkout later, replace that handler/link with a payment-provider redirect (for example Stripe Checkout Session creation + redirect URL) and only allow delivery access after payment verification.

### Manual test checklist
1. Open `/pricing` and confirm all 3 products + prices are visible, with **Best Seller** on Compensation Benchmark Report.
2. Open each detail page from pricing and verify hero, features, who-it's-for, and Buy now CTA.
3. Click Buy now and verify `/checkout/[productSlug]` order summary shows the matching product and price.
4. Click **Complete purchase (simulated)** and verify redirect to `/delivery/[productSlug]?token=demo`.
5. Verify each delivery page shows simulated receipt and working download buttons for real files.
6. Open `/delivery/[productSlug]` without token and verify gated message links back to `/pricing`.
