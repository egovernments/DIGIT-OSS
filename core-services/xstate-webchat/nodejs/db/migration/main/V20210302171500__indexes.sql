DROP INDEX IF EXISTS eg_chat_state_idx_user_id_v2;
DROP INDEX IF EXISTS eg_chat_state_idx_active_v2;

CREATE INDEX eg_chat_idx_user_id_active_v2 ON eg_chat_state_v2 (user_id, active);