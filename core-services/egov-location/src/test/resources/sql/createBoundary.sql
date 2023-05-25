INSERT INTO eg_hierarchy_type (id, name, code, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname,tenantid) 
VALUES (1, 'ADMINISTRATION', 'ADMIN', '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, 0,NULL,'default');

INSERT INTO eg_boundary_type (id, hierarchy, parent, name, hierarchytype, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname, code, tenantid) 
VALUES (1, 1, NULL, 'City', 1, '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, 0, NULL, 'TEST','default');

INSERT INTO eg_boundary (id, boundarynum, parent, name, code,boundarytype, localname, bndry_name_old, bndry_name_old_local, fromdate, todate, bndryid, longitude, latitude, materializedpath, ishistory, createddate, lastmodifieddate, createdby, lastmodifiedby, version,tenantid) 
VALUES (1, 1, NULL, 'Srikakulam  Municipality','TEST', 1, 'Srikakulam  Municipality', NULL, NULL, '2004-04-01 00:00:00', '2099-03-31 00:00:00', NULL, NULL, NULL, '1', false, '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, 0,'default');
