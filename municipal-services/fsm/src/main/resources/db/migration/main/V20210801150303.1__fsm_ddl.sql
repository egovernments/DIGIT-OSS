ALTER TABLE eg_fsm_pit_detail
	ADD COLUMN fsm_id character varying(64) NOT NULL,
	DROP COLUMN fms_id;
	
	ALTER TABLE eg_fsm_pit_detail_auditlog
	ADD COLUMN fsm_id character varying(64) NOT NULL;