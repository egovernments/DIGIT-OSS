ALTER TABLE eg_billregistermis RENAME COLUMN departmentid TO departmentcode;

ALTER TABLE eg_billregistermis ALTER COLUMN departmentcode TYPE character varying(50);

ALTER TABLE vouchermis RENAME COLUMN departmentid TO departmentcode;

ALTER TABLE vouchermis ALTER COLUMN departmentcode TYPE character varying(50);
