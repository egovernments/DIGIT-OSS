ALTER TABLE egcl_collectionheader DROP CONSTRAINT fk_collhead_service;
ALTER TABLE egcl_collectionheader ALTER COLUMN servicedetails TYPE varchar(80);