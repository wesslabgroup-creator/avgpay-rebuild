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

This migration creates:
- `"EnrichmentQueue"` table (async enrichment jobs)
- `"analysis"` + `"analysisGeneratedAt"` on `"Company"`, `"Role"`, and `"Location"`
