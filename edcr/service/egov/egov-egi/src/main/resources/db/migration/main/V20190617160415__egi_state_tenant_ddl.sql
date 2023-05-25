create table IF NOT EXISTS state.eg_tenant (
  id bigint NOT NULL,
  name character varying(256) NOT NULL,
  code character varying(256) NOT NULL,
  createdby bigint NOT NULL,
  createddate timestamp without time zone NOT NULL,
  lastModifiedDate timestamp without time zone,
  lastModifiedBy bigint,
  version numeric NOT NULL,
  CONSTRAINT PK_eg_tenant_ID PRIMARY KEY (ID),
  CONSTRAINT eg_tenant_name_key UNIQUE (name),
  CONSTRAINT eg_tenant_code_key UNIQUE (code),
  CONSTRAINT FK_eg_tenant_MDFDBY FOREIGN KEY (lastModifiedBy) REFERENCES state.EG_USER (ID),
  CONSTRAINT FK_eg_tenant_CRTBY FOREIGN KEY (createdBy)REFERENCES state.EG_USER (ID)
);
create sequence IF NOT EXISTS SEQ_EG_TENANT;