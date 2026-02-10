# AI DATA GENERATION PROMPT FOR AVGPay

Use this prompt with Claude, GPT-4, or similar AI to generate all seed data for AvgPay.

---

## PART 1: GENERATE SALARIES CSV (5,000 Records)

**PROMPT:**

```
Generate a CSV file with 5,000 realistic tech salary records for 2024.

FILE FORMAT:
- Header row: job_title,company_name,location,base_salary,total_comp,level,user_notes
- 5,000 data rows
- Realistic salary distributions based on actual market data

COMPANIES (use these exact names):
Tier 1 (FAANG): Google, Meta, Amazon, Apple, Microsoft, Netflix
Tier 2 (Big Tech): Tesla, Airbnb, Uber, Lyft, Stripe, Shopify, Spotify, Twitter/X, LinkedIn, Oracle, Salesforce, Adobe
Tier 3 (Mid-size): Databricks, Snowflake, Palantir, Plaid, Robinhood, Coinbase, Instacart, DoorDash, Zillow, Twilio
Tier 4 (Startups): OpenAI, Anthropic, Cohere, Midjourney, Replicate, Vercel, Linear, Figma, Notion, Brex

LOCATIONS (use "City, State" format):
- "San Francisco, CA" (highest salaries, 20% of data)
- "New York, NY" (high salaries, 18% of data)
- "Seattle, WA" (high salaries, 15% of data)
- "Austin, TX" (medium-high salaries, 12% of data)
- "Los Angeles, CA" (medium salaries, 8% of data)
- "Boston, MA" (medium salaries, 8% of data)
- "Denver, CO" (medium salaries, 7% of data)
- "Chicago, IL" (medium salaries, 6% of data)
- "Miami, FL" (lower-medium salaries, 4% of data)
- "Remote" (varies by company, 2% of data)

JOB TITLES:
- Software Engineer (35% of data)
- Product Manager (15% of data)
- Data Scientist (12% of data)
- UX Designer (8% of data)
- Engineering Manager (10% of data)
- DevOps Engineer (8% of data)
- Machine Learning Engineer (7% of data)
- Technical Program Manager (5% of data)

LEVELS (distribute across all titles):
- Junior / L3 / IC2: 15% of data
- Mid / L4 / IC3: 30% of data
- Senior / L5 / IC4: 35% of data
- Staff / L6 / IC5: 15% of data
- Principal / L7+ / IC6+: 5% of data

SALARY CALCULATIONS:
Base SF salaries by level (2024 market):
- Junior: $120,000 - $150,000
- Mid: $150,000 - $200,000
- Senior: $180,000 - $280,000
- Staff: $250,000 - $350,000
- Principal: $320,000 - $450,000

Adjust for location:
- SF/NY: 100% (baseline)
- Seattle: 95%
- Austin/Denver: 85%
- Boston/LA/Chicago: 90%
- Miami: 80%
- Remote: varies (85-100%)

Total Comp = Base + (Equity/4) + Bonus
- Equity is 4-year grant, so divide by 4 for annual value
- Bonus: 10-20% for most, up to 50% for senior roles
- Total comp should be 1.2x - 1.8x base salary

USER NOTES (optional, 30% of records):
- "Recent promotion"
- "Remote-first team"
- "High-growth startup"
- "Non-traditional background"
- "Negotiated up from initial offer"
- Leave empty for 70% of records

DATA QUALITY RULES:
1. No duplicate rows
2. total_comp >= base_salary
3. Realistic numbers only (no $10M salaries)
4. Company/job/level combinations should make sense
5. Distribute dates across 2023-2024

OUTPUT:
Provide exactly 5,000 rows as CSV text, starting with header row.
```

---

## PART 2: GENERATE JOB TITLE CONTENT

**PROMPT:**

```
Generate SEO-optimized content for these tech job titles:
1. Software Engineer
2. Product Manager
3. Data Scientist
4. UX Designer
5. Engineering Manager
6. DevOps Engineer
7. Machine Learning Engineer
8. Technical Program Manager

For EACH job title, provide:

DESCRIPTION (2-3 sentences):
- What the role does day-to-day
- Key responsibilities
- Career context

SEO_META_TITLE (max 60 characters):
- Format: "{Job Title} Salary | AvgPay"
- Must include "Salary" and "AvgPay"

SEO_META_DESCRIPTION (max 160 characters):
- Compelling summary
- Include keywords: salary, compare, tech companies
- Call-to-action feel

OUTPUT FORMAT (provide exactly this format):

Software Engineer:
Description: Software Engineers design, develop, and maintain software applications and systems. They write clean, efficient code, collaborate with cross-functional teams, and solve complex technical problems at scale.
Meta Title: Software Engineer Salary | AvgPay
Meta Description: Compare Software Engineer salaries across Google, Meta, Amazon & more. Real data from H-1B filings and pay transparency laws.

[Repeat for all 8 job titles]
```

