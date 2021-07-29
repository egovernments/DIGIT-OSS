ALTER TABLE eg_ws_connection ADD COLUMN IF NOT EXISTS isoldapplication BOOLEAN DEFAULT FALSE;

ALTER TABLE eg_ws_connection_audit ADD COLUMN IF NOT EXISTS isoldapplication BOOLEAN DEFAULT FALSE;

ALTER TABLE eg_ws_service DROP COLUMN IF EXISTS propertyid;

ALTER TABLE eg_ws_service_audit DROP COLUMN IF EXISTS propertyid;