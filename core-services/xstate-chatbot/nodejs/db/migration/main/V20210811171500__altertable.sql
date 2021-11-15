ALTER TABLE eg_chat_state_v2 add column session_id VARCHAR;
ALTER TABLE eg_chat_state_v2 add column time_stamp VARCHAR;
UPDATE eg_chat_state_v2 SET session_id = md5(random()::text || clock_timestamp()::text)::uuid where session_id is null;
UPDATE eg_chat_state_v2 SET time_stamp = round(EXTRACT (EPOCH FROM now())::float*1000) where time_stamp is null;