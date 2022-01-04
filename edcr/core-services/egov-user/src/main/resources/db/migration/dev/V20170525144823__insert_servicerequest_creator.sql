insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Service request Creator' and tenantid='default'),
(select id from eg_user where username='narasappa' and tenantid='default'),
'default',
'default');