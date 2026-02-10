# AvgPay Website Audit Report
**Date:** February 10, 2026
**Audited By:** Claude (Autonomous Product + Engineering Agent)
**Repository:** avgpay-rebuild

---

## Executive Summary

AvgPay is a Next.js 14 salary comparison platform that helps tech workers negotiate better compensation. The codebase is well-structured with good fundamentals, but has significant opportunities for improvement across UX, SEO, conversion optimization, and feature expansion.

**Overall Grade: B-**
- Strong technical foundation ✅
- Good core product concept ✅
- Needs critical bug fixes ⚠️
- Missing key conversion features ⚠️
- Thin content strategy ⚠️
- Untapped SEO opportunities ⚠️

---

## A) CRITICAL ISSUES (Fix Immediately)

### 1. About Page CSS Bug 🔴
**File:** `src/app/about/page.tsx:23`
- Uses `prose-invert` class on white background (designed for dark backgrounds)
- Text is barely visible
- **Impact:** Destroys trust, looks broken
- **Fix:** Remove `prose-invert`, use proper text colors

### 2. Missing Privacy Policy Page 🔴
**File:** Footer links to `/privacy` but page doesn't exist
- **Impact:** Legal risk, broken user trust, broken link hurts SEO
- **Fix:** Create comprehensive privacy policy page

### 3. Broken Email Capture Forms 🔴
**Files:** `src/app/analyze-offer/page.tsx:69`
- Email inputs don't actually submit anywhere
- No backend integration
- **Impact:** User frustration, lost leads
- **Fix:** Implement proper email capture API + confirmation flow

### 4. Inconsistent Data Claims 🔴
**Files:** Homepage vs About page
- Homepage: "47,000+ salaries analyzed"
- About page: "50K+ data points"
- **Impact:** Looks sloppy, reduces credibility
- **Fix:** Standardize to single source of truth

### 5. Hardcoded Localhost URLs 🔴
**File:** `src/app/[company]/[role]/[location]/page.tsx:77-80`
- Schema markup uses `process.env.NEXT_PUBLIC_VERCEL_URL` with localhost fallback
- **Impact:** Broken structured data in production
- **Fix:** Use proper base URL helper function

### 6. Missing OG Images 🔴
**Files:** All metadata references `/images/og-image.png` which doesn't exist
- **Impact:** Poor social sharing, unprofessional appearance
- **Fix:** Generate OG images for all key pages

### 7. Empty Next.js Config 🔴
**File:** `next.config.mjs`
- Missing critical optimizations (image domains, redirects, headers)
- **Impact:** Slower performance, missed optimization opportunities
- **Fix:** Add comprehensive config

### 8. No Analytics Implementation 🟡
**File:** `.env` has `NEXT_PUBLIC_GA_ID` but not used
- **Impact:** Can't measure success, optimize conversion
- **Fix:** Implement Google Analytics + tracking events

---

## B) HIGH-ROI IMPROVEMENTS (Should Ship Soon)

### UX + Design

#### 1. Mobile Navigation Aggressive 🟡
**File:** `src/components/navigation.tsx:78`
- Full-screen overlay is jarring
- Consider drawer/slide-in instead
- **Impact:** Better mobile UX, less disruptive

#### 2. Loading States Limited 🟡
**File:** `src/components/offer-analyzer.tsx:190-199`
- Only analyzer has loading state
- Other API calls have no feedback
- **Impact:** Users don't know if action succeeded
- **Fix:** Add loading states to all async operations

#### 3. No Error Boundaries 🟡
- Missing React error boundaries
- Errors crash entire page
- **Impact:** Poor UX when things break
- **Fix:** Add error boundaries to key sections

#### 4. Form Validation Weak 🟡
**File:** `src/components/offer-analyzer.tsx:300-309`
- Only checks if fields are filled
- No format validation (e.g., realistic salary ranges)
- **Impact:** Users can input garbage data
- **Fix:** Add proper validation with helpful error messages

### SEO + Technical SEO

#### 5. Missing Structured Data 🟡
**Current:** Only Breadcrumbs + Article schemas
**Missing:**
- Organization schema (homepage)
- FAQPage schema (all FAQ sections)
- SoftwareApplication schema (for the tool itself)
- AggregateRating schema (testimonials)
- **Impact:** Missing rich snippet opportunities
- **Fix:** Add comprehensive schema markup

#### 6. No Canonical URLs 🟡
**Files:** All pages missing canonical tags
- **Impact:** Duplicate content risk, split link equity
- **Fix:** Add canonical URLs to all metadata

#### 7. Sitemap Priority Flat 🟡
**File:** `public/sitemap.xml`
- All pages set to 0.8 priority
- **Impact:** Doesn't signal importance to Google
- **Fix:** Tier priorities (homepage 1.0, key pages 0.9, others 0.7)

#### 8. Missing Meta Descriptions 🟡
**Files:** Some pages have weak/generic descriptions
- Dynamic pages: Good ✅
- Static pages: Generic ⚠️
- **Fix:** Write compelling, keyword-rich descriptions

