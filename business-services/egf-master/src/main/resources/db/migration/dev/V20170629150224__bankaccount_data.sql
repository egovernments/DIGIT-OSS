INSERT INTO egf_bankaccount (id, branchid, glcodeid, fundid, accountnumber, accounttype, description, active, payto, type, createdby, createddate, lastmodifiedby, lastmodifieddate, version, tenantid) VALUES (1, 1, 1223, 1, '000000000001', 'OTHER SCHEDULED BANKS', NULL, true, NULL, 'RECEIPTS_PAYMENTS', 1, '2017-05-08 00:00:00', 1, '2017-05-08 00:00:00', 0, 'default');


SELECT setval('seq_egf_bankaccount',(select max(id)+1 from egf_bankaccount));
