ALTER TABLE eg_role DROP CONSTRAINT eg_roles_role_name_key;

ALTER TABLE eg_role ADD CONSTRAINT eg_roles_code_tenant UNIQUE (code, tenantid);