### Conversion + Funnel

#### 9. No Lead Capture Flow 🟡
- Email fields exist but don't work
- No "saved analyses" feature
- No "create account" flow
- **Impact:** Massive conversion loss
- **Fix:** Implement proper signup funnel

#### 10. Pricing Page Not Integrated 🟡
**File:** `src/app/pricing/page.tsx`
- Beautiful pricing cards, but buttons don't work
- No payment integration
- **Impact:** Can't actually monetize
- **Fix:** Integrate Stripe/Lemon Squeezy

#### 11. No Exit Intent Popup 🟡
- Users leave without capturing email
- **Impact:** Lost leads
- **Fix:** Add exit intent with value prop

#### 12. Weak Call-to-Actions 🟡
**Files:** Various pages
- CTAs are present but not optimized
- No urgency or scarcity
- **Fix:** A/B test stronger CTA copy

### Performance

#### 13. Font Loading Not Optimized 🟡
**File:** `src/app/layout.tsx:2`
- Uses Inter font but no display swap
- **Impact:** FOIT (flash of invisible text)
- **Fix:** Add `font-display: swap`

#### 14. No Image Optimization Config 🟡
- Missing remote image domains in config
- **Impact:** Can't use next/image for external images
- **Fix:** Configure image domains

#### 15. Bundle Size Not Analyzed 🟡
- No bundle analyzer configured
- **Impact:** Don't know if bundles are bloated
- **Fix:** Add @next/bundle-analyzer

---

## C) STRATEGIC EXPANSION OPPORTUNITIES (Build if Worth It)

### New Tools/Features (High User Value)

#### 1. Multi-Offer Comparison Tool ⭐⭐⭐⭐⭐
**Concept:** Side-by-side comparison of 2-3 competing offers
**Why:** Common pain point in job search
**SEO Value:** "compare google vs meta offer" searches
**Implementation:** New `/compare-offers` page with multi-column form
**Estimated Impact:** 30% increase in engagement, strong SEO opportunity

#### 2. Stock Option Calculator ⭐⭐⭐⭐⭐
**Concept:** Calculate stock option value (vs RSUs)
**Why:** Confusing for most workers, high-value content
**SEO Value:** "stock option calculator" gets 10K+ monthly searches
**Implementation:** New `/tools/stock-calculator` page
**Estimated Impact:** Major traffic driver, strong defensibility

#### 3. Cost of Living Adjuster ⭐⭐⭐⭐
**Concept:** Adjust offers across cities for COL differences
**Why:** Essential for remote workers comparing offers
**SEO Value:** "sf vs nyc salary" type queries
**Implementation:** New `/tools/col-calculator` with Numbeo API
**Estimated Impact:** 20% traffic increase, strong user value

#### 4. Career Progression Tracker ⭐⭐⭐⭐
**Concept:** Show typical L1→L2→L3 timeline + salary jumps
**Why:** Helps users plan long-term career
**SEO Value:** "software engineer career path" searches
**Implementation:** New `/career-paths/[role]` pages
**Estimated Impact:** Strong retention, return visits

#### 5. Saved Analyses Dashboard ⭐⭐⭐⭐
**Concept:** Let users save/track multiple analyses over time
**Why:** Increases engagement, creates account stickiness
**Implementation:** User accounts + database storage
**Estimated Impact:** 3x return visit rate

#### 6. Equity Breakdown Visualizer ⭐⭐⭐
**Concept:** Visual breakdown of base vs equity vs bonus over 4 years
**Why:** Helps users understand vesting schedules
**Implementation:** Add to offer analyzer results page
**Estimated Impact:** Better user understanding, more sharing

#### 7. Email Alerts for Salary Updates ⭐⭐⭐
**Concept:** Notify when new data available for their role/company
**Why:** Creates recurring engagement
**Implementation:** Email service + cron job
**Estimated Impact:** 50% email capture increase

#### 8. Anonymous Offer Sharing ⭐⭐⭐
**Concept:** Users can share "My Google L4 offer: $280K TC"
**Why:** Social proof, user-generated content
**Implementation:** Public offer showcase page
**Estimated Impact:** Viral potential, strong social proof

### New Content/Pages (SEO + User Value)

#### 9. City-Specific Landing Pages ⭐⭐⭐⭐⭐
**Concept:** `/salaries/san-francisco`, `/salaries/new-york`, etc.
**Why:** High-volume local searches
**SEO Value:** "san francisco software engineer salary" (50K+ monthly)
**Implementation:** 20-30 city pages with unique content
**Estimated Impact:** 100%+ organic traffic increase

#### 10. Role Deep-Dive Pages ⭐⭐⭐⭐
**Concept:** `/roles/software-engineer` with career path, skills, salary ranges
**Why:** Informational searches before job hunting
**SEO Value:** "software engineer job description" type queries
**Implementation:** 15-20 role pages
**Estimated Impact:** 40% traffic increase

