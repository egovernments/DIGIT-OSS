ALTER TABLE eg_ws_connection
ADD COLUMN IF NOT EXISTS disconnectionReason character varying(1024);

ALTER TABLE eg_ws_connection_audit
ADD COLUMN IF NOT EXISTS disconnectionReason character varying(1024);