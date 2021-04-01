INSERT INTO egf_instrumenttypeproperty(
            id, transactiontype, reconciledoncreate, statusoncreateid, statusonupdateid, 
            statusonreconcileid, instrumenttypeid, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, tenantid, version)
    VALUES ('0ee4059b-e056-4070-90dd-8e52747fe5be', 'Debit', false, 'New', 'Deposited', 'Reconciled'
            , 'Online', '1', now(),1,now(), 'default', 0);

INSERT INTO egf_instrumenttypeproperty(
            id, transactiontype, reconciledoncreate, statusoncreateid, statusonupdateid, 
            statusonreconcileid, instrumenttypeid, createdby, createddate, 
            lastmodifiedby, lastmodifieddate, tenantid, version)
    VALUES ('a4b62acb-0d1b-4bbd-902d-1b5731ec3abd', 'Credit', false, 'New', 'Deposited', 'Reconciled'
            , 'Online', '1', now(),1,now(), 'default', 0);
