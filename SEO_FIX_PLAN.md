# SEO Fix Plan

## Phase 1 (shipped)
1. Introduced shared index gating evaluator and noindex logic.
2. Enforced enrichment trigger rules (missing, stale, and threshold crossing checks).
3. Added schema bundles (WebPage, Dataset, FAQ) to Jobs, Companies, and Cities pages.
4. Expanded internal linking outputs for entity pages (top jobs, companies, cities, competitors).
5. Restricted sitemap entity entries to index-eligible pages.
6. Created trust-layer pages and exposed in site footer.

## Phase 2 (now shipped)
1. Added canonical URL and parameter dedupe hardening via middleware + canonical helpers.
2. Persisted Gemini enrichment metadata in structured storage (`EntityEnrichmentMetadata`) with migrations.
3. Added thin-content risk observability via admin API and dashboard card.
4. Added `metadataBase` canonical root config to remove metadata ambiguity in builds.

## Next Follow-up
1. Migrate key entity pages to server components for full SSR content delivery.
2. Add scheduled snapshots for thin-content risk trendlines and alerts.
