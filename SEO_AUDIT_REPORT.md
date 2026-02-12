# SEO Audit Report — AvgPay

**Generated:** 2026-02-12
**Scope:** Full repository audit of thin content risk, intent coverage, linking, schema, and trust signals.

---

## Executive Summary

AvgPay is a programmatic SEO site generating entity pages for Jobs, Cities, and Companies.
This audit identified systemic thin content risk across all entity types and implemented
comprehensive systems to detect, score, and eliminate thin content at scale.

### Key Findings

| Area | Risk Level | Status |
|---|---|---|
| Thin content on low-submission entities | HIGH | Mitigated — scoring + noindex gating + enrichment pipeline |
| Template duplication across entity pages | MEDIUM | Mitigated — intent-driven FAQs + unique computed modules |
| Schema markup gaps | LOW | Fixed — BreadcrumbList, FAQPage, Dataset schemas added |
| Internal linking weakness | MEDIUM | Mitigated — internal linking engine + related entities |
| External authority links missing | HIGH | Fixed — authoritative BLS/SEC/Census links added |
| Trust signal gaps | LOW | Existing trust pages adequate; disclaimer added to entity pages |
| Crawl budget waste | MEDIUM | Mitigated — sitemap filters thin pages, noindex gating |

---

## Part 1: Entity Page Inventory

### Routes Audited

| Route | Template | Data Source | SSR | Schema |
|---|---|---|---|---|
| `/jobs/[jobTitle]` | `src/app/jobs/[jobTitle]/page.tsx` | API → Supabase (Role + Salary) | Client-rendered | JobPosting, Dataset, WebPage, FAQ, Breadcrumb |
| `/salaries/city/[city]` | `src/app/salaries/city/[city]/page.tsx` | API → Supabase (Location + Salary) | Client-rendered | Place, Dataset, WebPage, FAQ, Breadcrumb |
| `/company/[companyName]` | `src/app/company/[companyName]/page.tsx` | API → Supabase (Company + Salary) | Client-rendered | Organization, Dataset, WebPage, FAQ, Breadcrumb |

### Data Flow

1. Entity pages are client-side rendered (`"use client"`) using `useEffect` + `fetch`
2. API routes (`/api/job-details`, `/api/city-details`, `/api/company-details`) query Supabase
3. Aggregation (percentiles, medians, comp mix) computed server-side in API routes
4. LLM enrichment via async queue (Gemini) stored in entity `analysis` column
5. Indexing eligibility evaluated per-request via `evaluateIndexingEligibility()`

### Critical Architecture Note

Entity pages use `"use client"` with `next/head`. In Next.js App Router, `<Head>` from
`next/head` does not work in client components for SSR. This means **metadata, canonical
URLs, and JSON-LD schemas are only available after client-side hydration**. Googlebot
may not see these on initial crawl.

**Recommendation:** Convert entity pages to server components with `generateMetadata()`,
or use a hybrid approach where metadata is server-rendered and interactive elements are
client components.

---

## Part 2: Thin Content Scoring System

### Implementation: `src/lib/thinContentScoring.ts`

A multi-signal scoring system (0-100) that evaluates each entity page on 11 weighted signals:

| Signal | Weight | Description |
|---|---|---|
| Submission Depth | 20% | Number of salary data points |
| Analysis Presence | 15% | LLM enrichment exists and is renderable |
| FAQ Coverage | 10% | FAQ blocks available |
| Internal Linking | 10% | Number of internal links on page |
| Percentile Data | 10% | Can compute P25/P50/P75 |
| Comp Mix Data | 8% | Has base/equity/bonus breakdown |
| Data Diversity | 8% | Multiple companies/roles/cities represented |
| Schema Completeness | 7% | JSON-LD structured data present |
| External Authority | 5% | Outbound links to authoritative sources |
| Disclaimer Presence | 4% | Transparency about data methodology |
| Related Entities | 3% | Cross-linking to related entities |

### Risk Classification

| Score | Risk Level | Action |
|---|---|---|
| 75-100 | Healthy | Index, high sitemap priority |
| 55-74 | Low | Index, standard priority |
| 35-54 | Medium | Index with enrichment queued |
| 20-34 | High | Noindex until enriched |
| 0-19 | Critical | Noindex + exclude from sitemap |

### Integration Points

