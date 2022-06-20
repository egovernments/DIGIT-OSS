ALTER TABLE eg_ws_connection_audit
ADD COLUMN IF NOT EXISTS assignee character varying(128),
ADD COLUMN IF NOT EXISTS isDisconnectionTemporary boolean;