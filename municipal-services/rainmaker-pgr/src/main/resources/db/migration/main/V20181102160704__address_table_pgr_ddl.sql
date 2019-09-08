CREATE TABLE eg_pgr_address(

  uuid varchar(256),
  housenoandstreetname  varchar(32),
  mohalla varchar(256),
  landmark varchar(256),
  latitude numeric(9,6),
  longitude numeric(10,7),
  city varchar(256),
  tenantid varchar(256),
  createdby character varying(256) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(256),
  lastmodifiedtime bigint,
  
  CONSTRAINT pk_eg_pgr_address PRIMARY KEY (tenantId,uuid)
); 