# AvgPay Database - Complete Data Dictionary

## Overview
This document describes all Supabase tables, their relationships, and CSV import specifications for AvgPay salary data platform.

**Data Flow:**
1. Import raw salary data → `salaries` table
2. Triggers auto-populate aggregates → `jobs`, `companies`, `locations` tables
3. Frontend queries aggregates for display

---

## TABLE 1: salaries (PRIMARY - IMPORT HERE)

**Purpose:** Raw salary records from BLS, H-1B, and user submissions

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| id | UUID | Auto | Primary key (gen_random_uuid()) | a1b2c3d4... |
| job_title | TEXT | ✅ | Job title as reported | "Software Engineer" |
| company_name | TEXT | ✅ | Company name | "Google" |
| location | TEXT | ✅ | City, State format | "San Francisco, CA" |
| base_salary | NUMERIC | ✅ | Annual base salary USD | 180000 |
| total_comp | NUMERIC | ✅ | Total annual compensation | 245000 |
| level | TEXT | Optional | Job level/rank | "L4", "Senior", "Staff" |
| submitted_at | TIMESTAMPTZ | Auto | Record creation timestamp | 2024-01-15 10:30:00+00 |
| user_notes | TEXT | Optional | Additional context | "Remote-friendly team" |

**CSV Import Format:**
```csv
job_title,company_name,location,base_salary,total_comp,level,user_notes
Software Engineer,Google,"San Francisco, CA",180000,245000,L4,Top performer
Product Manager,Meta,"New York, NY",160000,210000,L5,Recently promoted
```

**Expected Row Count:** 10,000-100,000+ records

---

## TABLE 2: jobs (AUTO-GENERATED - DO NOT IMPORT)

**Purpose:** Aggregated salary statistics by job title
**Populated By:** Database trigger when salaries are inserted

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | UUID | Primary key | a1b2c3d4... |
| title | TEXT UNIQUE | Canonical job title | "Software Engineer" |
| global_median_comp | NUMERIC | Median total comp across all companies/locations | 185000 |
| global_min_comp | NUMERIC | Minimum total comp | 120000 |
| global_max_comp | NUMERIC | Maximum total comp | 450000 |
| global_count | NUMERIC | Number of salary records | 5230 |
| description | TEXT | AI-generated job description | "Software Engineers design..." |
| seo_meta_title | TEXT | SEO page title | "Software Engineer Salary | AvgPay" |
| seo_meta_description | TEXT | SEO meta description | "Compare Software Engineer..." |
| updated_at | TIMESTAMPTZ | Last aggregation update | 2024-01-15 10:30:00+00 |

**Relationship:** One-to-many with salaries (many salaries = one job aggregate)

---

## TABLE 3: companies (AUTO-GENERATED - DO NOT IMPORT)

**Purpose:** Aggregated salary statistics by company
**Populated By:** Database trigger when salaries are inserted

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | UUID | Primary key | a1b2c3d4... |
| name | TEXT UNIQUE | Company name | "Google" |
| aggregated_data | JSONB | Nested stats by role | See example below |
| description | TEXT | AI-generated company description | "Google is a multinational..." |
| seo_meta_title | TEXT | SEO page title | "Google Salaries | AvgPay" |
| seo_meta_description | TEXT | SEO meta description | "View Google compensation..." |
| updated_at | TIMESTAMPTZ | Last aggregation update | 2024-01-15 10:30:00+00 |

**aggregated_data JSONB Structure:**
```json
{
  "Software Engineer": {
    "medianTotalComp": 245000,
    "minComp": 180000,
    "maxComp": 450000,
    "count": 1200
  },
  "Product Manager": {
    "medianTotalComp": 210000,
    "minComp": 160000,
    "maxComp": 380000,
    "count": 450
  }
}
```

---

## TABLE 4: locations (AUTO-GENERATED - DO NOT IMPORT)

**Purpose:** Aggregated salary statistics by geographic location
**Populated By:** Database trigger when salaries are inserted

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | UUID | Primary key | a1b2c3d4... |
| name | TEXT UNIQUE | Location string | "San Francisco, CA" |
| aggregated_data | JSONB | Nested stats by role | See example below |
| description | TEXT | AI-generated location insights | "San Francisco offers the highest..." |
| seo_meta_title | TEXT | SEO page title | "San Francisco Tech Salaries | AvgPay" |
| seo_meta_description | TEXT | SEO meta description | "Compare San Francisco..." |
| updated_at | TIMESTAMPTZ | Last aggregation update | 2024-01-15 10:30:00+00 |

**aggregated_data JSONB Structure:**
```json
{
  "Software Engineer": {
    "medianTotalComp": 285000,
    "minComp": 150000,
    "maxComp": 520000,
    "count": 3200
  },
  "Data Scientist": {
    "medianTotalComp": 195000,
    "minComp": 130000,
    "maxComp": 340000,
    "count": 890
  }
}
```

---

## TABLE 5: user_submissions (SEPARATE WORKFLOW)

**Purpose:** User-contributed salaries pending review
**Note:** These require manual approval before moving to `salaries` table

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| id | UUID | Auto | Primary key | a1b2c3d4... |
| email | TEXT | Optional | Submitter email (for follow-up) | user@email.com |
| base_salary | INTEGER | ✅ | Annual base salary USD | 180000 |
| equity | INTEGER | Optional | 4-year equity grant | 400000 |
| bonus | INTEGER | Optional | Annual bonus | 25000 |
| total_comp | INTEGER | ✅ | Calculated total compensation | 245000 |
| company | TEXT | ✅ | Company name | "Google" |
| role | TEXT | ✅ | Job title | "Software Engineer" |
| location | TEXT | ✅ | Location | "San Francisco, CA" |
| level | TEXT | Optional | Job level | "L4" |
| years_exp | INTEGER | Optional | Years of experience | 4 |
| status | TEXT | Auto | pending / approved / rejected | "pending" |
| weight | FLOAT | Auto | Data quality weight (0-1) | 0.5 |
| submitted_at | TIMESTAMPTZ | Auto | Submission timestamp | 2024-01-15 10:30:00+00 |
| reviewed_at | TIMESTAMPTZ | Optional | Review timestamp | 2024-01-16 14:20:00+00 |

