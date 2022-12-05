ALTER TABLE eg_ws_connection
DROP COLUMN IF EXISTS disconnectionExecutionDate;

ALTER TABLE eg_ws_connection_audit
DROP COLUMN IF EXISTS disconnectionExecutionDate;

ALTER TABLE eg_ws_service
ADD COLUMN IF NOT EXISTS disconnectionExecutionDate bigint;

ALTER TABLE eg_ws_service_audit
ADD COLUMN IF NOT EXISTS disconnectionExecutionDate bigint;