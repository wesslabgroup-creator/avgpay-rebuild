# Navigation + Internal Linking Audit (Shipped)

## Crawl evidence
- Static source crawl summary: `docs/crawl-audit.json`
  - 39 total routes discovered in `src/app`
  - 33 indexable routes (admin/auth/api excluded)
  - 0 broken internal links in source-level href extraction
- Live app crawl sample (homepage BFS depth=2): `docs/live-crawl-sample.json`
  - 39 reachable paths discovered
  - Max depth observed: 2
  - Includes all high-value hubs (`/tools`, `/guides`, `/compare`, `/salaries`) and key conversion pages.

## Phase 1: Navigation audit (existing vs ideal)

### Existing navigation map (before refactor)
- Primary nav was mixed hub + deep links, with no dedicated `/tools` hub link in top-level menu.
- Tool-specific links crowded global nav and reduced clarity of information architecture.
- No global footer with topical clusters.
- No shared breadcrumb system for deep route context.

### Ideal navigation map (implemented)
- **Top-level hub-first menu**:
  - Salaries → Companies → Compare → Tools → Guides → Pricing
- **Conversion CTAs**:
  - Analyze Offer
  - Submit Data
- **Secondary discovery layer (mobile)**:
  - Popular resource links (Negotiation Email Tool, Comp Breakdown, Negotiation Guide, Equity Guide)
- **Global footer taxonomy**:
  - Salary Research
  - Guides & Tools
  - Conversion Paths
  - Company
- **Context navigation**:
  - Breadcrumbs on guides and tools/compare route trees.

### Prioritized issues and fixes
1. **Top nav clarity issue (fixed)**: replaced mixed deep links with a clear hub-first IA.
2. **Weak cross-section discovery (fixed)**: added global clustered footer links.
3. **Deep-page context gaps (fixed)**: added breadcrumbs to guides and tool/compare sections.
4. **Weak onward journeys (fixed)**: added “Next best pages” modules for tools and compare flows.

## Phase 2: Internal linking audit (SEO + UX)

### Findings
- **Broken links**: none detected by static source crawl.
- **Pages with too many outbound links**: none over 20 source-level links in page components.
- **Orphan-like dynamic pages in static parse**: several dynamic routes remain undercounted by source parsing because many links are generated via mapped data structures; verified via live crawl sample that key dynamic public pages are reachable within depth 2.

### Hub and spoke structure (implemented)
- **Hubs**:
  - `/salaries`, `/companies`, `/compare`, `/guides`, `/tools`
- **Spokes**:
  - Tool detail pages under `/tools/*`
  - Guide detail pages under `/guides/*`
  - Curated comparisons under `/compare/[slug]`
  - Salary role-location pages under `/salaries/[role]/[location]`
- **Link direction logic**:
  - Top pages link downward (global nav/footer/modules)
  - Related pages cross-link laterally (tools ↔ guides, compare ↔ analyzers)
  - Deep pages link upward via breadcrumbs.

### Anchor text strategy updates
- Replaced generic/short labels with descriptive intent labels:
  - “Compensation Breakdown Calculator” instead of ambiguous short labels
  - “Analyze this offer with personalized benchmarks” for conversion path links
  - “Explore salary ranges by role and location” for data-discovery links.

### Related modules added
- Tools layout: “Next best pages for compensation planning”
- Compare layout: “Keep your comparison momentum”
- About + Guides pages: strategic next-step links
- Global footer: expanded internal links by topical cluster.

## Phase 3: Crawlability + indexation improvements

### Shipped crawl/index changes
- Updated `scripts/generate-sitemap.js` to:
  - exclude admin/auth/dashboard/login/signup/api
  - include core hubs + guide slugs + comparison slugs
  - output a focused 34-URL sitemap.
- Updated Next metadata sitemap (`src/app/sitemap.ts`) to include tools, compare, conversion routes, guides, and curated comparison pages.
- Updated robots directives (`src/app/robots.ts` and `public/robots.txt`) to disallow non-index routes and point to canonical sitemap URL.

### Recommendations (next iteration)
- Add automated crawl graph checks in CI (route reachability and click-depth budgets).
- Add breadcrumbs JSON-LD for enhanced SERP appearance.
- Add “Related comparisons” blocks on each `/compare/[slug]` page for stronger lateral cluster linking.
