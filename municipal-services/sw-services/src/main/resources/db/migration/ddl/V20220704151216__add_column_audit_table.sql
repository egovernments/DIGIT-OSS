ALTER TABLE eg_sw_connection_audit
ADD COLUMN IF NOT EXISTS isDisconnectionTemporary BOOLEAN DEFAULT FALSE;