ALTER TABLE eg_ws_connection ADD COLUMN IF NOT EXISTS channel CHARACTER VARYING (128);

ALTER TABLE eg_ws_connection_audit ADD COLUMN IF NOT EXISTS channel CHARACTER VARYING (128);

UPDATE eg_ws_connection SET channel = 'SYSTEM' WHERE channel IS NULL;

UPDATE eg_ws_connection_audit SET channel = 'SYSTEM' WHERE channel IS NULL;