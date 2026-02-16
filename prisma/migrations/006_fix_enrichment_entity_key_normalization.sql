-- Migration 006: fix entityKey normalization for DB trigger queueing.
-- Previous regex removed uppercase letters before lowercasing, producing malformed keys
-- like "Company:-epsi-o". Normalize by lowercasing first.

CREATE OR REPLACE FUNCTION public.enrichment_entity_key(entity_type TEXT, entity_name TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT entity_type || ':' || REGEXP_REPLACE(LOWER(TRIM(COALESCE(entity_name, ''))), '[^a-z0-9]+', '-', 'g');
$$;
