-- Automatically enqueue enrichment jobs whenever Salary rows are inserted/updated.
-- This covers direct DB writes and keeps the queue populated even on hobby cron plans.

create or replace function public.enrichment_entity_key(entity_type text, entity_name text)
returns text
language sql
immutable
as $$
  select entity_type || ':' || lower(regexp_replace(trim(coalesce(entity_name, '')), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.enqueue_entity_enrichment_job(
  p_entity_type text,
  p_entity_id text,
  p_entity_name text,
  p_context_data jsonb default '{}'::jsonb
)
returns void
language plpgsql
as $$
declare
  v_entity_key text;
  v_payload jsonb;
begin
  if p_entity_id is null or p_entity_name is null or trim(p_entity_name) = '' then
    return;
  end if;

  v_entity_key := public.enrichment_entity_key(p_entity_type, p_entity_name);

  v_payload := jsonb_build_object(
    'metricsScope', jsonb_build_object(
      'entityType', p_entity_type,
      'entityName', p_entity_name
    ),
    'queuedAt', now()
  ) || coalesce(p_context_data, '{}'::jsonb);

  insert into public."EnrichmentQueue" (
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
  select
    concat('db-', substr(md5(random()::text || clock_timestamp()::text), 1, 24)),
    p_entity_type,
    p_entity_id,
    p_entity_name,
    v_entity_key,
    v_payload,
    'pending',
    0,
    now()
  where not exists (
    select 1
    from public."EnrichmentQueue" q
    where q."entityKey" = v_entity_key
      and q.status in ('pending', 'processing')
  );

  -- If a pending/processing job already exists but contextData is empty, patch it.
  update public."EnrichmentQueue"
  set
    "contextData" = v_payload,
    "runAfter" = least(coalesce("runAfter", now()), now())
  where "entityKey" = v_entity_key
    and status in ('pending', 'processing')
    and (
      "contextData" is null
      or "contextData" = '{}'::jsonb
      or coalesce(("contextData"->>'queuedAt'), '') = ''
    );

  if p_entity_type = 'Company' then
    update public."Company"
    set "enrichmentStatus" = 'pending'
    where id = p_entity_id
      and ("analysis" is null or coalesce("enrichmentStatus", 'none') in ('none', 'error'));
  elsif p_entity_type = 'Job' then
    update public."Role"
    set "enrichmentStatus" = 'pending'
    where id = p_entity_id
      and ("analysis" is null or coalesce("enrichmentStatus", 'none') in ('none', 'error'));
  elsif p_entity_type = 'City' then
    update public."Location"
    set "enrichmentStatus" = 'pending'
    where id = p_entity_id
      and ("analysis" is null or coalesce("enrichmentStatus", 'none') in ('none', 'error'));
  end if;
end;
$$;

create or replace function public.enqueue_enrichment_from_salary()
returns trigger
language plpgsql
as $$
declare
  v_company_name text;
  v_role_title text;
  v_city text;
  v_state text;
  v_city_context jsonb;
begin
  select c.name into v_company_name
  from public."Company" c
  where c.id = new."companyId";

  select r.title into v_role_title
  from public."Role" r
  where r.id = new."roleId";

  select l.city, l.state into v_city, v_state
  from public."Location" l
  where l.id = new."locationId";

  if v_company_name is not null then
    perform public.enqueue_entity_enrichment_job(
      'Company',
      new."companyId",
      v_company_name,
      '{}'::jsonb
    );
  end if;

  if v_role_title is not null then
    perform public.enqueue_entity_enrichment_job(
      'Job',
      new."roleId",
      v_role_title,
      '{}'::jsonb
    );
  end if;

  if v_city is not null then
    v_city_context := jsonb_build_object(
      'stateIncomeTaxStatus',
      case upper(coalesce(v_state, ''))
        when 'AK' then 'No state income tax'
        when 'FL' then 'No state income tax'
        when 'NV' then 'No state income tax'
        when 'NH' then 'No state income tax'
        when 'SD' then 'No state income tax'
        when 'TN' then 'No state income tax'
        when 'TX' then 'No state income tax'
        when 'WA' then 'No state income tax'
        when 'WY' then 'No state income tax'
        else 'Has state income tax'
      end,
      'costOfLivingTier', 'medium',
      'state', coalesce(v_state, '')
    );

    perform public.enqueue_entity_enrichment_job(
      'City',
      new."locationId",
      concat(v_city, ', ', coalesce(v_state, '')),
      v_city_context
    );
  end if;

  return new;
end;
$$;

drop trigger if exists "enqueue_enrichment_from_salary" on public."Salary";

create trigger "enqueue_enrichment_from_salary"
after insert or update of "companyId", "roleId", "locationId" on public."Salary"
for each row
execute function public.enqueue_enrichment_from_salary();
