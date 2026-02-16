-- Migration: Repair and harden LLM enrichment pipeline wiring.
-- Safe to run multiple times.

create extension if not exists pgcrypto;

-- 1) Ensure entity enrichment tracking columns exist.
alter table if exists public."Company" add column if not exists "analysis" jsonb;
alter table if exists public."Company" add column if not exists "analysisGeneratedAt" timestamp(3);
alter table if exists public."Company" add column if not exists "enrichmentStatus" text default 'none';
alter table if exists public."Company" add column if not exists "enrichedAt" timestamp(3);
alter table if exists public."Company" add column if not exists "enrichmentError" text;
alter table if exists public."Company" add column if not exists "analysisVersion" integer default 1;

alter table if exists public."Role" add column if not exists "analysis" jsonb;
alter table if exists public."Role" add column if not exists "analysisGeneratedAt" timestamp(3);
alter table if exists public."Role" add column if not exists "enrichmentStatus" text default 'none';
alter table if exists public."Role" add column if not exists "enrichedAt" timestamp(3);
alter table if exists public."Role" add column if not exists "enrichmentError" text;
alter table if exists public."Role" add column if not exists "analysisVersion" integer default 1;

alter table if exists public."Location" add column if not exists "analysis" jsonb;
alter table if exists public."Location" add column if not exists "analysisGeneratedAt" timestamp(3);
alter table if exists public."Location" add column if not exists "enrichmentStatus" text default 'none';
alter table if exists public."Location" add column if not exists "enrichedAt" timestamp(3);
alter table if exists public."Location" add column if not exists "enrichmentError" text;
alter table if exists public."Location" add column if not exists "analysisVersion" integer default 1;

-- 2) Ensure queue table and worker columns exist.
create table if not exists public."EnrichmentQueue" (
  "id" text primary key,
  "entityType" text not null,
  "entityId" text not null,
  "entityName" text not null,
  "contextData" jsonb,
  "status" text not null default 'pending',
  "attempts" integer not null default 0,
  "lastError" text,
  "result" jsonb,
  "createdAt" timestamp(3) not null default current_timestamp,
  "processedAt" timestamp(3)
);

alter table if exists public."EnrichmentQueue" add column if not exists "entityKey" text;
alter table if exists public."EnrichmentQueue" add column if not exists "runAfter" timestamp(3) default current_timestamp;
alter table if exists public."EnrichmentQueue" add column if not exists "lockedAt" timestamp(3);
alter table if exists public."EnrichmentQueue" add column if not exists "lockedBy" text;

update public."EnrichmentQueue"
set "entityKey" = "entityType" || ':' || lower(regexp_replace(trim(coalesce("entityName", '')), '[^a-z0-9]+', '-', 'g'))
where "entityKey" is null;

alter table if exists public."EnrichmentQueue" alter column "entityKey" set not null;
alter table if exists public."EnrichmentQueue" alter column "runAfter" set default current_timestamp;

create index if not exists "EnrichmentQueue_status_idx" on public."EnrichmentQueue"("status");
create index if not exists "EnrichmentQueue_entityType_entityId_idx" on public."EnrichmentQueue"("entityType", "entityId");
create unique index if not exists "EnrichmentQueue_entityKey_active_idx"
on public."EnrichmentQueue"("entityKey") where "status" in ('pending', 'processing');
create index if not exists "EnrichmentQueue_worker_poll_idx"
on public."EnrichmentQueue"("status", "runAfter") where "status" = 'pending';

-- 3) Trigger + enqueue helpers.
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
    gen_random_uuid()::text,
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
    perform public.enqueue_entity_enrichment_job('Company', new."companyId", v_company_name, '{}'::jsonb);
  end if;

  if v_role_title is not null then
    perform public.enqueue_entity_enrichment_job('Job', new."roleId", v_role_title, '{}'::jsonb);
  end if;

  if v_city is not null then
    perform public.enqueue_entity_enrichment_job(
      'City',
      new."locationId",
      concat(v_city, ', ', coalesce(v_state, '')),
      jsonb_build_object(
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
      )
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

-- 4) Backfill helper for entities with missing analysis.
create or replace function public.backfill_missing_enrichment_jobs(p_limit_per_table integer default 100)
returns jsonb
language plpgsql
as $$
declare
  v_company_count integer := 0;
  v_role_count integer := 0;
  v_city_count integer := 0;
  rec record;
begin
  for rec in
    select id, name
    from public."Company"
    where "analysis" is null
       or coalesce("enrichmentStatus", 'none') in ('none', 'error')
    limit greatest(p_limit_per_table, 1)
  loop
    perform public.enqueue_entity_enrichment_job('Company', rec.id, rec.name, '{}'::jsonb);
    v_company_count := v_company_count + 1;
  end loop;

  for rec in
    select id, title
    from public."Role"
    where "analysis" is null
       or coalesce("enrichmentStatus", 'none') in ('none', 'error')
    limit greatest(p_limit_per_table, 1)
  loop
    perform public.enqueue_entity_enrichment_job('Job', rec.id, rec.title, '{}'::jsonb);
    v_role_count := v_role_count + 1;
  end loop;

  for rec in
    select id, city, state
    from public."Location"
    where "analysis" is null
       or coalesce("enrichmentStatus", 'none') in ('none', 'error')
    limit greatest(p_limit_per_table, 1)
  loop
    perform public.enqueue_entity_enrichment_job(
      'City',
      rec.id,
      concat(rec.city, ', ', coalesce(rec.state, '')),
      jsonb_build_object('state', coalesce(rec.state, ''), 'costOfLivingTier', 'medium')
    );
    v_city_count := v_city_count + 1;
  end loop;

  return jsonb_build_object(
    'companies_seen', v_company_count,
    'roles_seen', v_role_count,
    'cities_seen', v_city_count
  );
end;
$$;

-- Seed queue for existing rows that still need enrichment.
select public.backfill_missing_enrichment_jobs(100);
