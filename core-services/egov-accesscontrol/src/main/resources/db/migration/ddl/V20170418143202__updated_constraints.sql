ALTER TABLE service DROP CONSTRAINT eg_service_pkey;
ALTER TABLE service ADD CONSTRAINT eg_service_pkey PRIMARY KEY (id, tenantid);
ALTER TABLE service DROP CONSTRAINT eg_service_ukey;
ALTER TABLE service ADD CONSTRAINT eg_service_ukey_tenantid UNIQUE (name, tenantid);
  
ALTER TABLE eg_action DROP CONSTRAINT eg_action_pkey;
ALTER TABLE eg_action ADD CONSTRAINT eg_action_pkey PRIMARY KEY (id, tenantid);
ALTER TABLE eg_action DROP CONSTRAINT eg_action_name_key;
ALTER TABLE eg_action ADD CONSTRAINT eg_action_name_key_tenantid UNIQUE (name,tenantid);
ALTER TABLE eg_action DROP CONSTRAINT eg_action_url_queryparams_key;
ALTER TABLE eg_action ADD CONSTRAINT eg_action_url_queryparams_key_tenantid UNIQUE (url, queryparams,tenantid);

ALTER TABLE eg_roleaction DROP CONSTRAINT eg_roleaction_ukey;
ALTER TABLE eg_roleaction ADD CONSTRAINT eg_roleaction_ukey_tenantid PRIMARY KEY (rolecode, actionid, tenantid);
