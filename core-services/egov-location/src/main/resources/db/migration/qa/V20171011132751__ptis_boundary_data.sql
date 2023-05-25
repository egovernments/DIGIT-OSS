INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 1, NULL, 'City', (select id from eg_hierarchy_type where code = 'REVENUE_PTIS' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'PTREVCITY','default');
INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 2, NULL, 'City',(select id from eg_hierarchy_type where code = 'LOCATION' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'PTLOCCITY','default');
INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 2, (select id from eg_boundary_type where code ='REVCITY' and tenantid = 'default'),'Circle', (select id from eg_hierarchy_type where code = 'REVENUE_PTIS' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'PTCIRCLE','default');
INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 3, (select id from eg_boundary_type where code ='LOCCITY' and tenantid = 'default'), 'Zone', (select id from eg_hierarchy_type where code = 'REVENUE_PTIS' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'PTZONE','default');
INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 4, (select id from eg_boundary_type where code ='CIRCLE' and tenantid = 'default'),'Ward', (select id from eg_hierarchy_type where code = 'REVENUE_PTIS' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'PTWARD','default');
INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 5, (select id from eg_boundary_type where code ='ZONE' and tenantid = 'default'), 'Block', (select id from eg_hierarchy_type where code = 'REVENUE_PTIS' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'PTBLOCK','default');
INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 2, (select id from eg_boundary_type where code ='BLOCK' and tenantid = 'default'), 'Locality', (select id from eg_hierarchy_type where code = 'LOCATION' and tenantid = 'default'),now(), now(), 1, 1, 0, NULL, 'PTLOCALITY','default');
INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 3, (select id from eg_boundary_type where code ='LOCALITY' and tenantid = 'default'),'Street', (select id from eg_hierarchy_type where code = 'LOCATION' and tenantid = 'default'), now(), now(),1, 1, 0, NULL, 'PTSTREET','default');
INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 1, NULL, 'City', (select id from eg_hierarchy_type where code = 'ADMIN' and tenantid = 'default'), now(), now(),1, 1, 0, NULL, 'ADMCITY','default');



INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, NULL, 'Default  Municipality', (select id from eg_boundary_type where code = 'PTREVCITY' and tenantid = 'default'), 'Default  Municipality', NULL, NULL, '2004-04-01 00:00:00', '2099-03-31 00:00:00', NULL, NULL, NULL, '1', false, now(), now(), 1, 1, 0,'default', 'DM');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, (select id from eg_boundary where parent is null and boundarytype = (select id from eg_boundary_type where code = 'PTREVCITY' and tenantid = 'default')),
 'Zone-1', (select id from eg_boundary_type where code = 'PTZONE' and tenantid = 'default'), 'Zone-1', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.1', false, now(), now(), 1, 1,NULL,'default', 'Z1');
INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 2, (select id from eg_boundary where parent is null and boundarytype = (select id from eg_boundary_type where code = 'PTREVCITY' and tenantid = 'default')),
 'Zone-2', (select id from eg_boundary_type where code = 'PTZONE' and tenantid = 'default'), 'Zone-2', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.2', false, now(), now(), 1, 1,NULL,'default', 'Z2');


INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, NULL, 'Revenue Ward No 1',
	(select id from eg_boundary_type where code = 'PTWARD' and tenantid = 'default'), 'Revenue Ward No 1', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.1.1', false, now(), now(), 1, 1,NULL,'default', 'RW1');
INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 2, NULL, 'Revenue Ward No 2',
	(select id from eg_boundary_type where code = 'PTWARD' and tenantid = 'default'), 'Revenue Ward No 2', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.2.1', false, now(), now(), 1, 1,NULL,'default', 'RW2');
