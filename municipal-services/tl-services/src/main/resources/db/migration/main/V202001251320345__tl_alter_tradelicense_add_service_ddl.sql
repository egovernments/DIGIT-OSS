ALTER TABLE eg_tl_tradelicense
ADD COLUMN IF NOT EXISTS applicationType character varying(64);
ALTER TABLE eg_tl_tradelicense
ADD COLUMN IF NOT EXISTS workflowCode character varying(64);
ALTER TABLE eg_tl_tradelicense_audit
ADD COLUMN IF NOT EXISTS applicationType character varying(64);
ALTER TABLE eg_tl_tradelicense_audit
ADD COLUMN IF NOT EXISTS workflowCode character varying(64);