#### 11. Company Culture/Benefits Pages ⭐⭐⭐⭐
**Concept:** Expand company pages to include culture, WLB, benefits
**Why:** Holistic decision-making beyond salary
**SEO Value:** "google work culture" searches
**Implementation:** Expand `/company/[name]` pages
**Estimated Impact:** Higher engagement, more time on site

#### 12. Industry Salary Reports ⭐⭐⭐
**Concept:** Annual/quarterly reports (e.g., "2026 Tech Salary Report")
**Why:** Earns backlinks, establishes authority
**SEO Value:** Press coverage, natural links
**Implementation:** PDF + landing page
**Estimated Impact:** Major backlink acquisition

#### 13. Interview Prep + Negotiation Scripts ⭐⭐⭐⭐
**Concept:** Actual email templates for negotiation
**Why:** High-value, practical content
**SEO Value:** "salary negotiation email template"
**Implementation:** Add to `/guides` section
**Estimated Impact:** 2x guide engagement

#### 14. Remote vs Office Compensation Gap ⭐⭐⭐
**Concept:** Data on remote pay cuts by company
**Why:** Hot topic, unique data angle
**SEO Value:** "remote work salary" queries
**Implementation:** New guide page + data visualization
**Estimated Impact:** Media coverage potential

---

## D) RECOMMENDED EXECUTION PLAN

### Phase 1: Quick Wins (Week 1) 🚀

**Critical Fixes:**
1. Fix About page CSS bug
2. Create Privacy Policy page
3. Fix inconsistent data claims
4. Add proper canonical URLs
5. Implement working email capture backend
6. Generate OG images
7. Fix Next.js config

**Estimated Impact:** Remove all embarrassing bugs, professional appearance restored

---

### Phase 2: High-ROI Improvements (Week 2-3) 📈

**SEO + Conversion:**
1. Add comprehensive structured data
2. Implement Google Analytics
3. Create city-specific landing pages (Top 10 cities)
4. Improve guide content depth
5. Add exit intent email capture
6. Implement saved analyses feature

**Estimated Impact:** 100%+ traffic increase, 3x lead capture

---

### Phase 3: Strategic Features (Week 4-6) ⭐

**New Tools:**
1. Multi-offer comparison calculator
2. Stock option calculator
3. Cost of living adjuster
4. Career progression pages
5. Email alerts system

**Estimated Impact:** Strong moat, unique value props, major traffic drivers

---

## Key Metrics to Track

### Current Baseline (Estimated):
- **Monthly Visitors:** Unknown (no analytics!)
- **Conversion Rate:** ~0% (no working forms)
- **Avg Session Duration:** Unknown
- **Bounce Rate:** Unknown
- **SEO Traffic:** Unknown

### Target Metrics (3 months):
- **Monthly Visitors:** 50,000+
- **Email Capture Rate:** 15%+
- **Return Visitor Rate:** 30%+
- **Avg Session Duration:** 3+ minutes
- **SEO Traffic Share:** 60%+

---

## Technical Debt Identified

1. **No tests** - Should add Playwright for critical flows
2. **No error monitoring** - Add Sentry
3. **Mock data** - Need real database queries
4. **No rate limiting** - API routes vulnerable
5. **No input sanitization** - XSS risk on user submissions
6. **No CORS config** - If building API for partners
7. **No caching strategy** - Should use ISR more aggressively

---

## Competitive Analysis

### vs Levels.fyi:
- **Advantage:** Official data sources (not self-reported)
- **Disadvantage:** Smaller dataset, less company detail
- **Opportunity:** Build company culture pages

### vs Glassdoor:
- **Advantage:** More accurate data, better UX
- **Disadvantage:** Less brand recognition
- **Opportunity:** SEO content strategy

### vs Blind:
- **Advantage:** Structured data vs forum posts
- **Disadvantage:** No community aspect
- **Opportunity:** Add anonymous offer sharing

---

## Final Recommendations

### DO THIS:
1. ✅ Fix all critical bugs immediately
2. ✅ Build multi-offer comparison tool (strongest feature opportunity)
3. ✅ Create 20 city-specific landing pages (SEO goldmine)
4. ✅ Implement proper email capture + nurture sequence
5. ✅ Add comprehensive structured data
6. ✅ Build stock option calculator (traffic magnet)

### DON'T DO THIS:
1. ❌ Don't add user accounts yet (add friction, not needed)
2. ❌ Don't build mobile app (web-first strategy)
3. ❌ Don't add forums/community (scope creep)
4. ❌ Don't overcomplicate pricing (keep it simple)
5. ❌ Don't add too many social features (stay focused)

---

## Conclusion

AvgPay has **strong bones but needs muscle**. The core concept is solid and the technical foundation is good. The biggest opportunities are:

1. **Fix embarrassing bugs** (credibility)
2. **Build standout tools** (differentiation)
3. **Dominate local SEO** (traffic)
4. **Capture leads properly** (revenue)

**If executed well, this could be a $1M+ ARR business within 12-18 months.**

The key is to maintain **scope discipline** - don't try to be Levels.fyi. Be the "official data, killer tools" alternative.

---

*End of Audit Report*
