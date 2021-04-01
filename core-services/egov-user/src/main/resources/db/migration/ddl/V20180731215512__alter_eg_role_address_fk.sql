ALTER TABLE eg_user DROP CONSTRAINT eg_user_user_name_tenant;
ALTER TABLE eg_user ADD CONSTRAINT eg_user_user_name_tenant UNIQUE (username, type, tenantid);

ALTER TABLE eg_userrole DROP CONSTRAINT eg_userrole_userid_fkey;
ALTER TABLE eg_user_address DROP CONSTRAINT eg_user_address_user_fkey;

ALTER TABLE eg_userrole ADD CONSTRAINT eg_userrole_userid_fkey FOREIGN KEY (userid, tenantid) REFERENCES eg_user (id, tenantid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE eg_user_address ADD CONSTRAINT eg_user_address_user_fkey FOREIGN KEY (userid, tenantid) REFERENCES eg_user (id, tenantid) ON UPDATE CASCADE ON DELETE CASCADE;