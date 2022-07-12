CREATE TABLE IF NOT EXISTS  eg_driver(
    id character varying(256) NOT NULL,
    name character varying(128),
    tenantid character varying(64),
    additionaldetails jsonb,
    owner_id character varying(64) NOT NULL,
    description character varying(256) DEFAULT NULL,
    status character varying(64),
    licenseNumber character varying(128),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT pk_eg_driver PRIMARY KEY (id)
);


CREATE INDEX  IF NOT EXISTS  index_acct_eg_driver  ON eg_driver
(    owner_id
);
CREATE INDEX  IF NOT EXISTS  index_tenant_eg_driver  ON eg_driver
(    tenantid
);

CREATE INDEX  IF NOT EXISTS  index_id_eg_driver  ON eg_driver
(
    id
);


CREATE TABLE IF NOT EXISTS  eg_driver_auditlog(
   	id character varying(256) NOT NULL,
    name character varying(128),
    tenantid character varying(64),
    additionaldetails jsonb,
    owner_id character varying(64) NOT NULL,
    description character varying(256) DEFAULT NULL,
    status character varying(64),
    licenseNumber character varying(128),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint
);
CREATE INDEX  IF NOT EXISTS  index_id_eg_driver_auditlog  ON eg_driver_auditlog
(
    id
);

