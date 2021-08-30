CREATE SEQUENCE seq_egbs_taxHeadMaster;
CREATE SEQUENCE seq_egbs_taxHeadMastercode;

CREATE TABLE public.egbs_taxheadmaster
(
  id character varying(64) NOT NULL,
  tenantid character varying(128) NOT NULL,
  category character varying(250) NOT NULL,
  service character varying(64) NOT NULL,
  name character varying(64) NOT NULL,
  code character varying(64),
  isdebit boolean,
  isactualdemand boolean,
  orderno integer,
  validfrom bigint,
  validtill bigint,
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,
  CONSTRAINT pk_egbs_taxheadmaster PRIMARY KEY (id, tenantid)
);




CREATE SEQUENCE seq_egbs_glcodemaster;

CREATE TABLE public.egbs_glcodemaster
(
  id character varying(64) NOT NULL,
  tenantid character varying(128) NOT NULL,
  taxhead character varying(250) NOT NULL,
  service character varying(64) NOT NULL,
  fromdate bigint NOT NULL,
  todate bigint NOT NULL,
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,
  glcode character varying(64),
  CONSTRAINT pk_egbs_glcodemaster PRIMARY KEY (id, tenantid)
);