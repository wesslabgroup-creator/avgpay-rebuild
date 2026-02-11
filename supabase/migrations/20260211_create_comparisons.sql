CREATE TABLE IF NOT EXISTS comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_a_type text NOT NULL,
  entity_a_id uuid NOT NULL,
  entity_a_name text NOT NULL,
  entity_a_slug text NOT NULL,
  entity_b_type text NOT NULL,
  entity_b_id uuid NOT NULL,
  entity_b_name text NOT NULL,
  entity_b_slug text NOT NULL,
  stats_snapshot jsonb,
  generated_insights jsonb,
  status text NOT NULL DEFAULT 'completed',
  generated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT comparisons_entity_pair_unique UNIQUE (entity_a_type, entity_a_id, entity_b_type, entity_b_id)
);

CREATE INDEX IF NOT EXISTS idx_comparisons_status_updated_at
  ON comparisons(status, updated_at DESC);
