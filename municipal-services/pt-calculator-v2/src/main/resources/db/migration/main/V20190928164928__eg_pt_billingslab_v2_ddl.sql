DROP TABLE IF EXISTS eg_pt_billingslab_v2;

CREATE TABLE eg_pt_billingslab_v2(

  id character varying(64),
  tenantId character varying(256),
  propertyType character varying(64),
  roadType character varying(64),
  constructionType character varying(64),
  ward character varying(64),
  mohalla character varying(64),
  fromDate bigint,
  toDate bigint,
  unitRate bigint,
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_billingslab_v2 PRIMARY KEY (id, tenantid),
  CONSTRAINT uk_eg_pt_billingslab_v2 UNIQUE (id)
);