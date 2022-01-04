CREATE TABLE eg_userrole_v1 AS
select r.code as role_code, ur.roleidtenantid role_tenantid, ur.userid as user_id, ur.tenantid as user_tenantid, ur
.lastmodifieddate as lastmodifieddate
	from eg_userrole ur join eg_role r ON ur.roleid = r.id AND ur.roleidtenantid = r.tenantid ;
ALTER TABLE eg_userrole_v1 ADD CONSTRAINT fk_user_role_v1 FOREIGN KEY (user_id, user_tenantid) REFERENCES eg_user(id, tenantid);