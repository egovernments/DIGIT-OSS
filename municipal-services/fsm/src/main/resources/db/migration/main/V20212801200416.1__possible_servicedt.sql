ALTER TABLE eg_fsm_application ADD COLUMN IF NOT EXISTS possible_srv_date bigint;
ALTER TABLE eg_fsm_application_auditlog ADD COLUMN IF NOT EXISTS possible_srv_date bigint ;

ALTER TABLE eg_fsm_application ADD COLUMN IF NOT EXISTS dso_id character varying(64);
ALTER TABLE eg_fsm_application_auditlog ADD COLUMN IF NOT EXISTS dso_id character varying(64);