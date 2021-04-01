DELETE from eg_userrole  where userid in(select id from eg_user where username='ramana');

DELETE from eg_user where username='ramana';

INSERT INTO eg_user (id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate, lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation, signature, bloodgroup,accountlocked,photo,identificationmark, tenantid)
VALUES (nextval('seq_eg_user'), NULL, 'MR.', NULL, 'en_IN', 'ramana', '$2a$10$/pAdOFmv9h7jrnm2zkEQjOKnWO9/xt8T0t.gkT7rb7t4ugz7QUEPi', '2017-03-10 10:32:17.627', '0123456789', NULL, NULL, '2016-12-10 08:32:45.545', '2016-12-10 10:32:17.629', 1, 73, true, 'Ramana', 1, NULL, NULL, 'EMPLOYEE', 0, NULL, NULL, NULL, 'AB_POSITIVE', NULL,NULL,'identification mark','ap.public');

insert into eg_userrole values((select id from eg_role where name='Employee'),(select id from eg_user where username='ramana'));
