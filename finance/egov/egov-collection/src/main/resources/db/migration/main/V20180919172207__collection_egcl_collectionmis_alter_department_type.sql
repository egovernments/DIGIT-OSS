ALTER TABLE egcl_collectionmis DROP CONSTRAINT fk_collmis_department;
ALTER TABLE egcl_collectionmis ALTER COLUMN department TYPE varchar(80);