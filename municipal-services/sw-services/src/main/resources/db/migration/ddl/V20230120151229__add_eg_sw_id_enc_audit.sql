CREATE TABLE IF NOT EXISTS eg_sw_id_enc_audit (
  tenantid CHARACTER VARYING (256) NOT NULL,
  id CHARACTER VARYING (128) NOT NULL,
  applicationno CHARACTER VARYING (256),
  connectionno CHARACTER VARYING (128),
  createdTime BIGINT NOT NULL,

  CONSTRAINT pk_eg_sw_id_enc_audit PRIMARY KEY (id),
  CONSTRAINT uk_eg_sw_id_enc_audit UNIQUE (tenantid, applicationno, connectionno)
);