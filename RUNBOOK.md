# AvgPay.com Development & Deployment Runbook

## Overview
This runbook documents the process for iterative development, Git workflow, PR creation, deployment to Vercel/Netlify, and troubleshooting common issues. Used for value-driven iterations (e.g., Iteration 5-6: salaries pagination/sorting + company pages).

## 1. Development Process (Value-First Iterations)
1. **Plan Iteration:** Generate use cases, prioritize by value/impact (e.g., sorting > pagination > company data).
2. **Code Changes:** Edit/write files in `/src/app/` (Next.js app dir):
   - Salaries: `src/app/salaries/page.tsx` (filters, DataTable, sorting via useMemo/sortConfig, pagination state).
   - Company pages: `src/app/company/[companyName]/page.tsx` (mock data, salary cards).
   - Data: `src/app/lib/data.ts` (constants: COMPANIES/ROLES/LOCATIONS/LEVELS).
   - Mock API: `src/app/api/salaries/route.ts`.
3. **Test Locally:** `npm run dev` (simulate filters/sorting/pagination).
4. **Commit Locally:** `git add . && git commit -m "feat: [iteration summary]"`.

## 2. Git Workflow (Avoid Conflicts)
**Always use new branch/PR:**
```
cd avgpay-rebuild
git checkout -b avgpay-iteration-X-Y
git add .
git commit -m "feat: Iteration X-Y - [changes]"
git push origin avgpay-iteration-X-Y
```

**Create PR:**
```
gh pr create --title "Deploy Iteration X-Y: [summary]" --body "[changes]. Ready for demo." --head avgpay-iteration-X-Y
```

## 3. Deployment
- **Vercel Preview:** Auto-triggers on branch push (e.g., `avgpay-rebuild-[branch-hash].vercel.app`).
- **Production:** Merge PR → deploys to main (e.g., `avgpay-rebuild-[prod-hash].vercel.app`).
- **Netlify:** Auto-deploys (checks: Header/Redirect rules).

**Check Deploys:**
```
vercel ls  # List all (find Ready production/preview)
vercel logs [deployment-url]  # Debug errors
gh pr checks [pr-number]  # CI status (Vercel/Netlify fails)
```

## 4. Common Issues & Fixes
| Issue | Symptoms | Fix |
|-------|----------|-----|
| **Git Push Rejected** | `rejected (fetch first)` | New branch/PR (no main push). Or `git pull --rebase origin main` → resolve conflicts → `git rebase --continue`. |
| **Merge Conflicts (package.json/lock)** | Rebase fails, `UU package.json` | `git checkout --theirs package.json package-lock.json && git add . && git rebase --continue`. Or manual edit. |
| **PR Not Mergeable** | Conflicts/protected branch | Resolve locally: `gh pr checkout [pr] && git merge origin/main` → commit/push. Or `--auto` flag. |
| **Build/404 Error** | Preview 404, Vercel/Netlify fail | Missing components (e.g., DataTable) → create placeholder. Check logs: `vercel logs [url]`. Ensure `next.config.js` routes. |
| **No Data on /salaries** | Empty table | Verify `/api/salaries` mock returns data matching filters. Check console/network. |
| **Protected Branch** | `enablePullRequestAutoMerge` error | Manual merge on GitHub UI or disable protection temporarily. |

## 5. Verification Checklist (Post-Deploy)
- [ ] /salaries: Filters work, sorting (click headers), pagination (10/25/50 rows, prev/next).
- [ ] Company links: Click → /company/Google → salary cards/mock data.
- [ ] Guides: No 404s (swe-compensation-2026, equity, etc.).
- [ ] SEO: Titles/metadata, sitemap.
- [ ] Mobile: Responsive DataTable/filters.

## 6. Next Iterations
- Backend: Real data (Supabase/Prisma).
- DataTable: Full Shadcn impl (if missing).
- Auth/Submit: User salary reports.

**Last Updated:** 2026-02-08 (Iteration 5-6 deploy)