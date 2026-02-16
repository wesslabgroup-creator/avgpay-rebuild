# Production Readiness Audit (2026-02-15)

## Scope
Audit focus requested: **speed/performance**, **security**, and **other must-have production readiness work** for the current Next.js/Supabase codebase.

## Checks Executed
1. `npm run lint` ✅ (no ESLint errors)
2. `npm run build` ✅ (production build completed; route bundle sizes captured)
3. `npm run check:links` ✅ (internal link check passed)
4. `npm audit --audit-level=moderate` ⚠️ (blocked by npm registry 403 in this environment)

## Executive Summary
Current status: **Not fully production-ready yet** for security hardening and operational resilience. Core app quality and build health are good, but several high-risk gaps should be closed before broad launch.

- **Performance**: baseline is acceptable, but a few heavy routes and middleware overhead need optimization.
- **Security**: key controls are missing or incomplete (CSP, admin authorization, unauthenticated admin API path, abuse controls).
- **Operations**: monitoring and release safety nets should be strengthened (SLOs, alerting, incident workflow, CI gates).

## Detailed Findings

### 1) Security: Missing Content Security Policy (High)
The app sets several security headers, but **no CSP header** is configured. This increases exposure to XSS and script-injection classes of attacks.

- Evidence: global headers include HSTS, frame/options, content-type, referrer, permissions, but no `Content-Security-Policy` in `next.config.mjs`.
- Impact: higher risk if any user-controlled content or third-party scripts are introduced.
- Recommendation:
  - Add a strict CSP with nonces/hashes for scripts.
  - Add `report-uri`/`report-to` and run in report-only mode first.

### 2) Security: Admin Access Control Is Incomplete (High)
The admin page checks for an authenticated session, but comments indicate role enforcement is intentionally deferred and currently permissive.

- Evidence: `src/app/admin/page.tsx` explicitly notes role checks are not implemented and allows authenticated users.
- Impact: any authenticated user may access admin capabilities/data.
- Recommendation:
  - Enforce RBAC on server side (e.g., `users.role = admin`).
  - Block non-admin users with hard deny (`403` + redirect).
  - Mirror policy in DB row-level policies and API handlers.

### 3) Security: Admin API Endpoint Exposed Without Auth (High)
`/api/admin/thin-content-risk` currently has no authentication or authorization checks.

- Evidence: route directly returns thin-content report data without auth guards.
- Impact: operational/internal intelligence leaks publicly.
- Recommendation:
  - Require admin session and role verification in route handler.
  - Add explicit deny-by-default behavior.

### 4) Security/Abuse: Public Write Endpoints Lack Rate-Limiting and Bot Controls (High)
Public mutation endpoints (e.g., salary submit, subscribe) accept unauthenticated requests and have validation, but no explicit anti-abuse controls.

- Evidence: `submit-salary` and `subscribe` routes validate payloads but do not implement rate-limits/captcha/challenge.
- Impact: spam submissions, database pollution, resource exhaustion, cost amplification (especially enrichment queue fan-out).
- Recommendation:
  - Add IP/user-agent based rate limiting at edge + app level.
  - Add bot challenge (Turnstile/reCAPTCHA) for write endpoints.
  - Add anomaly detection and temporary blocklists.

### 5) Security: Cron Protection Is Optional, Not Mandatory (Medium)
Cron route auth is only enforced if `CRON_SECRET` exists; otherwise route remains triggerable.

- Evidence: `process-enrichment` checks secret conditionally.
- Impact: accidental misconfiguration can expose expensive background job processing.
- Recommendation:
  - Fail closed when `CRON_SECRET` is missing in production.
  - Add startup guard or healthcheck assertion for required env vars.

### 6) Performance: Middleware Runs Broadly and Performs Session Fetch Per Request (Medium)
Middleware matcher includes almost all non-static paths. Middleware always initializes Supabase client and fetches session, even for many routes that may not require auth.

- Evidence: middleware applies globally (except a few static paths) and calls `supabase.auth.getSession()`.
- Impact: added latency and edge compute cost on high-traffic pages.
- Recommendation:
  - Narrow matcher to only paths that require canonical redirects/auth decisions.
  - Skip session lookup unless route is in protected/auth route groups.

### 7) Performance: Some Route Bundles Are Heavy (Medium)
Build output shows heavier JS payloads on interactive tools pages.

- Evidence from build:
  - `/tools/equity-simulator` first-load JS ~263kB
  - `/jobs/[jobTitle]` first-load JS ~223kB
  - `/tools/inflation-calculator` page JS ~44kB, first-load JS ~170kB
- Impact: slower TTI on mobile/low-end devices.
- Recommendation:
  - Dynamic import heavy chart/calculation components.
  - Audit client components and move non-interactive pieces server-side.
  - Track Web Vitals (LCP/INP/CLS) in production.

### 8) Operations: Dependency Vulnerability Scan Not Verifiable in This Environment (Medium)
`npm audit` could not run due to registry endpoint restriction (403), so dependency risk cannot be fully assessed from this environment.

- Recommendation:
  - Run `npm audit` in CI/CD or local environment with registry access.
  - Add periodic SCA scanning (Dependabot/Snyk/GitHub Advanced Security).

### 9) Reliability/Platform: Missing Explicit Production Gates (Medium)
Current scripts include lint/build/link checks, but no explicit test suite or deployment gating policy is documented in repo root artifacts.

- Recommendation:
  - Add required CI gates: lint, typecheck, tests, build, security scan.
  - Define rollback procedure + smoke test suite.

## Prioritized Build Plan (What Should Be Built Next)

### P0 (Before broad production launch)
1. Implement admin RBAC in UI + API + DB policies.
2. Protect `/api/admin/*` endpoints with server-side authorization.
3. Add CSP (report-only rollout, then enforcing).
4. Add rate limiting + CAPTCHA to public write endpoints.
5. Make cron secret mandatory in production (fail-closed).

### P1 (Immediately after P0)
1. Reduce middleware overhead (route scoping + conditional session fetch).
2. Bundle-size optimization on heavy routes (dynamic imports, client/server split).
3. Add runtime error monitoring and alerting (Sentry or equivalent).
4. Add secure headers verification in CI.

### P2 (Stability and scale)
1. Define SLOs and production dashboards (latency, error rate, queue depth, p95/p99).
2. Add synthetic uptime checks and critical-path monitoring.
3. Add load testing for salary submission and enrichment processing.
4. Complete DR/runbooks for Supabase outage and queue backlog events.

## Suggested Acceptance Criteria for “Production Ready”
- Admin and privileged APIs require verified admin role and are penetration-tested.
- Public mutation endpoints have anti-abuse controls with measurable thresholds.
- Security headers include enforce-mode CSP with no major violations.
- p95 page load and API latency targets are defined and met under load.
- CI blocks releases on lint/type/build/test/security failures.
- Monitoring + alerting + incident runbook validated in a game day.
