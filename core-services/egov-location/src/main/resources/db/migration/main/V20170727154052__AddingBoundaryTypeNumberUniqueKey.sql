ALTER TABLE eg_boundary ALTER COLUMN boundarynum SET NOT NULL;

ALTER TABLE eg_boundary ADD CONSTRAINT bndrynumtype_ukey UNIQUE (boundarynum,boundarytype,tenantId);