---

## Data Generation Prompt for AI

### Step 1: Generate Salaries CSV

**Prompt:**
```
Generate a CSV file with 5,000 realistic tech salary records for the AvgPay database.

REQUIREMENTS:
- Format: job_title,company_name,location,base_salary,total_comp,level,user_notes
- Companies: Mix of FAANG (Google, Meta, Amazon, Apple, Netflix) + startups + mid-size
- Locations: San Francisco CA, New York NY, Seattle WA, Austin TX, Denver CO, Boston MA, Remote
- Job Titles: Software Engineer, Product Manager, Data Scientist, UX Designer, Engineering Manager
- Levels: Junior, Mid, Senior, Staff, Principal (or L3-L8 for FAANG)
- Salary Ranges (realistic for 2024):
  - SF/NY: Junior $120-150k base, Senior $180-250k base, Staff $250-350k base
  - Seattle/Austin: 10-15% lower than SF
  - Remote: Varies by company policy
  - Total comp = base + (equity/4) + bonus
- Data Quality: 95% complete, realistic distributions, some outliers

CONSTRAINTS:
- Use real company names
- Location format: "City, State" (e.g., "San Francisco, CA")
- No headers in output
- total_comp must be >= base_salary

OUTPUT:
Provide 5,000 rows as plain CSV text.
```

### Step 2: Generate AI Content for Jobs Table

**Prompt:**
```
Generate SEO-optimized content for tech job titles.

For each job title, provide:
1. description: 2-3 sentence professional description
2. seo_meta_title: Under 60 chars, format "{Title} Salary | AvgPay"
3. seo_meta_description: Under 160 chars, compelling summary

JOB TITLES TO COVER:
- Software Engineer
- Product Manager
- Data Scientist
- UX Designer
- Engineering Manager
- DevOps Engineer
- Machine Learning Engineer
- Technical Program Manager

OUTPUT FORMAT:
```
Software Engineer:
Description: Software Engineers design, develop, and maintain software applications. They write code, debug systems, and collaborate with cross-functional teams to deliver products.
Meta Title: Software Engineer Salary | AvgPay
Meta Description: Compare Software Engineer salaries across top tech companies. Real data from BLS, H-1B, and pay transparency laws.
```
```

### Step 3: Generate AI Content for Companies Table

**Prompt:**
```
Generate SEO-optimized content for tech companies.

For each company, provide:
1. description: 2-3 sentence company overview
2. seo_meta_title: Under 60 chars
3. seo_meta_description: Under 160 chars

COMPANIES TO COVER:
- Google
- Meta
- Amazon
- Apple
- Microsoft
- Netflix
- Tesla
- Airbnb
- Uber
- Stripe

OUTPUT FORMAT:
```
Google:
Description: Google is a multinational technology company specializing in search engines, cloud computing, and AI. Known for competitive compensation and exceptional benefits.
Meta Title: Google Salaries | AvgPay
Meta Description: View Google compensation data. Real salaries from H-1B filings and pay transparency reports.
```
```

### Step 4: Generate AI Content for Locations Table

**Prompt:**
```
Generate SEO-optimized content for tech hubs.

For each location, provide:
1. description: 2-3 sentence location overview for tech workers
2. seo_meta_title: Under 60 chars
3. seo_meta_description: Under 160 chars

LOCATIONS TO COVER:
- San Francisco, CA
- New York, NY
- Seattle, WA
- Austin, TX
- Denver, CO
- Boston, MA
- Los Angeles, CA
- Chicago, IL
- Remote

OUTPUT FORMAT:
```
San Francisco, CA:
Description: San Francisco is the heart of Silicon Valley with the highest tech salaries globally. Home to major tech companies and thousands of startups.
Meta Title: San Francisco Tech Salaries | AvgPay
Meta Description: Compare SF Bay Area tech salaries. Real data from H-1B and pay transparency laws.
```
```

---

## Import Instructions

### Method 1: Supabase Dashboard (Recommended)
1. Go to Supabase Dashboard → Table Editor
2. Select `salaries` table
3. Click "Insert" → "Import data from CSV"
4. Upload CSV file
5. Map columns (should auto-detect)
6. Click "Import"

### Method 2: SQL COPY Command
```sql
-- Upload CSV to Supabase Storage first
-- Then run:
COPY salaries(job_title, company_name, location, base_salary, total_comp, level, user_notes)
FROM 'https://your-project.supabase.co/storage/v1/object/public/csvs/salaries.csv'
WITH (FORMAT csv, HEADER true);
```

---

## Validation Checklist

After import, verify:
- [ ] salaries table has expected row count
- [ ] jobs table auto-populated with aggregates
- [ ] companies table auto-populated
- [ ] locations table auto-populated
- [ ] Median calculations look reasonable
- [ ] No null values in required fields

Test query:
```sql
SELECT 
  title,
  global_median_comp,
  global_count
FROM jobs
ORDER BY global_count DESC
LIMIT 10;
```

Expected: List of top job titles with median comp and counts.

---

## Schema Files Location

- Primary schema: `/avgpay/supabase/schema.sql`
- Trigger functions: `/avgpay/src/lib/database/triggers.sql`
- Median calculations: `/avgpay/src/lib/database/median_triggers.sql`

Run these in order when setting up fresh database.