---

## PART 3: GENERATE COMPANY CONTENT

**PROMPT:**

```
Generate SEO-optimized content for these tech companies:
1. Google
2. Meta
3. Amazon
4. Apple
5. Microsoft
6. Netflix
7. Tesla
8. Airbnb
9. Uber
10. Stripe

For EACH company, provide:

DESCRIPTION (2-3 sentences):
- What the company does
- Tech focus areas
- Compensation reputation

SEO_META_TITLE (max 60 characters):
- Format: "{Company} Salaries | AvgPay" or similar
- Must include company name and "AvgPay"

SEO_META_DESCRIPTION (max 160 characters):
- Overview of comp data available
- Include keywords: salaries, compensation, levels
- Enticing for job seekers

OUTPUT FORMAT (provide exactly this format):

Google:
Description: Google is a multinational technology company specializing in internet-related services, search engines, cloud computing, and artificial intelligence. Known for exceptional compensation packages and industry-leading benefits.
Meta Title: Google Salaries | AvgPay
Meta Description: View Google compensation data by level and location. Real salaries from H-1B filings and pay transparency reports.

[Repeat for all 10 companies]
```

---

## PART 4: GENERATE LOCATION CONTENT

**PROMPT:**

```
Generate SEO-optimized content for these tech hubs:
1. San Francisco, CA
2. New York, NY
3. Seattle, WA
4. Austin, TX
5. Los Angeles, CA
6. Boston, MA
7. Denver, CO
8. Chicago, IL
9. Miami, FL
10. Remote

For EACH location, provide:

DESCRIPTION (2-3 sentences):
- Tech scene overview
- Major employers in area
- Cost of living context (brief)

SEO_META_TITLE (max 60 characters):
- Format: "{Location} Tech Salaries | AvgPay"
- Must include location and "AvgPay"

SEO_META_DESCRIPTION (max 160 characters):
- Salary range overview
- Include keywords: tech salaries, cost of living, companies

OUTPUT FORMAT (provide exactly this format):

San Francisco, CA:
Description: San Francisco and the Bay Area represent the world's premier technology hub, hosting headquarters for Google, Meta, and thousands of startups. The region offers the highest tech salaries globally but comes with equally high living costs.
Meta Title: San Francisco Tech Salaries | AvgPay
Meta Description: Compare SF Bay Area tech salaries across top companies. Real data from H-1B and state pay transparency laws.

[Repeat for all 10 locations]
```

---

## HOW TO USE THE OUTPUT

### For Salaries CSV:
1. Copy CSV output to `salaries_seed.csv`
2. Open Supabase Dashboard → Table Editor → salaries
3. Click "Insert" → "Import data from CSV"
4. Upload file and verify column mapping
5. Click "Import"

### For AI Content (Jobs/Companies/Locations):
The AI content descriptions need to be inserted manually or via SQL:

```sql
-- Example: Update job description
UPDATE jobs 
SET description = 'Software Engineers design...', 
    seo_meta_title = 'Software Engineer Salary | AvgPay',
    seo_meta_description = 'Compare Software Engineer...'
WHERE title = 'Software Engineer';

-- Example: Update company description
UPDATE companies 
SET description = 'Google is a multinational...',
    seo_meta_title = 'Google Salaries | AvgPay',
    seo_meta_description = 'View Google compensation...'
WHERE name = 'Google';

-- Example: Update location description
UPDATE locations 
SET description = 'San Francisco is the heart...',
    seo_meta_title = 'San Francisco Tech Salaries | AvgPay',
    seo_meta_description = 'Compare SF Bay Area tech...'
WHERE name = 'San Francisco, CA';
```

---

## ESTIMATED TOKEN COSTS

- Salaries CSV (5,000 rows): ~150,000 tokens
- Job Content (8 titles): ~5,000 tokens
- Company Content (10 companies): ~6,000 tokens
- Location Content (10 locations): ~6,000 tokens
- **Total: ~167,000 tokens**

**Cost estimate (Claude/GPT-4):** $5-8

---

## VALIDATION QUERIES

After importing, run these to verify:

```sql
-- Check salary count
SELECT COUNT(*) FROM salaries;

-- Check top job titles
SELECT title, global_median_comp, global_count 
FROM jobs 
ORDER BY global_count DESC 
LIMIT 10;

-- Check company aggregates
SELECT name, aggregated_data->'Software Engineer'->>'medianTotalComp' as swe_median
FROM companies 
ORDER BY name 
LIMIT 10;

-- Check location aggregates
SELECT name, aggregated_data->'Software Engineer'->>'medianTotalComp' as swe_median
FROM locations 
ORDER BY name 
LIMIT 10;
```

Expected: Realistic median values, no NULLs in critical fields.
