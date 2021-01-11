CREATE TABLE eg_pgr_migration_audit(

tenantId character varying(256),
currentOffset INT,
CONSTRAINT pk_eg_pgr_migration_audit PRIMARY KEY (tenantId)
);