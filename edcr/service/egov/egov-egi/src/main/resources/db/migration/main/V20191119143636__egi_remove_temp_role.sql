
INSERT INTO state.eg_role (id, name, description, createddate, createdby, lastmodifiedby, lastmodifieddate, internal)
SELECT id,name,description,createddate,createdby,lastmodifiedby,lastmodifieddate,internal FROM state.temp_eg_role rl  where not exists (select * from state.eg_role where name =  rl.name);

DROP TABLE state.TEMP_EG_ROLE;

SELECT setval('state.seq_eg_role',(select max(id)+1 from state.eg_role));