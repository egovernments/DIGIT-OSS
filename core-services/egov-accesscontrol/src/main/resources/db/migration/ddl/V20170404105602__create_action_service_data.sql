CREATE SEQUENCE seq_service;
CREATE TABLE service
(
  id bigint NOT NULL,
  code character varying(50) NOT NULL,
  name character varying(100) NOT NULL,
  enabled boolean,
  contextroot character varying(20),
  displayname character varying(100),
  ordernumber bigint,
  parentmodule character varying(100),
  tenantid character varying(50) NOT NULL,
  CONSTRAINT eg_service_pkey PRIMARY KEY (id),
  CONSTRAINT eg_service_ukey UNIQUE (name)
);

CREATE SEQUENCE seq_eg_action;

CREATE TABLE eg_action
(
  id bigint NOT NULL,
  name character varying(100) NOT NULL,
  url character varying(100),
  servicecode character varying(50),
  queryparams character varying(100),
  parentmodule character varying(50),
  ordernumber bigint,
  displayname character varying(100),
  enabled boolean,
  createdby bigint DEFAULT 1,
  createddate timestamp DEFAULT now(),
  lastmodifiedby bigint DEFAULT 1,
  lastmodifieddate timestamp DEFAULT now(),
  tenantid character varying(50) NOT NULL,
  CONSTRAINT eg_action_pkey PRIMARY KEY (id),
  CONSTRAINT eg_action_name_key UNIQUE (name),
  CONSTRAINT eg_action_url_queryparams_key UNIQUE (url, queryparams)
);

CREATE TABLE eg_roleaction
(
  rolecode character varying(32) NOT NULL,
  actionid bigint NOT NULL,
  tenantid character varying(50) NOT NULL,
  CONSTRAINT eg_roleaction_ukey UNIQUE (rolecode, actionid)
);

