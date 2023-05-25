-----------------------ADMINISTARATION_TL-----------------------
INSERT INTO eg_hierarchy_type (id, name, code, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname,tenantid) 
VALUES (nextval('seq_eg_hierarchy_type'), 'ADMINISTRATION_TL', 'ADMINISTRATION_TL', now(), now(), 1, 1, 0,NULL,'default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 1, NULL, 'City', (select id from eg_hierarchy_type where code = 'ADMINISTRATION_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLADMNCITY','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 2, (select id from eg_boundary_type where code ='TLADMNCITY' and tenantid = 'default'), 'Zone', (select id from eg_hierarchy_type where code = 'ADMINISTRATION_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLADMINZONE','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 3, (select id from eg_boundary_type where code ='TLADMINZONE' and tenantid = 'default'),'Ward', (select id from eg_hierarchy_type where code = 'ADMINISTRATION_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLADMINWARD','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 4, (select id from eg_boundary_type where code ='TLADMINWARD' and tenantid = 'default'), 'Block', (select id from eg_hierarchy_type where code = 'ADMINISTRATION_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLADMINBLOCK','default');


INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, NULL, 'Default  Municipality', (select id from eg_boundary_type where code = 'TLADMNCITY' and tenantid = 'default'), 'Default  Municipality', NULL, NULL, '2004-04-01 00:00:00', '2099-03-31 00:00:00', NULL, NULL, NULL, '1', false, now(), now(), 1, 1, 0,'default', 'TLADMINDM');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, (select id from eg_boundary where parent is null and boundarytype = (select id from eg_boundary_type where code = 'TLADMNCITY' and tenantid = 'default')),
 'Zone-1', (select id from eg_boundary_type where code = 'TLADMINZONE' and tenantid = 'default'), 'Zone-1', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.1', false, now(), now(), 1, 1,NULL,'default', 'TLADMINZ1');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 2, (select id from eg_boundary where parent is null and boundarytype = (select id from eg_boundary_type where code = 'TLADMNCITY' and tenantid = 'default')),
 'Zone-2', (select id from eg_boundary_type where code = 'TLADMINZONE' and tenantid = 'default'), 'Zone-2', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.2', false, now(), now(), 1, 1,NULL,'default', 'TLADMINZ2');


INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, (select id from eg_boundary where boundarytype = (select id from eg_boundary_type where code = 'TLADMINZONE' and tenantid = 'default') and code='TLADMINZ1' and tenantid='default'), 'Admin Ward No 1',
    (select id from eg_boundary_type where code = 'TLADMINWARD' and tenantid = 'default'), 'Admin Ward No 1', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.1.1', false, now(), now(), 1, 1,NULL,'default', 'TLADMINRW1');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 2, (select id from eg_boundary where boundarytype = (select id from eg_boundary_type where code = 'TLADMINZONE' and tenantid = 'default') and code='TLADMINZ2' and tenantid='default'), 'Admin Ward No 2',
    (select id from eg_boundary_type where code = 'TLADMINWARD' and tenantid = 'default'), 'Admin Ward No 2', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.2.1', false, now(), now(), 1, 1,NULL,'default', 'TLADMINRW2');
    

-----------------------LOCATION_TL-----------------------   
INSERT INTO eg_hierarchy_type (id, name, code, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname,tenantid) 
VALUES (nextval('seq_eg_hierarchy_type'), 'LOCATION_TL', 'LOCATION_TL', now(), now(), 1, 1, 0,NULL,'default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 1, NULL, 'City', (select id from eg_hierarchy_type where code = 'LOCATION_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLLOCCITY','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 2, (select id from eg_boundary_type where code ='TLLOCCITY' and tenantid = 'default'), 'Zone', (select id from eg_hierarchy_type where code = 'LOCATION_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLLOCZONE','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 3, (select id from eg_boundary_type where code ='TLLOCZONE' and tenantid = 'default'),'Ward', (select id from eg_hierarchy_type where code = 'LOCATION_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLLOCWARD','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 4, (select id from eg_boundary_type where code ='TLLOCWARD' and tenantid = 'default'), 'Block', (select id from eg_hierarchy_type where code = 'LOCATION_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLLOCBLOCK','default');


INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, NULL, 'Default  Municipality', (select id from eg_boundary_type where code = 'TLLOCCITY' and tenantid = 'default'), 'Default  Municipality', NULL, NULL, '2004-04-01 00:00:00', '2099-03-31 00:00:00', NULL, NULL, NULL, '1', false, now(), now(), 1, 1, 0,'default', 'TLLOCDM');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, (select id from eg_boundary where parent is null and boundarytype = (select id from eg_boundary_type where code = 'TLLOCCITY' and tenantid = 'default')),
 'Zone-1', (select id from eg_boundary_type where code = 'TLLOCZONE' and tenantid = 'default'), 'Zone-1', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.1', false, now(), now(), 1, 1,NULL,'default', 'TLLOCZ1');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 2, (select id from eg_boundary where parent is null and boundarytype = (select id from eg_boundary_type where code = 'TLLOCCITY' and tenantid = 'default')),
 'Zone-2', (select id from eg_boundary_type where code = 'TLLOCZONE' and tenantid = 'default'), 'Zone-2', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.2', false, now(), now(), 1, 1,NULL,'default', 'TLLOCZ2');


INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, (select id from eg_boundary where boundarytype = (select id from eg_boundary_type where code = 'TLLOCZONE' and tenantid = 'default') and code='TLLOCZ1' and tenantid='default'), 'Location Ward No 1',
    (select id from eg_boundary_type where code = 'TLLOCWARD' and tenantid = 'default'), 'Location Ward No 1', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.1.1', false, now(), now(), 1, 1,NULL,'default', 'TLLOCW1');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 2, (select id from eg_boundary where boundarytype = (select id from eg_boundary_type where code = 'TLLOCZONE' and tenantid = 'default') and code='TLLOCZ2' and tenantid='default'), 'Location Ward No 2',
    (select id from eg_boundary_type where code = 'TLLOCWARD' and tenantid = 'default'), 'Location Ward No 2', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.2.1', false, now(), now(), 1, 1,NULL,'default', 'TLLOCW2');
    
    
-----------------------REVENUE_TL----------------------- 
INSERT INTO eg_hierarchy_type (id, name, code, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname,tenantid) 
VALUES (nextval('seq_eg_hierarchy_type'), 'REVENUE_TL', 'REVENUE_TL', now(), now(), 1, 1, 0,NULL,'default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 1, NULL, 'City', (select id from eg_hierarchy_type where code = 'REVENUE_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLREVCITY','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 2, (select id from eg_boundary_type where code ='TLREVCITY' and tenantid = 'default'), 'Zone', (select id from eg_hierarchy_type where code = 'REVENUE_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLREVZONE','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 3, (select id from eg_boundary_type where code ='TLREVZONE' and tenantid = 'default'),'Ward', (select id from eg_hierarchy_type where code = 'REVENUE_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLREVWARD','default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (nextval('seq_eg_boundary_type'), 4, (select id from eg_boundary_type where code ='TLREVWARD' and tenantid = 'default'), 'Block', (select id from eg_hierarchy_type where code = 'REVENUE_TL' and tenantid = 'default'), now(), now(), 1, 1, 0, NULL, 'TLREVBLOCK','default');


INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, NULL, 'Default  Municipality', (select id from eg_boundary_type where code = 'TLREVCITY' and tenantid = 'default'), 'Default  Municipality', NULL, NULL, '2004-04-01 00:00:00', '2099-03-31 00:00:00', NULL, NULL, NULL, '1', false, now(), now(), 1, 1, 0,'default', 'TLREVDM');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, (select id from eg_boundary where parent is null and boundarytype = (select id from eg_boundary_type where code = 'TLREVCITY' and tenantid = 'default')),
 'Zone-1', (select id from eg_boundary_type where code = 'TLREVZONE' and tenantid = 'default'), 'Zone-1', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.1', false, now(), now(), 1, 1,NULL,'default', 'Z1TLREV');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 2, (select id from eg_boundary where parent is null and boundarytype = (select id from eg_boundary_type where code = 'TLREVCITY' and tenantid = 'default')),
 'Zone-2', (select id from eg_boundary_type where code = 'TLREVZONE' and tenantid = 'default'), 'Zone-2', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.2', false, now(), now(), 1, 1,NULL,'default', 'Z2TLREV');


INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 1, (select id from eg_boundary where code = 'Z1TLREV' and tenantid = 'default'), 'Revenue Ward No 1', (select id from eg_boundary_type where code = 'TLREVWARD' and tenantid = 'default'), 'Revenue Ward No 1', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.1.1', false, now(), now(), 1, 1,NULL,'default', 'RW1TLREV');

INSERT INTO eg_boundary (id, boundarynum, parent, name, boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid, code)
VALUES (nextval('seq_eg_boundary'), 2, (select id from eg_boundary where code = 'Z2TLREV' and tenantid = 'default'), 'Revenue Ward No 2', (select id from eg_boundary_type where code = 'TLREVWARD' and tenantid = 'default'), 'Revenue Ward No 2', NULL, NULL, '2004-04-01 00:00:00', '2099-04-01 00:00:00', NULL, NULL, NULL, '1.2.1', false, now(), now(), 1, 1,NULL,'default', 'RW2TLREV');