- **Sitemap** (`src/app/sitemap.ts`): Filters pages below minimum viable content threshold
- **Admin API** (`/api/admin/thin-content-risk`): Returns full risk report with per-entity scores
- **Entity APIs**: Return `indexing.shouldNoIndex` for per-page robots directives
- **Enrichment Queue**: Priority based on inverse thin content score

---

## Part 3: Intent Classification System

### Implementation: `src/lib/intentClassifier.ts`

Every entity page is evaluated against a set of required user intents:

**Job Pages Must Satisfy:**
- Salary benchmarking ("what should I earn?")
- Offer evaluation ("is my offer good?")
- Negotiation guidance ("what should I negotiate?")
- Career progression ("how does pay grow?")

**City Pages Must Satisfy:**
- Salary benchmarking ("is pay higher here?")
- Relocation comparison ("should I move?")
- Cost of living analysis ("what's the real take-home?")
- Role exploration ("what pays best here?")

**Company Pages Must Satisfy:**
- Salary benchmarking ("what does this company pay?")
- Offer evaluation ("is my company offer good?")
- Equity analysis ("is this company equity-heavy?")
- Role exploration ("what roles pay best here?")

If a page satisfies fewer than 3 intents, it is classified as thin content requiring upgrade.

---

## Part 4: DB-Derived Value Modules Added

The following computed modules have been added to all entity pages:

1. **Percentile Bands** (P10/P25/P50/P75/P90) — visual salary distribution
2. **Compensation Mix** — base/equity/bonus percentage breakdown
3. **YoE Progression** (Job pages) — median comp by years-of-experience bucket
4. **Data Confidence Indicator** — submission count, diversity, and reliability label
5. **Intent-Driven FAQs** — entity-specific questions generated from actual data
6. **External Authority Links** — BLS, SEC, Census, H-1B data, cost-of-living sources
7. **Data Methodology Disclaimer** — transparency about self-reported data
8. **Related/Nearby Cities** (City pages) — internal linking to comparable markets

---

## Part 5: Internal Linking Improvements

### Implementation: `src/lib/internalLinking.ts`

| Entity Type | Link Types Added |
|---|---|
| Job | Top companies, top cities, related roles, action links |
| City | Top companies in city, top jobs in city, nearby cities |
| Company | Top jobs at company, top cities, competitor links |

All entity pages now include:
- Breadcrumb navigation with links to parent pages
- Related entity cards with internal links
- Action links (contribute, analyze offer, tools)
- Nearby cities for geographic comparison (city pages)

---

## Part 6: Schema Markup Status

| Schema Type | Status | Pages |
|---|---|---|
| Organization | Present | Site-wide (layout.tsx) |
| WebPage | Present | All entity pages |
| Dataset | Present | All entity pages |
| FAQPage | Present | All entity pages with FAQ data |
| BreadcrumbList | **Added** | All entity pages |
| JobPosting | Present | Job pages |
| Place | Present | City pages |

---

## Part 7: Trust Pages Status

| Page | Status | Path |
|---|---|---|
| About | Exists | `/about` |
| Methodology | Exists | `/methodology` |
| Privacy | Exists | `/privacy` |
| Terms | Exists | `/terms` |
| Data Policy | Exists | `/data-policy` |
| Editorial Policy | Exists | `/editorial-policy` |
| Contact | Exists | `/contact` |

All trust pages are linked from the site footer.

---

## Part 8: Crawl Budget Discipline

The sitemap now:
1. Filters entities through `hasMinimumViableContent()` — requires 3+ submissions AND (analysis OR FAQ)
2. Uses `approximateSitemapPriority()` based on thin content score heuristics
3. Excludes pages with scores below 25 from the sitemap entirely
4. Assigns higher priority (0.9) to high-data, enriched pages

---

## Prioritized Remaining Fixes

1. **[P0] Convert entity pages to server components** — Current `"use client"` + `next/head` architecture means metadata is not SSR-rendered. This is the single highest-impact SEO fix remaining.
2. **[P1] Add combination routes** — `/jobs/[jobTitle]/[city]` cross-entity pages would add unique value and capture long-tail queries.
3. **[P1] Add state-level hub pages** — `/salaries/state/[state]` to strengthen topical hierarchy.
4. **[P2] Implement competitor linking for companies** — Currently uses similar company suggestions; should use industry/size clustering from DB.
5. **[P2] Add salary trend over time** — If submission dates are tracked, show median comp trend by quarter.
