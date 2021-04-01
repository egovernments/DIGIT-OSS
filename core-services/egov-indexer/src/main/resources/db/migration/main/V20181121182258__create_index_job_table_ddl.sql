CREATE TABLE eg_indexer_job(

  tenantid character varying(256) NOT NULL,
  jobid character varying(500) NOT NULL,
  requesterid character varying(256),
  typeofjob character varying(256) NOT NULL,
  oldindex character varying(1024),
  newindex character varying(256) NOT NULL,
  jobstatus character varying(256) NOT NULL,
  totaltimetakeninms bigint NOT NULL,
  createdby character varying(256) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(256),
  lastmodifiedtime bigint,
  
  CONSTRAINT pk_eg_indexer_job PRIMARY KEY (jobid)
);