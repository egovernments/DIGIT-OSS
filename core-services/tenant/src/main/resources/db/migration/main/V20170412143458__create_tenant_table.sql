CREATE SEQUENCE seq_tenant;

CREATE TABLE tenant (
  id bigint NOT NULL,
  code varchar(256) NOT NULL,
  description varchar(300),
  domainurl varchar(128),
  logoid varchar(36) NOT NULL,
  imageid varchar(36) NOT NULL,
  type varchar(35) NOT NULL,
  createdby bigint,
  createddate timestamp DEFAULT now(),
  lastmodifiedby bigint,
  lastmodifieddate timestamp DEFAULT now(),
  CONSTRAINT tenant_pkey PRIMARY KEY (id),
  CONSTRAINT tenant_code_ukey UNIQUE (code)
);

