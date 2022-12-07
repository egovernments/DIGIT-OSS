CREATE TABLE IF NOT EXISTS eg_pt_enc_audit (
  id CHARACTER VARYING (128) NOT NULL,
  batchoffset bigint NOT NULL,
  createdtime bigint NOT NULL,
  recordCount bigint NOT NULL,
  tenantid CHARACTER VARYING (256) NOT NULL,
  message CHARACTER VARYING (2048) NOT NULL,
  encryptiontime bigint NOT NULL,
  CONSTRAINT pk_eg_pt_enc_audit_id PRIMARY KEY (id)
);