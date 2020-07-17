INSERT INTO state.eg_user
    (id,tenantid, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber,
altcontactnumber, emailid, createddate, lastmodifieddate, createdby, lastmodifiedby, active, name, gender,
pan, aadhaarnumber, type, version, guardian, guardianrelation,accountlocked)
select nextval('state.seq_eg_user'), current_schema(),NULL, 'MR.', NULL, 'en_IN', 'system', 'NONE', '2010-01-01 00:00:00', NULL, NULL,
NULL, '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, true, 'System', NULL, NULL, NULL, 'SYSTEM', 0, NULL, NULL,false
where Not exists(SELECT username FROM state.eg_user WHERE username='system' and tenantid=current_schema() );
