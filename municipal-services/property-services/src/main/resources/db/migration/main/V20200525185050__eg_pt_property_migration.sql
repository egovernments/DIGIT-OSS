CREATE TABLE eg_pt_property_migration (

  id CHARACTER VARYING (128) NOT NULL,
  batch bigint NOT NULL,
  batchsize bigint NOT NULL,
  createdtime bigint NOT NULL,

  CONSTRAINT pk_eg_pt_property_migration_id PRIMARY KEY(id)
);
