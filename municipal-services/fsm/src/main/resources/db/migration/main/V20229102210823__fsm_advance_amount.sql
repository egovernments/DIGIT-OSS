ALTER TABLE eg_fsm_application ADD COLUMN IF NOT EXISTS advanceAmount numeric(12,2) ;
ALTER TABLE eg_fsm_application_auditlog ADD COLUMN IF NOT EXISTS advanceAmount numeric(12,2);

