INSERT INTO egf_instrumenttypeproperty(
            id, transactiontype, reconciledoncreate, statusoncreateid, statusonupdateid, 
            statusonreconcileid, instrumenttypeid, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, tenantid, version)
    VALUES ('25e9cd51-e27d-4ece-8ce2-f4da53bb3436', 'Debit', false, 'New', 'Deposited', 'Reconciled'
            , 'Cheque', '1', now(),1,now(), 'default', 0);

INSERT INTO egf_instrumenttypeproperty(
            id, transactiontype, reconciledoncreate, statusoncreateid, statusonupdateid, 
            statusonreconcileid, instrumenttypeid, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, tenantid, version)
    VALUES ('6fc1765c-2e97-4fe6-937a-f7391384b670', 'Credit', false, 'New', 'Deposited', 'Reconciled'
            , 'Cheque', '1', now(),1,now(), 'default', 0);
