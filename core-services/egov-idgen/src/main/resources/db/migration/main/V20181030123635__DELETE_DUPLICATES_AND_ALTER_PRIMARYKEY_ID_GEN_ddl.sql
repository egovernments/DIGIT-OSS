
DELETE FROM id_generator WHERE id IN (SELECT id FROM id_generator gen INNER JOIN (SELECT count(*) as count, tenantid, idname FROM id_generator GROUP BY idname, tenantid) gencount 

ON gen.idname = gencount.idname AND gen.tenantid = gencount.tenantid WHERE count > 1);

ALTER TABLE id_generator DROP CONSTRAINT pk_id_generator;

ALTER TABLE id_generator ADD CONSTRAINT pk_id_generator PRIMARY KEY (idname, tenantid);

