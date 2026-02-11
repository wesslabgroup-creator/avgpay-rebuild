# Navigation + Internal Linking Audit (Phase 1 & 2)

## Crawl methodology (evidence)
- Route inventory crawl from filesystem routes: `node scripts/navigation-audit.js`.
- Internal link consistency check for guide pages: `npm run check:links`.
- Sitemap coverage review: `src/app/sitemap.ts` and `public/sitemap.xml`.

## Navigation map

### Existing top-level navigation (before)
- Home
- Salaries
- Companies
- Guides
- Several individual tools (Inflation, Compare, Negotiate, Equity)
- Contribute
- Check Your Value
- Analyze Offer

### Existing top-level navigation (after)
- Home
- Salaries
- Companies
- Comparisons
- Guides
- Tools
- Methodology
- Contribute Data
- Analyze Offer

### Ideal architecture (implemented)
- **Hubs (top-level):** Salaries, Companies, Comparisons, Guides, Tools.
- **Conversion routes from all hubs:** Analyze Offer, Analyze Salary, Submit Salary.
- **Supporting trust pages:** Methodology, About, Privacy.

## Crawl findings (from `docs/navigation-audit-output.json`)
- Total routes discovered: **39**.
- Static-link orphan candidates: dynamic or template-literal pages appear under-linked in static analysis (expected for dynamic routing and programmatic link generation).
- Broken internal links from static analysis: **0**.

## Internal linking findings
- Hub pages already existed (`/tools`, `/guides`, `/compare`) but lacked strong upward/downward navigation from all discovery pages.
- `/salaries` and `/companies` had weaker “next-step” paths into high-conversion flows.
- Site-wide footer did not exist, reducing crawl paths to deep pages.
- Breadcrumb trails did not exist, limiting hierarchical context and crawl depth cues.

## Prioritized improvements (implemented)
1. Add clear hub-first navigation (Salaries, Companies, Comparisons, Guides, Tools, Methodology).
2. Add site-wide breadcrumbs for hierarchical navigation and crawl clarity.
3. Add a structured footer with deep links to hub and spoke pages.
4. Add related content modules on Salaries, Companies, and Compare hub pages.
5. Expand sitemap route coverage for all key public tools and conversion pages.

## Hub/spoke model
- **Hubs:** `/salaries`, `/companies`, `/compare`, `/guides`, `/tools`.
- **Spokes:** tool detail pages, guide detail pages, analyzer pages.
- **Flow logic:**
  - Top pages link downward to tools/guides.
  - Related pages cross-link laterally (e.g., compare ↔ guides ↔ tools).
  - Deep pages can return upward via breadcrumbs and footer hub links.

## Anchor text strategy
- Replaced generic labels with intent-rich text such as:
  - “Company vs company compensation comparisons”
  - “Compensation Breakdown Calculator”
  - “Salary benchmarks by role and location”
  - “Negotiation playbook”

## Remaining recommendations
- Add dynamic route index pages for `/jobs/[jobTitle]` and `/company/[companyName]` discovery pathways if these are SEO targets.
- Add XML sitemap partitioning if dynamic comparison/job/company pages scale significantly.

## Runtime crawl simulation (rendered links)
- Crawl command: Playwright BFS crawl from `/` over rendered `<a>` links.
- Pages discovered: **35**.
- Max depth from home: **3** clicks.
- Crawl failures: **0**.
- Unreachable pages from discovered set: **0**.
- Key discovered high-value routes include `/compare`, `/tools`, `/guides/*`, `/tools/*`, and conversion paths (`/analyze-offer`, `/analyze-salary`, `/submit`).
