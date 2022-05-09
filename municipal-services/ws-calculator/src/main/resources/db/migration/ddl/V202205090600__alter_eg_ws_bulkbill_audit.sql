ALTER TABLE eg_ws_bulkbill_audit 
ADD COLUMN audittime bigint NOT NULL,
message CHARACTER VARYING (2048) NOT NULL;
