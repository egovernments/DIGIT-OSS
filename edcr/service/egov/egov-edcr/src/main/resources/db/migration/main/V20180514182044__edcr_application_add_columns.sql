Alter TABLE edcr_application ADD COLUMN occupancy CHARACTER VARYING (256);

Alter TABLE edcr_application ADD COLUMN applicantname CHARACTER VARYING (256);

Alter TABLE edcr_application ADD COLUMN architectInformation CHARACTER VARYING (256);

alter table edcr_application ADD COLUMN serviceType character varying(50);

alter table edcr_application ADD COLUMN amenities character varying(200);