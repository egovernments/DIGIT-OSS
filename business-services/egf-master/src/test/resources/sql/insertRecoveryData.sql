INSERT INTO egf_recovery(
            id, chartofaccountid, flat, active, remitted, name, code,
            ifsccode, mode, remittancemode, accountnumber,createdby,
            createddate, lastmodifiedby, lastmodifieddate, version, tenantid)
    VALUES ('2374257', '1', 100.00, TRUE , 'test', 'name', 'code',
            'ifsccode', 'M', 'M', '30492234547'
            ,1,now(),null,null,0,'default');