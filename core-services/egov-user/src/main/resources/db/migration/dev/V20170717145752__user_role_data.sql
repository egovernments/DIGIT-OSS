delete from eg_userrole where userid = (select id from eg_user where username = 'narasappa') and
tenantid = 'default' and roleidtenantid = 'default';

delete from eg_userrole where userid = (select id from eg_user where username = 'ramana') and
tenantid = 'default' and roleidtenantid = 'default';

insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Employee' and tenantid='default'),
(select id from eg_user where username='narasappa' and tenantid='default'),
'default','default');

insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Redressal Officer' and tenantid='default'),
(select id from eg_user where username='narasappa' and tenantid='default'),
'default','default');

insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Service request Creator' and tenantid='default'),
(select id from eg_user where username='narasappa' and tenantid='default'),
'default','default');

insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Grievance Officer' and tenantid='default'),
(select id from eg_user where username='narasappa' and tenantid='default'),
'default','default');

insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Grivance Administrator' and tenantid='default'),
(select id from eg_user where username='narasappa' and tenantid='default'),
'default','default');

insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Employee' and tenantid='default'),
(select id from eg_user where username='ramana' and tenantid='default'),
'default','default');

insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Redressal Officer' and tenantid='default'),
(select id from eg_user where username='ramana' and tenantid='default'),
'default','default');