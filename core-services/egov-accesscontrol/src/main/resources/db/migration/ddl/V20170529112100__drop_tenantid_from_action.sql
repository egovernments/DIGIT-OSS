ALTER TABLE eg_action DROP CONSTRAINT eg_action_pkey;
ALTER TABLE eg_action ADD CONSTRAINT eg_action_pkey PRIMARY KEY (id);
ALTER TABLE eg_action DROP CONSTRAINT eg_action_name_key_tenantid;
ALTER TABLE eg_action ADD CONSTRAINT eg_action_name_key UNIQUE (name);
ALTER TABLE eg_action DROP CONSTRAINT eg_action_url_queryparams_key_tenantid;
ALTER TABLE eg_action ADD CONSTRAINT eg_action_url_queryparams_key UNIQUE (url, queryparams);

ALTER TABLE eg_action DROP COLUMN tenantid;