CREATE TABLE egcl_payment_migration (

  id CHARACTER VARYING (128) NOT NULL,
  batch bigint NOT NULL,
  batchsize bigint NOT NULL,
  createdtime bigint NOT NULL,
  tenantid CHARACTER VARYING (256) NOT NULL,
  recordCount bigint NOT NULL,

  CONSTRAINT pk_egcl_payment_migration_id PRIMARY KEY(id)
);
