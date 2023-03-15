																							  
ALTER TABLE eg_fsm_application 
ALTER COLUMN sanitationtype DROP NOT NULL,
ALTER COLUMN source  DROP NOT NULL,
ALTER COLUMN vehicle_id  DROP NOT NULL;


ALTER TABLE eg_fsm_application_auditlog 
ALTER COLUMN sanitationtype DROP NOT NULL,
ALTER COLUMN source  DROP NOT NULL,
ALTER COLUMN vehicle_id  DROP NOT NULL;