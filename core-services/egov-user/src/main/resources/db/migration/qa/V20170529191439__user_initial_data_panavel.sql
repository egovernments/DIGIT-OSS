INSERT INTO eg_user (id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate, lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation,signature, bloodgroup, photo, identificationmark ,tenantid)
VALUES (nextval('seq_eg_user'), NULL, 'MR.', NULL, 'en_IN', 'admin', '$2a$10$uheIOutTnD33x7CDqac1zOL8DMiuz7mWplToPgcf7oxAI9OzRKxmK', '2099-01-01 00:00:00', '1234567890', NULL, NULL, '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, true, 'admin', NULL, NULL, NULL, 'EMPLOYEE', 0, NULL, NULL, NULL, 'AB_POSITIVE', NULL,'identification mark','panavel');
INSERT INTO eg_user (id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate, lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation,signature, bloodgroup, photo, identificationmark ,tenantid)
VALUES (nextval('seq_eg_user'), NULL, NULL, NULL, 'en_IN', 'sanjeev', '$2a$10$uheIOutTnD33x7CDqac1zOL8DMiuz7mWplToPgcf7oxAI9OzRKxmK', '2099-01-01 00:00:00', '1234567890', NULL, NULL, '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, true, 'sanjeev', NULL, NULL, NULL, 'EMPLOYEE', 0, NULL, NULL, NULL, 'AB_POSITIVE', NULL,'identification mark','panavel');
INSERT INTO eg_user (id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate, lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation, signature, bloodgroup,accountlocked,photo,identificationmark, tenantid)
VALUES (nextval('seq_eg_user'), NULL, 'MR.', NULL, 'en_IN', 'ajay', '$2a$10$/pAdOFmv9h7jrnm2zkEQjOKnWO9/xt8T0t.gkT7rb7t4ugz7QUEPi', '2017-03-10 10:32:17.627', '0123456789', NULL, NULL, '2016-12-10 08:32:45.545', '2016-12-10 10:32:17.629', 1, 73, true, 'ajay', 1, NULL, NULL, 'EMPLOYEE', 0, NULL, NULL, NULL, 'AB_POSITIVE', NULL,NULL,'identification mark','panavel');


insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen','CITIZEN','Citizen who can raise complaint',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Super User','SUPERUSER','System Administrator. Can change all master data and has access to all the system screens.',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grievance Officer','GO','Heads the grivance cell. Also all complaints that cannot be routed based on the rules are routed to Grievance Officer.',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Redressal Officer','RO','Employees that address citizens grievances.',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grivance Administrator','GA','System Administator for PGR. Can change PGR Master data only.',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grievance Routing Officer','GRO','Grievance Routing Officer',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Service request Creator','SRC','Service request Creator',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Service request administrator','SRA','Service request administrator',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Service request status update','SRSU','Service request status update',now(),1,1,now(),0,'panavel');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Service request Report viewer','SRV','Service request Report viewer',now(),1,1,now(),0,'panavel');


insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Employee' and tenantid='panavel'),
(select id from eg_user where username='admin' and tenantid='panavel'),'panavel','panavel');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Employee' and tenantid='panavel'),
(select id from eg_user where username='ajay' and tenantid='panavel'),'panavel','panavel');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values((select id from eg_role where name='Citizen' and tenantid='panavel'),
(select id from eg_user where username='sanjeev' and tenantid='panavel'),'panavel','panavel');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid) 
values((select id from eg_role where name='Grievance Routing Officer' and tenantid='panavel'),
(select id from eg_user where username='ajay' and tenantid='panavel'),'panavel','panavel');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Redressal Officer' and tenantid='panavel'),
(select id from eg_user where username='admin' and tenantid='panavel'),'panavel','panavel');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Service request Creator' and tenantid='panavel'),
(select id from eg_user where username='ajay' and tenantid='panavel'),'panavel','panavel');