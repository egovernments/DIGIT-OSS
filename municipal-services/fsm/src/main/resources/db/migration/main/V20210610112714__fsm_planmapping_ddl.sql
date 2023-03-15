CREATE TABLE IF NOT EXISTS  eg_fsm_plantmapping(
    id character varying(256) NOT NULL,
    tenantid character varying(64),
    status character varying(64),
    employeeuuid character varying(64) NOT NULL,
    plantcode character varying(64) NOT NULL,
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT pk_eg_fsm_plantmapping PRIMARY KEY (id) 
);