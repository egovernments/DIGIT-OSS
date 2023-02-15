ALTER TABLE eg_ws_connection_audit
ADD COLUMN IF NOT EXISTS isDisconnectionTemporary BOOLEAN DEFAULT FALSE;