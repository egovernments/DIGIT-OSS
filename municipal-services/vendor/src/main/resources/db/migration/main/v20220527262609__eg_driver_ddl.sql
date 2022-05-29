CREATE TABLE IF NOT EXISTS  eg_driver(
    id character varying(256) NOT NULL,
    name character varying(128),
    tenantid character varying(64),
	licenceno character varying(64),
    additionaldetails jsonb,
    owner_id character varying(64) NOT NULL,
    description character varying(256) DEFAULT NULL,
    status character varying(64),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT pk_eg_driver PRIMARY KEY (id)
);