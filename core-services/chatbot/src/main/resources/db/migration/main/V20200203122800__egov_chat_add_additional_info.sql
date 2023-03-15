ALTER TABLE eg_chat_conversation_state ADD COLUMN last_modified_time bigint;
ALTER TABLE eg_chat_message ADD COLUMN raw_input character varying(4096);
ALTER TABLE eg_chat_message ADD COLUMN is_valid BOOLEAN;