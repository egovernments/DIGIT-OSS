ALTER TABLE eg_sw_connection
ADD COLUMN IF NOT EXISTS disconnectionExecutionDate bigint;

ALTER TABLE eg_sw_connection_audit
ADD COLUMN IF NOT EXISTS disconnectionExecutionDate bigint;