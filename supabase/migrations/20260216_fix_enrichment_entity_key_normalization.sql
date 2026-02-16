-- Fix entityKey normalization for DB trigger queueing.
-- Previous regex removed uppercase letters before lowercasing, producing malformed keys
-- like "Company:-epsi-o". Normalize by lowercasing first.

create or replace function public.enrichment_entity_key(entity_type text, entity_name text)
returns text
language sql
immutable
as $$
  select entity_type || ':' || regexp_replace(lower(trim(coalesce(entity_name, ''))), '[^a-z0-9]+', '-', 'g');
$$;
