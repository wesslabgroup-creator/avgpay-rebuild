-- Database Schema for AvgPay

-- Table for storing salary entries
CREATE TABLE IF NOT EXISTS salaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    location TEXT,
    base_salary NUMERIC,
    total_comp NUMERIC,
    level TEXT, -- e.g., Junior, Senior, Staff
    submitted_at TIMESTAMPTZ DEFAULT now(),
    -- Add potential fields for user-provided descriptions or notes, if needed
    user_notes TEXT
);

-- Table for storing job title specific aggregated data and AI descriptions
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT UNIQUE NOT NULL, -- e.g., 'Software Engineer'
    global_median_comp NUMERIC,
    global_min_comp NUMERIC,
    global_max_comp NUMERIC,
    global_count NUMERIC,
    description TEXT, -- AI-generated job description
    seo_meta_title TEXT,
    seo_meta_description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for storing company specific aggregated data and AI descriptions
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- e.g., 'Google'
    aggregated_data JSONB, -- For storing aggregated stats per job title within the company
    description TEXT, -- AI-generated company description
    seo_meta_title TEXT,
    seo_meta_description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for storing location specific aggregated data and AI descriptions
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- e.g., 'San Francisco, CA'
    aggregated_data JSONB, -- For storing aggregated stats per job title in this location
    description TEXT, -- AI-generated location insights
    seo_meta_title TEXT,
    seo_meta_description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optional: Table for managing AI generated content versions or sources
CREATE TABLE IF NOT EXISTS ai_content_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- e.g., 'job', 'company', 'location'
    entity_id UUID NOT NULL, -- References the ID in the corresponding table
    content_type TEXT NOT NULL, -- e.g., 'description', 'meta_title', 'meta_description'
    generated_by TEXT, -- e.g., 'gemini-pro'
    generated_at TIMESTAMPTZ DEFAULT now(),
    content TEXT -- The generated content
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_salaries_job_title ON salaries (job_title);
CREATE INDEX IF NOT EXISTS idx_salaries_company_name ON salaries (company_name);
CREATE INDEX IF NOT EXISTS idx_salaries_location ON salaries (location);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs (title);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies (name);
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations (name);
