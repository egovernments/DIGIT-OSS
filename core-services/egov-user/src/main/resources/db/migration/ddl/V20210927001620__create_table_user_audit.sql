CREATE TABLE eg_user_audit(
    uuid character varying (50) not null,
    createdby bigint,
    createdtime timestamp,
    lastmodifiedby bigint,
    lastmodifiedtime timestamp,
    mobilenumber character varying(50)

);
