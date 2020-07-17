CREATE TABLE IF NOT EXISTS state.TEMP_EG_ROLE(
id bigint,
name character varying,
description character varying,
createddate timestamp without time zone,
createdby bigint,
lastmodifiedby bigint,
lastmodifieddate timestamp without time zone,
version bigint,
internal boolean
);


INSERT INTO state.TEMP_EG_ROLE (id, name, description, createddate, createdby, lastmodifiedby, lastmodifieddate, version, internal)
SELECT id,name,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,internal FROM state.eg_role ;

