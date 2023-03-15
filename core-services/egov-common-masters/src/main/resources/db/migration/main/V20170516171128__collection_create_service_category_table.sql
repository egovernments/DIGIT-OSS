CREATE SEQUENCE SEQ_EG_SERVICECATEGORY 
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE eg_servicecategory
(
  id serial primary key,
  name character varying(256) NOT NULL,
  code character varying(50) NOT NULL,
  active boolean,
  tenantid character varying(252) NOT NULL,
  version bigint NOT NULL DEFAULT 1,
  createdby bigint NOT NULL,
  createddate timestamp without time zone,
  lastmodifiedby bigint NOT NULL,
  lastmodifieddate timestamp without time zone,
  CONSTRAINT uk_eg_servicecategory_idtenant UNIQUE (id,tenantid),
  CONSTRAINT uk_eg_servicecategory_codetenant UNIQUE (code,tenantid)
  
);


