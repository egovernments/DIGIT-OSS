 -- password is siwater123@
INSERT INTO eg_user (
id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate,
lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation,
signature, bloodgroup, photo, identificationmark,tenantid)
VALUES (
nextval('seq_eg_user'), 'title', null, '1990-07-23 00:00:00', 'en_IN', 'SIWATER', '$2a$10$4e79gVHpe4zZHC6Xy/bWouZOVQaqwgrW5U6IdrhNVBmkbgXfBo8lm',
'2025-12-31 00:00:00', null, null, null, '2018-09-01 00:00:00', '2018-09-01 00:00:00', 1, 1, true,
'SYS INTG WATER', 2, null, null, 'SYSTEM', 0, 'Guardian name', 'Father',
null, 'A_POSITIVE', null, 'identificationmark','pb.mohali');
 -- password is sifinance123@
INSERT INTO eg_user (
id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate,
lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation,
signature, bloodgroup, photo, identificationmark,tenantid)
VALUES (
nextval('seq_eg_user'), 'title', null, '1990-07-23 00:00:00', 'en_IN', 'SIFINANCE', '$2a$10$ehRKHzRqr0i8gQf4g8nQWOUhXAFNr43cdQLU/t48jcHkcKZEihM5y',
'2025-12-31 00:00:00', null, null, null, '2018-09-01 00:00:00', '2018-09-01 00:00:00', 1, 1, true,
'SYS INTG FINANCE', 2, null, null, 'SYSTEM', 0, 'Guardian name', 'Father',
null, 'A_POSITIVE', null, 'identificationmark','pb.mohali');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'System Integrator Finance','SYS_INTEGRATOR_FINANCE','Role for allowing system integration of Finance app with rainmaker',now(),1,1,now(),0,'pb.mohali');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'System Integrator W&S','SYS_INTEGRATOR_WATER_SEW','Role for allowing system integration of Water and Sewerage app with rainmaker',now(),1,1,now(),0,'pb.mohali');

insert into eg_userrole (roleid,roleidtenantid,userid,tenantid,lastmodifieddate) values((select id from eg_role where code='SYS_INTEGRATOR_WATER_SEW' and tenantid='pb.mohali'),'pb.mohali',(select id from eg_user where username='SIWATER' and tenantid='pb.mohali'),'pb.mohali','2018-09-01 00:00:00');

insert into eg_userrole (roleid,roleidtenantid,userid,tenantid,lastmodifieddate) values((select id from eg_role where code='SYS_INTEGRATOR_FINANCE' and tenantid='pb.mohali'),'pb.mohali',(select id from eg_user where username='SIFINANCE' and tenantid='pb.mohali'),'pb.mohali','2018-09-01 00:00:00');

---------------------------------------------------
 -- password is siwater123@
INSERT INTO eg_user (
id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate,
lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation,
signature, bloodgroup, photo, identificationmark,tenantid)
VALUES (
nextval('seq_eg_user'), 'title', null, '1990-07-23 00:00:00', 'en_IN', 'SIWATER', '$2a$10$4e79gVHpe4zZHC6Xy/bWouZOVQaqwgrW5U6IdrhNVBmkbgXfBo8lm',
'2025-12-31 00:00:00', null, null, null, '2018-09-01 00:00:00', '2018-09-01 00:00:00', 1, 1, true,
'SYS INTG WATER', 2, null, null, 'SYSTEM', 0, 'Guardian name', 'Father',
null, 'A_POSITIVE', null, 'identificationmark','pb.nayagaon');
 -- password is sifinance123@
INSERT INTO eg_user (
id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate,
lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation,
signature, bloodgroup, photo, identificationmark,tenantid)
VALUES (
nextval('seq_eg_user'), 'title', null, '1990-07-23 00:00:00', 'en_IN', 'SIFINANCE', '$2a$10$ehRKHzRqr0i8gQf4g8nQWOUhXAFNr43cdQLU/t48jcHkcKZEihM5y',
'2025-12-31 00:00:00', null, null, null, '2018-09-01 00:00:00', '2018-09-01 00:00:00', 1, 1, true,
'SYS INTG FINANCE', 2, null, null, 'SYSTEM', 0, 'Guardian name', 'Father',
null, 'A_POSITIVE', null, 'identificationmark','pb.nayagaon');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'System Integrator Finance','SYS_INTEGRATOR_FINANCE','Role for allowing system integration of Finance app with rainmaker',now(),1,1,now(),0,'pb.nayagaon');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'System Integrator W&S','SYS_INTEGRATOR_WATER_SEW','Role for allowing system integration of Water and Sewerage app with rainmaker',now(),1,1,now(),0,'pb.nayagaon');

insert into eg_userrole (roleid,roleidtenantid,userid,tenantid,lastmodifieddate) values((select id from eg_role where code='SYS_INTEGRATOR_WATER_SEW' and tenantid='pb.nayagaon'),'pb.nayagaon',(select id from eg_user where username='SIWATER' and tenantid='pb.nayagaon'),'pb.nayagaon','2018-09-01 00:00:00');

insert into eg_userrole (roleid,roleidtenantid,userid,tenantid,lastmodifieddate) values((select id from eg_role where code='SYS_INTEGRATOR_FINANCE' and tenantid='pb.nayagaon'),'pb.nayagaon',(select id from eg_user where username='SIFINANCE' and tenantid='pb.nayagaon'),'pb.nayagaon','2018-09-01 00:00:00');

