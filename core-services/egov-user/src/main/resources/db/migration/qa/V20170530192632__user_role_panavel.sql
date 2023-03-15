insert into eg_userrole (roleid, userid, roleidtenantid, tenantid)
values( (select id from eg_role where name='Service request Creator' and tenantid='panavel'),
(select id from eg_user where username='admin' and tenantid='panavel'),'panavel','panavel');
