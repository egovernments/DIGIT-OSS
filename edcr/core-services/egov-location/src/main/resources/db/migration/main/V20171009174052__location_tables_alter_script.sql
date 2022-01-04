update eg_boundary set code = id; 

update eg_boundary_type set code = id;

ALTER TABLE eg_boundary
   ALTER COLUMN code SET NOT NULL;

ALTER TABLE eg_boundary DROP CONSTRAINT eg_boundary_pkey;
ALTER TABLE eg_boundary Add CONSTRAINT eg_boundary_pkey PRIMARY KEY (code, tenantid);

ALTER TABLE eg_boundary DROP CONSTRAINT bndrynumtype_ukey ;
ALTER TABLE eg_boundary Add CONSTRAINT bndrynumtype_ukey UNIQUE (code, boundarytype,tenantid);

ALTER TABLE eg_boundary_type
   ALTER COLUMN code SET NOT NULL;

ALTER TABLE eg_boundary_type DROP CONSTRAINT eg_boundary_type_pkey;
ALTER TABLE eg_boundary_type Add CONSTRAINT eg_boundary_type_pkey PRIMARY KEY (code, tenantid);


ALTER TABLE eg_hierarchy_type DROP CONSTRAINT eg_hierarchy_type_pkey;
ALTER TABLE eg_hierarchy_type Add CONSTRAINT eg_hierarchy_type_pkey PRIMARY KEY (code, tenantid);