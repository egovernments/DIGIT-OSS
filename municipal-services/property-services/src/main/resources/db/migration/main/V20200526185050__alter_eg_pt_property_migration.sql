ALTER TABLE eg_pt_property_migration ADD COLUMN tenantid CHARACTER VARYING (256) NOT NULL;
ALTER TABLE eg_pt_property_migration ADD COLUMN recordCount bigint NOT NULL;