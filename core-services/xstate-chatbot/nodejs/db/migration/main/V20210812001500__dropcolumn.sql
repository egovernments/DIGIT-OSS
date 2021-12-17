ALTER TABLE eg_chat_state_v2 drop column time_stamp;
ALTER TABLE eg_chat_state_v2 add column time_stamp numeric;
UPDATE eg_chat_state_v2 SET time_stamp = round(EXTRACT (EPOCH FROM now())::float*1000) where time_stamp is null;