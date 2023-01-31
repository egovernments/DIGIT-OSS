CREATE TABLE IF NOT EXISTS eg_pt_id_enc_audit (
  tenantid CHARACTER VARYING (256) NOT NULL,
  id CHARACTER VARYING (128) NOT NULL,
  propertyid CHARACTER VARYING (256),
  acknowldgementnumber CHARACTER VARYING (128),
  createdTime BIGINT NOT NULL,

  CONSTRAINT pk_eg_pt_id_enc_audit PRIMARY KEY (id),
  CONSTRAINT uk_eg_pt_id_enc_audit UNIQUE (tenantid, propertyid, acknowldgementnumber)
);