CREATE TABLE eg_token (
    id character(36) PRIMARY KEY,
    tenantid character varying(256) NOT NULL,
    tokennumber character varying(128) NOT NULL,
    tokenidentity character varying(100) NOT NULL,
    validated CHARACTER(1) NOT NULL DEFAULT 'N',
    ttlsecs bigint NOT NULL,
    createddate timestamp NOT NULL,
    lastmodifieddate timestamp,
    createdby bigint NOT NULL,
    lastmodifiedby bigint,
    version bigint
);

CREATE INDEX idx_token_number_identity_tenant ON eg_token (tokennumber, tokenidentity, tenantid);