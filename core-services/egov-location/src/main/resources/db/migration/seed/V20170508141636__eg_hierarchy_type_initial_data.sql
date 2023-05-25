DELETE FROM eg_hierarchy_type where name = 'ADMINISTRATION' and tenantId = 'default';
DELETE FROM eg_hierarchy_type where name = 'LOCATION' and tenantId = 'default';
DELETE FROM eg_hierarchy_type where name = 'ELECTION' and tenantId = 'default';
DELETE FROM eg_hierarchy_type where name = 'REVENUE' and tenantId = 'default';

INSERT INTO eg_hierarchy_type (id, name, code, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname,tenantid) VALUES (1, 'REVENUE', 'REVENUE', '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, 0,NULL,'default');
INSERT INTO eg_hierarchy_type (id, name, code, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname,tenantid) VALUES (2, 'LOCATION', 'LOCATION', '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, 0,NULL,'default');
INSERT INTO eg_hierarchy_type (id, name, code, createddate, lastmodifieddate, createdby, lastmodifiedby, version, localname,tenantid) VALUES (3, 'ADMINISTRATION', 'ADMIN', '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, 0,NULL,'default');
