ALTER TABLE eg_user DROP CONSTRAINT eg_user_user_name_key;

ALTER TABLE eg_user ADD CONSTRAINT eg_user_user_name_tenant UNIQUE (username, tenantid);