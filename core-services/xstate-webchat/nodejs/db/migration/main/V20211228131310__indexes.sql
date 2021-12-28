DROP INDEX IF EXISTS eg_webchat_state_idx_user_id_v2;
DROP INDEX IF EXISTS eg_webchat_state_idx_active_v2;

CREATE INDEX eg_webchat_idx_user_id_active_v2 ON eg_webchat_state_v2 (user_id, active);