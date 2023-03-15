ALTER TABLE eg_businesscategory DROP COLUMN createddate;
ALTER TABLE eg_businesscategory DROP COLUMN lastmodifieddate;
ALTER TABLE eg_businesscategory ADD COLUMN createddate BIGINT NOT NULL DEFAULT (100);
ALTER TABLE eg_businesscategory ADD COLUMN lastmodifieddate BIGINT NOT NULL DEFAULT (100);


ALTER TABLE eg_businessdetails DROP COLUMN createddate;
ALTER TABLE eg_businessdetails DROP COLUMN lastmodifieddate;
ALTER TABLE eg_businessdetails DROP COLUMN vouchercutoffdate  ;
ALTER TABLE eg_businessdetails ADD COLUMN createddate BIGINT NOT NULL DEFAULT (100);
ALTER TABLE eg_businessdetails ADD COLUMN lastmodifieddate BIGINT NOT NULL DEFAULT (100);
ALTER TABLE eg_businessdetails ADD COLUMN vouchercutoffdate BIGINT;
ALTER TABLE eg_businessdetails ALTER COLUMN businessType TYPE character varying(32);