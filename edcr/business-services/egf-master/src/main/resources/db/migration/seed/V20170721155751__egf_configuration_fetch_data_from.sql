INSERT INTO egeis_egfconfiguration(
            id, keyname, description, createdby, createddate, lastmodifiedby, 
            lastmodifieddate, version, tenantid)
    VALUES (NEXTVAL('seq_egeis_egfconfiguration'), 'FETCH_DATA_FROM', 'Data to be fetched from es or db', 1, now(), 1, 
            now(), 0, 'default');


INSERT INTO egeis_egfconfigurationvalues(
            id, keyid, value, effectivefrom, createdby, createddate, lastmodifiedby, 
            lastmodifieddate, version, tenantid)
    VALUES (NEXTVAL('seq_egeis_egfconfigurationvalues'), (select id from egeis_egfconfiguration where keyname='FETCH_DATA_FROM'), 'db', now(), 1, now(), 
            1, now(), 0,'default');
            
--rollback delete from egeis_egfconfigurationvalues where keyid = (select id from egeis_egfconfiguration where keyname='FETCH_DATA_FROM');
--rollback delete from egeis_egfconfiguration where keyname = 'FETCH_DATA_FROM';