ALTER TABLE eg_sw_connection
DROP COLUMN IF EXISTS disconnectionExecutionDate;

ALTER TABLE eg_sw_connection_audit
DROP COLUMN IF EXISTS disconnectionExecutionDate;

ALTER TABLE eg_sw_service
ADD COLUMN IF NOT EXISTS disconnectionExecutionDate bigint;

ALTER TABLE eg_sw_service_audit
ADD COLUMN IF NOT EXISTS disconnectionExecutionDate bigint;