# Thin Content Elimination Plan — AvgPay

**Date:** 2026-02-12
**Status:** Phase 1 Implemented

---

## Philosophy

AvgPay must not behave like a "content factory." Every entity page must behave like:
- A salary report
- A decision-support tool
- An offer evaluation engine
- A compensation intelligence briefing

If a page is thin, we do not hide it — we make it genuinely useful.

---

## System Architecture

### 1. Detection: Thin Content Scoring (`src/lib/thinContentScoring.ts`)

Every entity page is scored 0-100 based on 11 weighted signals covering data depth,
content richness, linking, schema, and trust. The scoring function is deterministic
and runs without external dependencies.

**Scoring Flow:**
```
Entity Page Request → API Route → Compute Signals → Score (0-100) → Risk Level
                                                                    ↓
                                                          noindex / sitemap / enrichment priority
```

### 2. Elimination: DB-Derived Value Modules (Primary)

The primary defense against thin content is computed modules derived from existing
salary data in the database. No LLM is needed for these — they are deterministic
and scale to millions of pages.

**Modules per Entity Type:**

| Module | Job | City | Company | Source |
|---|---|---|---|---|
| Percentile Bands (P10-P90) | Yes | Yes | Yes | `SELECT totalComp` → sort → percentile math |
| Comp Mix Breakdown | Yes | Yes | Yes | `AVG(baseSalary/totalComp)`, `AVG(equity/totalComp)`, `AVG(bonus/totalComp)` |
| YoE Progression Ladder | Yes | — | — | `GROUP BY yearsExp bucket` → median per bucket |
| Data Confidence Score | Yes | Yes | Yes | Submission count + diversity score → label |
| Intent-Driven FAQs | Yes | Yes | Yes | Template + actual data values (median, P25, P75, top entity) |
| Top Entities Tables | Yes | Yes | Yes | `GROUP BY company/role/city` → median → sort desc |
| Nearby Cities | — | Yes | — | Static city cluster map for top 20 metro areas |
| External Authority Links | Yes | Yes | Yes | Curated list: BLS, SEC, Census, H-1B, Numbeo |
| Data Disclaimer | Yes | Yes | Yes | Static trust text with methodology link |

### 3. Enrichment: LLM Pipeline (Secondary)

When DB density is too sparse for meaningful computed modules, the existing LLM
enrichment pipeline (Gemini) generates analysis content. This is stored in the
entity's `analysis` JSON column.

**LLM Rules (Non-Negotiable):**
- LLM never invents salary numbers
- LLM generates only: explanations, FAQs, negotiation advice, career ladder logic, disclaimers
- All outputs stored with: entityType, entityId, timestamp, model name, confidence score
- Outputs validated by `hasRenderableAnalysis()` before display

**Enrichment Triggers:**
- New entity detected (no analysis exists)
- Entity page requested with missing analysis
- Submission count crosses threshold (5, 10, 25, 50)
- Analysis becomes stale (>90 days old via `shouldTriggerEnrichment()`)

**Queue System:** Existing async enrichment queue with:
- Deduplication via entity key
- Retry with exponential backoff
- Quality validation before storage
- Status polling from entity pages

### 4. Intent Classification (`src/lib/intentClassifier.ts`)

Every page is evaluated against required user intents for its entity type.
A page must satisfy 3+ intents to be considered non-thin.

**Intent Satisfaction Mapping:**

| Intent | Satisfied When... |
|---|---|
| Salary Benchmarking | Has salary range/percentile data |
| Offer Evaluation | Has salary range + comparisons or analysis |
| Negotiation | Has negotiation context or salary range + analysis |
| Career Progression | Has YoE progression or analysis content |
| Relocation Comparison | Has cost-of-living or comparison sections |
| Company Comparison | Has company breakdowns or comparison links |
| Equity Analysis | Has comp mix breakdown |
| Role Exploration | Has role-level rankings |

### 5. Internal Linking Engine (`src/lib/internalLinking.ts`)

Programmatic internal linking eliminates orphan pages and strengthens topical clusters.

**Link Generation Rules:**
- Job pages: top companies for role, top cities for role, related jobs
- City pages: top companies in city, top jobs in city, nearby/similar cities
- Company pages: top roles at company, top cities for company, competitors

**Nearby Cities:** Static cluster map covering 20 major tech markets with 5 similar
cities each. Rendered as clickable cards with internal links.

### 6. Crawl Budget Protection

**Sitemap Filtering:**
```
Entity → hasMinimumViableContent(count >= 3, hasAnalysis || hasFaq) → include/exclude
       → approximateSitemapPriority(count, hasAnalysis) → priority 0.2-0.9
```

**Noindex Gating:**
- Thin content score < 25 → `<meta name="robots" content="noindex,follow">`
- Enforced per-page via `evaluateIndexingEligibility()` in API responses

---

## Required Modules per Entity Type

### Job Page Modules (Minimum 3 Required)

1. Salary percentile bands (P10/P25/P50/P75/P90)
2. Compensation mix breakdown (base/equity/bonus %)
3. YoE progression ladder (0-2, 3-5, 6-10, 11-15, 16+ years)
4. Top paying companies for this role (linked)
5. Highest/lowest paying locations (linked)
6. Related jobs (linked)
7. Intent-driven FAQ (4+ questions with data-backed answers)
8. External authority links (BLS, H-1B data)
9. Data confidence indicator
10. Methodology disclaimer

### City Page Modules (Minimum 3 Required)

1. Salary percentile bands
2. Compensation mix breakdown
3. Top companies in city (linked)
4. Highest paying jobs in city (linked)
5. Nearby/similar cities (linked)
6. Intent-driven FAQ (4+ questions)
7. External authority links (BLS by state, Numbeo, Census)
8. Data confidence indicator
9. Methodology disclaimer

### Company Page Modules (Minimum 3 Required)

1. Salary percentile bands
2. Compensation mix breakdown
3. Top roles at company (linked)
4. Top cities for company (linked)
5. Intent-driven FAQ (4+ questions)
6. External authority links (BLS, SEC EDGAR, Glassdoor)
7. Data confidence indicator
8. Methodology disclaimer

---

## Caching Strategy

| Data Type | Cache Location | TTL |
|---|---|---|
| DB aggregates (percentiles, comp mix) | Computed per-request in API | ISR/SWR cache if converted to SSR |
| LLM analysis | Supabase `analysis` column | 90 days (stale trigger) |
| FAQ blocks | Generated per-request from data | Same as API response cache |
| External links | Static, curated in code | Updated with code deploys |
| Internal links | Computed per-request from DB | Same as API response cache |

---

## Future Enhancements

1. **Server-side rendering:** Convert entity pages to server components for SSR metadata
2. **Combination pages:** `/jobs/[jobTitle]/[city]` for long-tail queries
3. **State hub pages:** `/salaries/state/[state]` for topical hierarchy
4. **Salary trends:** Time-series median comp by quarter using submission dates
5. **Industry clustering:** Group companies by industry for better competitor linking
6. **Cost-of-living adjustment:** Pull CoL index and show adjusted compensation
