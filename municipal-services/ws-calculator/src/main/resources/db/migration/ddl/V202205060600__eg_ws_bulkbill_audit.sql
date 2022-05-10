CREATE TABLE IF NOT EXISTS eg_ws_bulkbill_audit (
  id CHARACTER VARYING (128) NOT NULL,
  batchoffset bigint NOT NULL,
  createdtime bigint NOT NULL,
  recordCount bigint NOT NULL,
  tenantid CHARACTER VARYING (256) NOT NULL,
  businessservice CHARACTER VARYING (256) NOT NULL,
  CONSTRAINT pk_eg_ws_bulkbill_audit_id PRIMARY KEY (id)
); 