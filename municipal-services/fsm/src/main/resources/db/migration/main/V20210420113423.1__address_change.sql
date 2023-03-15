	ALTER TABLE  eg_fsm_address
		ALTER COLUMN street TYPE character varying(256);  

	ALTER TABLE  eg_fsm_address
		ALTER COLUMN doorno TYPE character varying(256);  

	ALTER TABLE  eg_fsm_address
		ALTER COLUMN landmark TYPE character varying(1024);  

	ALTER TABLE eg_fsm_address
		ALTER COLUMN pincode TYPE character varying(6);