INSERT INTO tenant (id, code, name, description, domainurl, logoid, imageid, type, createdby, createddate, lastmodifiedby, lastmodifieddate)
VALUES (nextval('seq_tenant'), 'AP.KURNOOL', 'kurnool', 'description', 'http://egov.ap.gov.in/kurnool', 'd45d7118-2013-11e7-93ae-92361f002671', '8716872c-cd50-4fbb-a0d6-722e6bc9c143', 'CITY', 1, '1990-07-23 00:00:00.0', 0, '1990-07-23 00:00:00.0');

INSERT INTO tenant (id, code, name, description, domainurl, logoid, imageid, type)
VALUES (nextval('seq_tenant'), 'AP.GUNTOOR', 'guntoor', 'description', 'http://egov.ap.gov.in/guntoor', 'd45d7118-2013-11e7-93ae-92361f002671', '8716872c-cd50-4fbb-a0d6-722e6bc9c143', 'CITY');