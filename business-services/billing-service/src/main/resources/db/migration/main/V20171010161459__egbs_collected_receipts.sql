create sequence seq_egbs_collectedreceipts;

CREATE TABLE egbs_collectedreceipts
(
  id character varying(64) NOT NULL,
  businessservice character varying(256) NOT NULL,
  consumercode character varying(250) NOT NULL,
  receiptnumber character varying(1024),
  receiptamount numeric(12,2) NOT NULL,
  receiptdate bigint,
  status character varying(1024),
  tenantid character varying(250) NOT NULL,
  createdby character varying(64) NOT NULL,
  createddate bigint NOT NULL,
  lastmodifiedby character varying(64),
  lastmodifieddate bigint,
  CONSTRAINT pk_egbs_collectedreceipts PRIMARY KEY (id, tenantid)
);
