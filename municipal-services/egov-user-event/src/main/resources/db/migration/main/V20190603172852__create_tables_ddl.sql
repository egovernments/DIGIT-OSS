CREATE TABLE eg_men_events(

  tenantid character varying(256) NOT NULL,
  id character varying(500) NOT NULL,
  source character varying(256),
  eventtype character varying(256),
  name character varying(256),
  description character varying(256),
  status character varying(256),
  postedby character varying(256),
  referenceid character varying(256),
  recepient jsonb,
  eventdetails jsonb,
  actions jsonb,
  createdby character varying(256) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(256),
  lastmodifiedtime bigint,
  
  CONSTRAINT pk_eg_men_events PRIMARY KEY (id)
  
);



CREATE TABLE eg_men_recepnt_event_registry(

  recepient character varying(500) NOT NULL,
  eventid character varying(500) NOT NULL
   
);


CREATE TABLE eg_men_user_llt(

  userid character varying(500) NOT NULL,
  lastlogintime bigint NOT NULL,
  
  CONSTRAINT pk_eg_llt PRIMARY KEY (userid)

);