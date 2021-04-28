ALTER TABLE eg_sw_connection
ADD COLUMN IF NOT EXISTS applicationType character varying(64),
ADD COLUMN IF NOT EXISTS dateEffectiveFrom bigint;

ALTER TABLE eg_sw_connection_audit
ADD COLUMN IF NOT EXISTS applicationType character varying(64),
ADD COLUMN IF NOT EXISTS dateEffectiveFrom bigint;