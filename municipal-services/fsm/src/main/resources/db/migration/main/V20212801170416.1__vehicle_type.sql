
ALTER TABLE eg_fsm_pit_detail_auditlog DROP COLUMN vehicletype ;
ALTER TABLE eg_fsm_application_auditlog ADD COLUMN vehicletype character varying(64) ;
