ALTER TABLE eg_fsm_application ADD COLUMN applicationtype character varying(256) DEFAULT 'ADHOC' NOT NULL;

ALTER TABLE eg_fsm_application_auditlog ADD COLUMN applicationtype character varying(256) DEFAULT 'ADHOC' NOT NULL;
	
ALTER TABLE eg_fsm_application ADD COLUMN oldapplicationno character varying(256) DEFAULT NULL;

ALTER TABLE eg_fsm_application_auditlog ADD COLUMN oldapplicationno character varying(256) DEFAULT NULL;
