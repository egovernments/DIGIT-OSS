insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Employee' and tenantid='default'),
(select id from eg_user where username='narasappa' and tenantid='default'),
'default',
'default');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Employee' and tenantid='default'),
(select id from eg_user where username='manas' and tenantid='default'),
'default',
'default');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values((select id from eg_role where name='Employee' and tenantid='default'),
(select id from eg_user where username='ramana' and tenantid='default'),
'default',
'default');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values((select id from eg_role where name='Citizen' and tenantid='default'),
(select id from eg_user where username='9999999999' and tenantid='default'),
'default',
'default');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid) values
((select id from eg_role where name='Employee' and tenantid='default'),
(select id from eg_user where username='ravi' and tenantid='default'),
'default',
'default');
insert into eg_userrole (roleid, userid, roleidtenantid, tenantid) values(
(select id from eg_role where name='Grievance Routing Officer' and tenantid='default'),
(select id from eg_user where username='ravi' and tenantid='default'),
'default',
'default');
