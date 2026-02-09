-- Custom median function using percentile_cont
CREATE OR REPLACE FUNCTION calculate_median(numeric[])
RETURNS numeric AS $$
  SELECT AVG(x)::numeric
  FROM (
    SELECT (percentile_cont(0.5) WITHIN GROUP (ORDER BY val)) as x
    FROM unnest($1) AS t(val)
  ) sub;
$$ LANGUAGE SQL IMMUTABLE;

-- Modified update_job_aggregates function to use calculate_median
CREATE OR REPLACE FUNCTION update_job_aggregates()
RETURNS TRIGGER AS $$
DECLARE
    median_comp NUMERIC;
BEGIN
    -- Calculate median for the job title
    SELECT calculate_median(array_agg(total_comp)) INTO median_comp
    FROM salaries
    WHERE job_title = NEW.job_title;

    INSERT INTO jobs (title, global_median_comp, global_min_comp, global_max_comp, global_count, updated_at)
    SELECT
        NEW.job_title,
        median_comp,
        MIN(total_comp),
        MAX(total_comp),
        COUNT(*),
        now()
    FROM salaries
    WHERE job_title = NEW.job_title
    GROUP BY job_title
    ON CONFLICT (title) DO UPDATE SET
        global_median_comp = EXCLUDED.global_median_comp,
        global_min_comp = EXCLUDED.global_min_comp,
        global_max_comp = EXCLUDED.global_max_comp,
        global_count = EXCLUDED.global_count,
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Modified update_company_aggregates_and_ai function to use calculate_median
CREATE OR REPLACE FUNCTION update_company_aggregates_and_ai()
RETURNS TRIGGER AS $$
DECLARE
    company_title TEXT := NEW.company_name;
    company_id UUID;
    median_comp NUMERIC;
BEGIN
    -- Calculate median for the company
    SELECT calculate_median(array_agg(total_comp)) INTO median_comp
    FROM salaries
    WHERE company_name = NEW.company_name;

    INSERT INTO companies (name, aggregated_data, updated_at)
    SELECT
        NEW.company_name,
        jsonb_build_object(
            'medianTotalComp', median_comp,
            'minComp', MIN(total_comp),
            'maxComp', MAX(total_comp),
            'count', COUNT(*)
        ),
        now()
    FROM salaries
    WHERE company_name = NEW.company_name
    GROUP BY company_name
    ON CONFLICT (name) DO UPDATE SET
        aggregated_data = EXCLUDED.aggregated_data,
        updated_at = now()
    RETURNING id INTO company_id; 

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Modified update_location_aggregates function to use calculate_median
CREATE OR REPLACE FUNCTION update_location_aggregates()
RETURNS TRIGGER AS $$
DECLARE
    location_title TEXT := NEW.location;
    median_comp NUMERIC;
BEGIN
    -- Calculate median for the location
    SELECT calculate_median(array_agg(total_comp)) INTO median_comp
    FROM salaries
    WHERE location = NEW.location;

    INSERT INTO locations (name, aggregated_data, updated_at)
    SELECT
        NEW.location,
        jsonb_build_object(
            'medianTotalComp', median_comp,
            'minComp', MIN(total_comp),
            'maxComp', MAX(total_comp),
            'count', COUNT(*)
        ),
        now()
    FROM salaries
    WHERE location = NEW.location
    GROUP BY location
    ON CONFLICT (name) DO UPDATE SET
        aggregated_data = EXCLUDED.aggregated_data,
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- IMPORTANT: Ensure the existing triggers reference these updated functions. 
-- If you are rerunning the script, you might need to drop the old triggers first.
-- Example: DROP TRIGGER IF EXISTS trigger_update_job_aggregates ON salaries;
-- Then recreate them using the new function names if necessary.
