-- Migration 005: database-level enrichment queueing from Salary writes.
-- Ensures direct DB inserts/updates trigger enrichment even when app-layer hooks are bypassed.

CREATE OR REPLACE FUNCTION public.enrichment_entity_key(entity_type TEXT, entity_name TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT entity_type || ':' || LOWER(REGEXP_REPLACE(TRIM(COALESCE(entity_name, '')), '[^a-z0-9]+', '-', 'g'));
$$;

CREATE OR REPLACE FUNCTION public.enqueue_entity_enrichment_job(
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_entity_name TEXT,
  p_context_data JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_entity_key TEXT;
  v_payload JSONB;
BEGIN
  IF p_entity_id IS NULL OR p_entity_name IS NULL OR TRIM(p_entity_name) = '' THEN
    RETURN;
  END IF;

  v_entity_key := public.enrichment_entity_key(p_entity_type, p_entity_name);

  v_payload := jsonb_build_object(
    'metricsScope', jsonb_build_object(
      'entityType', p_entity_type,
      'entityName', p_entity_name
    ),
    'queuedAt', NOW()
  ) || COALESCE(p_context_data, '{}'::JSONB);

  INSERT INTO public."EnrichmentQueue" (
    id,
    "entityType",
    "entityId",
    "entityName",
    "entityKey",
    "contextData",
    status,
    attempts,
    "runAfter"
  )
  SELECT
    CONCAT('db-', SUBSTR(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT), 1, 24)),
    p_entity_type,
    p_entity_id,
    p_entity_name,
    v_entity_key,
    v_payload,
    'pending',
    0,
    NOW()
  WHERE NOT EXISTS (
    SELECT 1
    FROM public."EnrichmentQueue" q
    WHERE q."entityKey" = v_entity_key
      AND q.status IN ('pending', 'processing')
  );

  UPDATE public."EnrichmentQueue"
  SET
    "contextData" = v_payload,
    "runAfter" = LEAST(COALESCE("runAfter", NOW()), NOW())
  WHERE "entityKey" = v_entity_key
    AND status IN ('pending', 'processing')
    AND (
      "contextData" IS NULL
      OR "contextData" = '{}'::JSONB
      OR COALESCE(("contextData"->>'queuedAt'), '') = ''
    );

  IF p_entity_type = 'Company' THEN
    UPDATE public."Company"
    SET "enrichmentStatus" = 'pending'
    WHERE id = p_entity_id
      AND ("analysis" IS NULL OR COALESCE("enrichmentStatus", 'none') IN ('none', 'error'));
  ELSIF p_entity_type = 'Job' THEN
    UPDATE public."Role"
    SET "enrichmentStatus" = 'pending'
    WHERE id = p_entity_id
      AND ("analysis" IS NULL OR COALESCE("enrichmentStatus", 'none') IN ('none', 'error'));
  ELSIF p_entity_type = 'City' THEN
    UPDATE public."Location"
    SET "enrichmentStatus" = 'pending'
    WHERE id = p_entity_id
      AND ("analysis" IS NULL OR COALESCE("enrichmentStatus", 'none') IN ('none', 'error'));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.enqueue_enrichment_from_salary()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_company_name TEXT;
  v_role_title TEXT;
  v_city TEXT;
  v_state TEXT;
  v_city_context JSONB;
BEGIN
  SELECT c.name INTO v_company_name
  FROM public."Company" c
  WHERE c.id = NEW."companyId";

  SELECT r.title INTO v_role_title
  FROM public."Role" r
  WHERE r.id = NEW."roleId";

  SELECT l.city, l.state INTO v_city, v_state
  FROM public."Location" l
  WHERE l.id = NEW."locationId";

  IF v_company_name IS NOT NULL THEN
    PERFORM public.enqueue_entity_enrichment_job('Company', NEW."companyId", v_company_name, '{}'::JSONB);
  END IF;

  IF v_role_title IS NOT NULL THEN
    PERFORM public.enqueue_entity_enrichment_job('Job', NEW."roleId", v_role_title, '{}'::JSONB);
  END IF;

  IF v_city IS NOT NULL THEN
    v_city_context := jsonb_build_object(
      'stateIncomeTaxStatus',
      CASE UPPER(COALESCE(v_state, ''))
        WHEN 'AK' THEN 'No state income tax'
        WHEN 'FL' THEN 'No state income tax'
        WHEN 'NV' THEN 'No state income tax'
        WHEN 'NH' THEN 'No state income tax'
        WHEN 'SD' THEN 'No state income tax'
        WHEN 'TN' THEN 'No state income tax'
        WHEN 'TX' THEN 'No state income tax'
        WHEN 'WA' THEN 'No state income tax'
        WHEN 'WY' THEN 'No state income tax'
        ELSE 'Has state income tax'
      END,
      'costOfLivingTier', 'medium',
      'state', COALESCE(v_state, '')
    );

    PERFORM public.enqueue_entity_enrichment_job(
      'City',
      NEW."locationId",
      CONCAT(v_city, ', ', COALESCE(v_state, '')),
      v_city_context
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "enqueue_enrichment_from_salary" ON public."Salary";

CREATE TRIGGER "enqueue_enrichment_from_salary"
AFTER INSERT OR UPDATE OF "companyId", "roleId", "locationId" ON public."Salary"
FOR EACH ROW
EXECUTE FUNCTION public.enqueue_enrichment_from_salary();
