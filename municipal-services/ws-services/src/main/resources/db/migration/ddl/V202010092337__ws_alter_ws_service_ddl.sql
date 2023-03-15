ALTER TABLE eg_ws_service ADD COLUMN IF NOT EXISTS propertyid character varying(64);

ALTER TABLE eg_ws_service_audit ADD COLUMN IF NOT EXISTS propertyid character varying(64);