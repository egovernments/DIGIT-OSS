CREATE TABLE eg_hierarchy_type
(
  id bigint NOT NULL,
  name character varying(128) NOT NULL,
  code character varying(50) NOT NULL,
  createddate timestamp ,
  lastmodifieddate timestamp ,
  createdby bigint,
  lastmodifiedby bigint,
  version bigint,
  tenantid character varying(256) not null,
  localname character varying(256),
  CONSTRAINT eg_heirarchy_type_pkey PRIMARY KEY (id),
  CONSTRAINT eg_heirarchy_type_type_code_key UNIQUE (code),
  CONSTRAINT eg_heirarchy_type_type_name_key UNIQUE (name),
  constraint eg_hierarchytype_code_tenant_uk unique (code, tenantid)
);
CREATE SEQUENCE seq_eg_hierarchy_type
    START WITH 5
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE eg_boundary_type
(
  id bigint NOT NULL,
  hierarchy bigint NOT NULL,
  parent bigint,
  name character varying(64) NOT NULL,
  hierarchytype bigint NOT NULL,
  createddate timestamp ,
  lastmodifieddate timestamp ,
  createdby bigint,
  lastmodifiedby bigint,
  version bigint,
  localname character varying(64),
  code character varying (22),
  tenantid character varying(256) not null,
  CONSTRAINT eg_boundary_type_pkey PRIMARY KEY (id),
  CONSTRAINT bndry_type_heirarchy_fk FOREIGN KEY (hierarchytype)
      REFERENCES eg_hierarchy_type (id),
  CONSTRAINT bndry_type_parent FOREIGN KEY (parent)
      REFERENCES eg_boundary_type (id),
  constraint eg_boundarytype_id_tenant_uk unique (id,tenantid)
    
);

CREATE SEQUENCE seq_eg_boundary_type
    START WITH 11
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE eg_boundary
(
  id bigint NOT NULL,
  boundarynum bigint,
  parent bigint,
  name character varying(512) NOT NULL,
  boundarytype bigint NOT NULL,
  localname character varying(256),
  bndry_name_old character varying(256),
  bndry_name_old_local character varying(256),
  fromdate timestamp ,
  todate timestamp ,
  bndryid bigint,
  longitude double precision,
  latitude double precision,
  materializedpath character varying(32),
  ishistory boolean,
  createddate timestamp ,
  lastmodifieddate timestamp ,
  createdby bigint,
  lastmodifiedby bigint,
  version bigint,
  tenantid character varying(256) not null,
  code character varying(22),
  CONSTRAINT eg_boundary_pkey PRIMARY KEY (id),
  CONSTRAINT bndry_type_fk FOREIGN KEY (boundarytype)
      REFERENCES eg_boundary_type (id),
  CONSTRAINT parent_bndry_fk FOREIGN KEY (parent)
      REFERENCES eg_boundary (id),
  constraint eg_boundary_name_tenant_uk unique (id,tenantid)

);

CREATE SEQUENCE seq_eg_boundary
    START WITH 300
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

------------------START------------------
CREATE TABLE eg_crosshierarchy (
    id bigint NOT NULL,
    parent bigint NOT NULL,
    child bigint NOT NULL,
    parenttype bigint,
    childtype bigint,
    version bigint default 0,
    tenantid character varying(256) not null,
    code  character varying(100),
    createddate timestamp,
    lastmodifieddate timestamp,
    createdby bigint,
    lastmodifiedby bigint
);

CREATE SEQUENCE seq_eg_crosshierarchy
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE eg_crosshierarchy ADD CONSTRAINT eg_crosshierarchy_pkey PRIMARY KEY (id);
alter table eg_crosshierarchy add constraint fk_crossheirarchy_parenttype foreign key (parenttype) references eg_boundary_type (id);
alter table eg_crosshierarchy add constraint fk_crossheirarchy_childtype foreign key (childtype) references eg_boundary_type (id);
alter table eg_crosshierarchy add constraint fk_crossheirarchy_parent foreign key (parent) references eg_boundary (id);
alter table eg_crosshierarchy add constraint fk_crossheirarchy_child foreign key (child) references eg_boundary (id);
alter table eg_crosshierarchy add constraint eg_crosshierarchy_id_tenant_uk unique (id,tenantid);
-------------------END-------------------