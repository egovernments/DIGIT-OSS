insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Redressal Officer' and tenantid='default'),
(select id from eg_user where username='ravi' and tenantid='default'),
'default',
'default');