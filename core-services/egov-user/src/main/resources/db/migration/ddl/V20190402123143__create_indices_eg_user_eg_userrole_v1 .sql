CREATE INDEX IF NOT EXISTS idx_eg_user_tenantid ON eg_user(tenantid);
CREATE INDEX IF NOT EXISTS idx_eg_user_address_tenantid ON eg_user_address(tenantid);
CREATE INDEX IF NOT EXISTS idx_eg_userrole_v1_rolecode ON eg_userrole_v1(role_code);
CREATE INDEX IF NOT EXISTS idx_eg_userrole_v1_roletenantid ON eg_userrole_v1(role_tenantid);
CREATE INDEX IF NOT EXISTS idx_eg_userrole_v1_userid ON eg_userrole_v1(user_id);
CREATE INDEX IF NOT EXISTS idx_eg_userrole_v1_usertenantid ON eg_userrole_v1(user_tenantid);