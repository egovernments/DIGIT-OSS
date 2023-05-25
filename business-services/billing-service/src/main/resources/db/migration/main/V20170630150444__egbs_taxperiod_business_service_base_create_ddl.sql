-- TaxPeriod --

CREATE TABLE egbs_taxperiod
(
  id character varying(64) NOT NULL,
  service character varying(100) NOT NULL,
  code character varying(25) NOT NULL,
  fromdate bigint NOT NULL,
  todate bigint NOT NULL,
  financialyear character varying(50),
  createddate bigint NOT NULL,
  lastmodifieddate bigint NOT NULL,
  createdby character varying(64) NOT NULL,
  lastmodifiedby character varying(64) NOT NULL,
  tenantid character varying(250) NOT NULL,
  CONSTRAINT pk_taxperiod PRIMARY KEY (id, tenantid),
  CONSTRAINT unq_service_code UNIQUE (service, code, tenantid)
);

CREATE SEQUENCE seq_egbs_taxperiod;


-- BusinessServiceDetail --

CREATE TABLE egbs_business_service_details
(
  id character varying(64) NOT NULL,
  businessservice character varying(250) NOT NULL,
  collectionmodesnotallowed character varying(250),
  callbackforapportioning boolean DEFAULT false,
  partpaymentallowed boolean DEFAULT false,
  callbackapportionurl character varying(250),
  createddate bigint NOT NULL,
  lastmodifieddate bigint NOT NULL,
  createdby character varying(64) NOT NULL,
  lastmodifiedby character varying(64) NOT NULL,
  tenantid character varying(250) NOT NULL,
  CONSTRAINT pk_biz_srvc_det PRIMARY KEY (id, tenantid),
  CONSTRAINT unq_businessservice UNIQUE (businessservice, tenantid)
);

CREATE SEQUENCE seq_egbs_business_srvc_details;


