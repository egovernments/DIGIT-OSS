CREATE INDEX IF NOT EXISTS index_eg_pt_billingslab_v2_tenantid ON eg_pt_billingslab_v2 (tenantid);

CREATE INDEX IF NOT EXISTS index_eg_pt_billingslab_v2_propertytype ON eg_pt_billingslab_v2 (propertytype);

CREATE INDEX IF NOT EXISTS index_eg_pt_billingslab_v2_propertysubtype ON eg_pt_billingslab_v2 (propertysubtype);

CREATE INDEX IF NOT EXISTS index_eg_pt_billingslab_v2_usagecategorymajor ON eg_pt_billingslab_v2 (usagecategorymajor);

CREATE INDEX IF NOT EXISTS index_eg_pt_billingslab_v2_usagecategoryminor ON eg_pt_billingslab_v2 (usagecategoryminor);

ALTER TABLE eg_pt_mutation_billingslab ADD PRIMARY KEY (id, tenantid);

CREATE INDEX IF NOT EXISTS index_eg_pt_mutation_billingslab_usagecategoryminor ON eg_pt_mutation_billingslab (usagecategoryminor);

CREATE INDEX IF NOT EXISTS index_eg_pt_mutation_billingslab_usagecategorymajor ON eg_pt_mutation_billingslab (usagecategorymajor);

CREATE INDEX IF NOT EXISTS index_eg_pt_mutation_billingslab_tenantid ON eg_pt_mutation_billingslab (tenantid);

CREATE INDEX IF NOT EXISTS index_eg_pt_mutation_billingslab_propertytype ON eg_pt_mutation_billingslab (propertytype);

CREATE INDEX IF NOT EXISTS index_eg_pt_mutation_billingslab_propertysubtype ON eg_pt_mutation_billingslab (propertysubtype);

CREATE INDEX IF NOT EXISTS index_eg_pt_mutation_billingslab_ownershipcategory ON eg_pt_mutation_billingslab (ownershipcategory);

CREATE INDEX IF NOT EXISTS index_eg_pt_mutation_billingslab_subownershipcategory ON eg_pt_mutation_billingslab (subownershipcategory);