ALTER TABLE eg_sw_connection ADD COLUMN IF NOT EXISTS locality character varying(64);
ALTER TABLE eg_sw_connection_audit ADD COLUMN IF NOT EXISTS locality character varying(64);