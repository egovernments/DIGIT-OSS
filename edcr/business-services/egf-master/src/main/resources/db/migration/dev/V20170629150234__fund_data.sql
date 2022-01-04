INSERT INTO egf_fund (id, name, code, identifier, level, parentid, isparent, active, createdby, createddate, lastmodifiedby, lastmodifieddate, version, tenantid) VALUES (1, 'Municipal Fund', '01', '1', 1, NULL, false, true, NULL, '2017-05-08', NULL, NULL, 0, 'default');
INSERT INTO egf_fund (id, name, code, identifier, level, parentid, isparent, active, createdby, createddate, lastmodifiedby, lastmodifieddate, version, tenantid) VALUES (2, 'Capital Fund', '02', '2', 1, NULL, false, false, NULL, '2017-05-08', NULL, NULL, 0, 'default');
INSERT INTO egf_fund (id, name, code, identifier, level, parentid, isparent, active, createdby, createddate, lastmodifiedby, lastmodifieddate, version, tenantid) VALUES (3, 'Elementary Education Fund', '03', '3', 1, NULL, false, false, NULL, '2017-05-08', NULL, NULL, 0, 'default');
INSERT INTO egf_fund (id, name, code, identifier, level, parentid, isparent, active, createdby, createddate, lastmodifiedby, lastmodifieddate, version, tenantid) VALUES (4, 'Earmarked Funds', '04', '4', 1, NULL, false, false, NULL, '2017-05-08', NULL, NULL, 0, 'default');


SELECT setval('seq_egf_fund',(select max(id)+1 from egf_fund));
