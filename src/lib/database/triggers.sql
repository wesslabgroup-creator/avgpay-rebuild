-- SQL for Supabase Triggers and Functions

-- Function to update job aggregates (median, min, max, count)
CREATE OR REPLACE FUNCTION update_job_aggregates()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO jobs (title, global_median_comp, global_min_comp, global_max_comp, global_count, updated_at)
    SELECT
        NEW.job_title,
        _median(total_comp) AS global_median_comp,
        MIN(total_comp) AS global_min_comp,
        MAX(total_comp) AS global_max_comp,
        COUNT(*) AS global_count
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

-- Trigger to call the function after inserting a new salary
CREATE TRIGGER trigger_update_job_aggregates
AFTER INSERT ON salaries
FOR EACH ROW
EXECUTE FUNCTION update_job_aggregates();

-- Function to update company aggregates and potentially AI content
CREATE OR REPLACE FUNCTION update_company_aggregates_and_ai()
RETURNS TRIGGER AS $$
DECLARE
    company_title TEXT := NEW.company_name;
    company_id UUID;
BEGIN
    -- First, update aggregates for the company
    INSERT INTO companies (name, aggregated_data, updated_at)
    SELECT
        NEW.company_name,
        jsonb_build_object(
            'medianTotalComp', _median(total_comp),
            'minComp', MIN(total_comp),
            'maxComp', MAX(total_comp),
            'count', COUNT(*)
            -- Add more aggregated fields as needed
        ),
        now()
    FROM salaries
    WHERE company_name = NEW.company_name
    GROUP BY company_name
    ON CONFLICT (name) DO UPDATE SET
        aggregated_data = EXCLUDED.aggregated_data,
        updated_at = now()
    RETURNING id INTO company_id; -- Get the ID of the updated/inserted company

    -- If the company entry was just created or updated, and we need to generate/update AI content
    -- This part is more complex: requires calling a JS function or external service, or a PL/pgSQL wrapper for AI calls
    -- For simplicity, this example shows where you *would* trigger AI content generation if it were directly feasible in SQL
    -- RAIISE NOTICE 'Company aggregates updated. AI content generation would be triggered here for company: %', company_title;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for company aggregates
CREATE TRIGGER trigger_update_company_aggregates
AFTER INSERT ON salaries
FOR EACH ROW
EXECUTE FUNCTION update_company_aggregates_and_ai();

-- Function to update location aggregates
CREATE OR REPLACE FUNCTION update_location_aggregates()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO locations (name, aggregated_data, updated_at)
    SELECT
        NEW.location,
        jsonb_build_object(
            'medianTotalComp', _median(total_comp),
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

-- Trigger for location aggregates
CREATE TRIGGER trigger_update_location_aggregates
AFTER INSERT ON salaries
FOR EACH ROW
EXECUTE FUNCTION update_location_aggregates();

-- NOTE: The '_median' function is not a standard PostgreSQL aggregate.
-- You would need to create a custom aggregate function for median calculation,
-- or use approximation methods if exact median is not strictly required in SQL.
-- Example of median using PERCENTILE_CONT (PostgreSQL 9.4+):
/*
CREATE OR REPLACE FUNCTION median(anyelement)
RETURNS anyelement AS $$
  SELECT AVG(x)::anyelement
  FROM (
    SELECT (percentile_cont(0.5) WITHIN GROUP (ORDER BY table_col)) as x
    FROM (
       SELECT total_comp as table_col FROM salaries WHERE location = NEW.location -- Example context
    ) sub
  ) sub2;
$$ LANGUAGE SQL;
*/
-- For simplicity in this draft, assuming a placeholder '_median' which would need proper implementation.
