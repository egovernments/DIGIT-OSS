CREATE TABLE IF NOT EXISTS eg_pgr_service
(
  tenantid character varying(64) NOT NULL,
  servicecode character varying(64) NOT NULL,
  servicerequestid character varying(64) NOT NULL,
  description character varying(500) NOT NULL,
  lat numeric(9,6),
  "long" numeric(10,7),
  address character varying(256),
  addressid character varying(64),
  email character varying(256),
  deviceid character varying(64),
  accountid character varying(64),
  firstname character varying(32),
  lastname character varying(64),
  phone character varying(64) NOT NULL,
  attributes jsonb,
  status character varying(64),
  source character varying(64),
  expectedtime bigint,
  feedback character varying(500),
  rating character varying(5),
  createdby character varying(256) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(256),
  lastmodifiedtime bigint,
  CONSTRAINT pk_eg_pgr_service PRIMARY KEY (tenantid, servicerequestid)
);



CREATE TABLE IF NOT EXISTS eg_pgr_action
(
  uuid character varying(500),
  tenantid character varying(256) NOT NULL,
  by character varying(256) ,
  isinternal boolean,
  "when" bigint NOT NULL,
  businesskey character varying(500) NOT NULL,
  status character varying(64),
  assignee character varying(256),
  media JSONB,
  comments character varying(1024),
  CONSTRAINT pk_eg_pgr_action PRIMARY KEY (tenantid, businesskey)
);


