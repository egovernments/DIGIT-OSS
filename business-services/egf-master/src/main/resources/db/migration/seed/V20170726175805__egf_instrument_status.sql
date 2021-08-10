INSERT INTO egf_financialstatus(
            id, moduletype, code, name, description, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, version, tenantid)
    VALUES ('cc6e551b-3a75-4b1e-a9ec-a2293fe03137', 'Instrument', 'New', 'New', 'Status assign when instrument is created', '1', now(), 
            '1', now(), 0, 'default');

INSERT INTO egf_financialstatus(
            id, moduletype, code, name, description, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, version, tenantid)
    VALUES ('a167095b-5a73-4e61-b489-af31f053c4e1', 'Instrument', 'Deposited', 'Deposited', 'Status assign when instrument is deposited to bank', '1', now(), 
            '1', now(), 0, 'default');

INSERT INTO egf_financialstatus(
            id, moduletype, code, name, description, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, version, tenantid)
    VALUES ('b5880534-2bae-47e0-ae00-4820fc46d579', 'Instrument', 'Reconciled', 'Reconciled', 'Status assign when instrument is reconciled', '1', now(), 
            '1', now(), 0, 'default');

INSERT INTO egf_financialstatus(
            id, moduletype, code, name, description, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, version, tenantid)
    VALUES ('b69493dc-c3ab-4927-973a-600c352a2afa', 'Instrument', 'Dishonored', 'Dishonored', 'Status assign when instrument is Dishonored', '1', now(), 
            '1', now(), 0, 'default');

INSERT INTO egf_financialstatus(
            id, moduletype, code, name, description, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, version, tenantid)
    VALUES ('2d8a0047-a77f-43cd-bed7-700459bc24a9', 'Instrument', 'Surrendered', 'Surrendered', 'Status assign when instrument is given back', '1', now(), 
            '1', now(), 0, 'default');         