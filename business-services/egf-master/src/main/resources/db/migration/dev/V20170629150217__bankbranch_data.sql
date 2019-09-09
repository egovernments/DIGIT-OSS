INSERT INTO egf_bankbranch (id, bankid, code, name, address, address2, city, state, pincode, phone, fax, contactperson, active, description, micr, createdby, createddate, lastmodifiedby, lastmodifieddate, version, tenantid) VALUES (1, 1, '001', 'Main branch', 'Srikakulam', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'default');

SELECT setval('seq_egf_bankbranch',(select max(id)+1 from egf_bankbranch));
