CREATE TABLE eg_chat_state_v2 (
    id SERIAL,
    user_id TEXT,
    active BOOLEAN,
    state jsonb,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS eg_chat_state_idx_user_id_v2 ON eg_chat_state_v2 (user_id);
CREATE INDEX IF NOT EXISTS eg_chat_state_idx_active_v2 ON eg_chat_state_v2 (active);
