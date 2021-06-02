ALTER TABLE eg_ws_connection
ADD COLUMN IF NOT EXISTS applicationType character varying(64),
ADD COLUMN IF NOT EXISTS dateEffectiveFrom bigint;

ALTER TABLE eg_ws_connection_audit
ADD COLUMN IF NOT EXISTS applicationType character varying(64),
ADD COLUMN IF NOT EXISTS dateEffectiveFrom bigint; 

