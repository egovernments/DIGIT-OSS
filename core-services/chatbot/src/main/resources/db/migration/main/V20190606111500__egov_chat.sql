DROP TABLE IF EXISTS eg_chat_message;
DROP TABLE IF EXISTS eg_chat_conversation_state;

CREATE TABLE eg_chat_conversation_state(
    id SERIAL,
    conversation_id character varying(100),
    active_node_id character varying(100),
    user_id character varying(100),
    active BOOLEAN,
    question_details jsonb,
    PRIMARY KEY (id),
    UNIQUE (conversation_id)
);

CREATE UNIQUE INDEX eg_chat_conversation_state_idx_conversation_id  ON eg_chat_conversation_state (conversation_id);
CREATE INDEX eg_chat_conversation_state_idx_user_id ON eg_chat_conversation_state (user_id);
CREATE INDEX eg_chat_conversation_state_idx_active ON eg_chat_conversation_state (active);

CREATE TABLE eg_chat_message(
    id SERIAL,
    message_id character varying(50),
    conversation_id character varying(100),
    node_id character varying(100),
    message_content character varying(1000),
    content_type character varying(100),
    PRIMARY KEY (id),
    CONSTRAINT fk_eg_chat_message_conversation FOREIGN KEY (conversation_id) REFERENCES eg_chat_conversation_state
    (conversation_id) ON DELETE CASCADE
);

CREATE INDEX eg_chat_message_idx_conversation_id ON eg_chat_message (conversation_id);
