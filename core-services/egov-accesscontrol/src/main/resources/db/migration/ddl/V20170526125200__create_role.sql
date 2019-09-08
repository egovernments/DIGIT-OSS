CREATE SEQUENCE SEQ_EG_MS_ROLE
 START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE eg_ms_role (
    id serial NOT NULL primary key,
    name character varying(32) NOT NULL,
    code character varying(50) NOT NULL,
    description character varying(128),
    createddate timestamp DEFAULT CURRENT_TIMESTAMP,
    createdby bigint,
    lastmodifiedby bigint,
    lastmodifieddate timestamp,
    version bigint,
    CONSTRAINT eg_roles_role_name_key UNIQUE (name)
);