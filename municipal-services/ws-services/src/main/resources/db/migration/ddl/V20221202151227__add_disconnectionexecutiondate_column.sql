ALTER TABLE eg_ws_connection
ADD COLUMN IF NOT EXISTS disconnectionExecutionDate bigint;

ALTER TABLE eg_ws_connection_audit
ADD COLUMN IF NOT EXISTS disconnectionExecutionDate bigint;