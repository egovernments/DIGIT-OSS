DROP SEQUENCE IF EXISTS seq_eg_pgr_serviceRequestId;

DROP TABLE IF EXISTS eg_pgr_media;
DROP TABLE IF EXISTS eg_pgr_comment;
DROP TABLE IF EXISTS eg_pgr_serviceReq_audit;
DROP TABLE IF EXISTS eg_pgr_serviceReq;

CREATE SEQUENCE seq_eg_pgr_serviceRequestId;

CREATE TABLE eg_pgr_serviceReq(

  tenantId character varying(256),
  serviceCode character varying(256) NOT NULL,
  serviceRequestId character varying(256),
  description character varying(4000) NOT NULL,
  lat numeric(9,6),
  "long" numeric(10,7),
  address character varying(1024),
  addressId character varying(256),
  email character varying(254),
  deviceId character varying(256),
  accountId character varying(256),
  firstName character varying(128),
  lastName character varying(128),
  phone character varying(64) NOT NULL,
  attributes JSONB,
  status character varying(64),
  assignedTo character varying(256),
  source character varying(256),
  expectedTime bigint,
  createdby character varying(256) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(256),
  lastmodifiedtime bigint,
  CONSTRAINT pk_eg_pgr_serviceReq PRIMARY KEY (tenantId,serviceRequestId)
);


CREATE TABLE eg_pgr_media(

  id character varying(256),
  by character varying(256) NOT NULL,
  "when" bigint NOT NULL,
  url character varying(2048) NOT NULL,
  tenantId character varying(256) NOT NULL,
  serviceRequestId character varying(256) NOT NULL,
  CONSTRAINT pk_eg_pgr_media PRIMARY KEY (id,tenantId),
  CONSTRAINT fk_eg_pgr_media FOREIGN KEY (tenantId,serviceRequestId) REFERENCES eg_pgr_serviceReq(tenantId,serviceRequestId)
);

CREATE TABLE eg_pgr_comment(

  id character varying(256),
  by character varying(256) NOT NULL,
  "when" bigint NOT NULL,
  message character varying(4000) NOT NULL,
  tenantId character varying(256) NOT NULL,
  serviceRequestId character varying(256) NOT NULL,
  isInternal boolean NOT NULL,
  CONSTRAINT pk_eg_pgr_comments PRIMARY KEY (id,tenantId),
  CONSTRAINT fk_eg_pgr_media FOREIGN KEY (tenantId,serviceRequestId) REFERENCES eg_pgr_serviceReq(tenantId,serviceRequestId)
);

CREATE TABLE eg_pgr_servicereq_audit
(
    id SERIAL,
    tenantid character varying(256),
    servicecode character varying(256),
    servicerequestid character varying(256),
    description character varying(4000)  NOT NULL,
    lat numeric(9,6),
    "long" numeric(10,7),
    address character varying(1024),
    addressid character varying(256),
    email character varying(254),
    deviceid character varying(256),
    accountid character varying(256),
    firstname character varying(128),
    lastname character varying(128),
    phone character varying(64) NOT NULL,
    attributes jsonb,
    status character varying(64),
    assignedto character varying(256),
    source character varying(256),
    expectedtime bigint,
    createdby character varying(256), -->NOT NULL,
    createdtime bigint, -->NOT NULL,
    --> auditcreatedby character varying(256) NOT NULL,
    auditcreatedtime bigint NOT NULL,
    CONSTRAINT pk_eg_pgr_servicereq_audit PRIMARY KEY (id,tenantId),
    CONSTRAINT fk_eg_pgr_servicereq_audit FOREIGN KEY (servicerequestid, tenantid) REFERENCES eg_pgr_servicereq (servicerequestid, tenantid)
);
