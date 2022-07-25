CREATE TABLE eg_audit_logs(
    id character varying(128),
    tenantid character varying(128),
    useruuid character varying(128),
    module character varying(64),
    transactioncode character varying(128),
    entityname character varying(128),
    objectid character varying(128),
    integrityhash character varying(1024),
    keyvaluemap JSONB,
    operationtype character varying(64),
    changedate bigint,
    CONSTRAINT uk_eg_audit_logs UNIQUE (id),
    CONSTRAINT pk_eg_audit_logs PRIMARY KEY (id)
);