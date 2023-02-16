ALTER TABLE eg_sw_connection
ADD COLUMN IF NOT EXISTS disconnectionReason character varying(1024);

ALTER TABLE eg_sw_connection_audit
ADD COLUMN IF NOT EXISTS disconnectionReason character varying(1024);