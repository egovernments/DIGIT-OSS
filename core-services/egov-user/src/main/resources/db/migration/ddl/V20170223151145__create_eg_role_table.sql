CREATE TABLE eg_role (
    id serial NOT NULL primary key,
    name character varying(32) NOT NULL,
    code character varying(50) NOT NULL,
    description character varying(128),
    createddate timestamp DEFAULT CURRENT_TIMESTAMP,
    createdby bigint,
    lastmodifiedby bigint,
    lastmodifieddate timestamp,
    version bigint,
    tenantid character varying(256) not null,
    CONSTRAINT eg_roles_role_name_key UNIQUE (name)
);