ALTER TABLE eg_sw_connection ADD COLUMN IF NOT EXISTS channel CHARACTER VARYING (128);

ALTER TABLE eg_sw_connection_audit ADD COLUMN IF NOT EXISTS channel CHARACTER VARYING (128);

UPDATE eg_sw_connection SET channel = 'SYSTEM' WHERE channel IS NULL;

UPDATE eg_sw_connection_audit SET channel = 'SYSTEM' WHERE channel IS NULL;