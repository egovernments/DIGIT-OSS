ALTER TABLE eg_fsm_application ADD COLUMN IF NOT EXISTS completed_on bigint;
ALTER TABLE eg_fsm_application_auditlog ADD COLUMN IF NOT EXISTS completed_on bigint ;