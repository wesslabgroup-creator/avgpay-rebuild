-- Enable RLS
alter table salaries enable row level security;
alter table user_submissions enable row level security;

-- Create policies
create policy "Public read access" on salaries for select using (true);
create policy "Public submissions" on user_submissions for insert with check (true);

-- Create tables
CREATE TABLE companies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  domain text,
  industry text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  canonical_title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text
);

CREATE TABLE locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  city text NOT NULL,
  state text NOT NULL,
  country text DEFAULT 'US',
  metro text NOT NULL,
  slug text UNIQUE NOT NULL
);

CREATE TABLE salaries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  base_salary integer NOT NULL,
  equity integer DEFAULT 0,
  bonus integer DEFAULT 0,
  total_comp integer NOT NULL,
  level text,
  years_exp integer,
  
  company_id uuid REFERENCES companies(id),
  role_id uuid REFERENCES roles(id),
  location_id uuid REFERENCES locations(id),
  
  source text NOT NULL, -- bls, h1b, user, scraper
  verified boolean DEFAULT false,
  submitted_at timestamp with time zone DEFAULT now()
);

CREATE TABLE user_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text,
  base_salary integer NOT NULL,
  equity integer DEFAULT 0,
  bonus integer DEFAULT 0,
  total_comp integer NOT NULL,
  
  company text NOT NULL,
  role text NOT NULL,
  location text NOT NULL,
  level text,
  years_exp integer,
  
  status text DEFAULT 'pending', -- pending, approved, rejected
  weight float DEFAULT 0.5,
  
  submitted_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone
);

-- Create indexes
CREATE INDEX idx_salaries_company ON salaries(company_id);
CREATE INDEX idx_salaries_role ON salaries(role_id);
CREATE INDEX idx_salaries_location ON salaries(location_id);
CREATE INDEX idx_salaries_total_comp ON salaries(total_comp);

-- Insert sample data
INSERT INTO companies (name, slug, industry) VALUES 
  ('Google', 'google', 'Technology'),
  ('Meta', 'meta', 'Technology'),
  ('Amazon', 'amazon', 'Technology'),
  ('Apple', 'apple', 'Technology'),
  ('Microsoft', 'microsoft', 'Technology');

INSERT INTO roles (title, canonical_title, slug, category) VALUES
  ('Software Engineer', 'Software Engineer', 'software-engineer', 'Engineering'),
  ('Product Manager', 'Product Manager', 'product-manager', 'Product'),
  ('Data Scientist', 'Data Scientist', 'data-scientist', 'Data'),
  ('UX Designer', 'UX Designer', 'ux-designer', 'Design');

INSERT INTO locations (city, state, country, metro, slug) VALUES
  ('San Francisco', 'CA', 'US', 'San Francisco Bay Area', 'san-francisco-ca'),
  ('New York', 'NY', 'US', 'New York Metro', 'new-york-ny'),
  ('Seattle', 'WA', 'US', 'Seattle Metro', 'seattle-wa'),
  ('Austin', 'TX', 'US', 'Austin Metro', 'austin-tx');

-- Insert sample salary data
INSERT INTO salaries (base_salary, equity, bonus, total_comp, level, years_exp, company_id, role_id, location_id, source, verified)
SELECT 
  180000, 40000, 25000, 245000, 'L4', 4,
  c.id, r.id, l.id, 'h1b', true
FROM companies c, roles r, locations l
WHERE c.name = 'Google' AND r.title = 'Software Engineer' AND l.city = 'San Francisco';
