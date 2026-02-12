# SEO Audit Report

## Route and template audit
- `/jobs/[jobTitle]`, `/company/[companyName]`, `/salaries/city/[city]` were dynamic client-rendered pages backed by API routes.
- Pages already had enrichment triggers, but indexing eligibility rules were not enforced in robots meta.
- Entity sitemap inclusion was missing; sitemap only contained static routes and guides.

## Thin content risks identified
- Pages with low submission counts could still be indexable and render mostly repeated narrative shells.
- Existing fallback narratives were template-like when no analysis existed.
- Pages could ship with sparse data and no index gating.

## Crawl/indexing issues
- Sitemap did not include index eligibility checks for entity pages.
- No systematic `noindex,follow` gating for low-value pages.
- Canonical/robots behavior depended on static metadata only.

## Trust signal gaps
- Missing trust-layer pages: `/contact`, `/terms`, `/data-policy`, `/editorial-policy`.
- Footer did not include complete trust navigation.

## Schema gaps
- Entity pages had partial schema (mostly JobPosting/Place only).
- Missing robust JSON-LD for WebPage, Dataset, FAQ on key salary entity pages.

## Actions shipped in this change
- Added index gating logic and robots meta propagation from APIs to page templates.
- Added stale/threshold enrichment triggering helpers.
- Added FAQ generation fallback per entity to support FAQ schema.
- Added trust pages and footer links.
- Updated sitemap to include only index-eligible entities and trigger enrichment for stale jobs.


## Phase 2 progress update
- Added URL canonicalization utilities and middleware deduplication of tracking parameters/path variants.
- Added structured enrichment metadata persistence table and runtime upsert in enrichment completion flow.
- Added thin-content risk monitor endpoint and surfaced sampled risk metrics in admin dashboard.
