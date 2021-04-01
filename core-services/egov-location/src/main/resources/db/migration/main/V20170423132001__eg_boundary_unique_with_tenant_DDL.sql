 alter table eg_crosshierarchy drop constraint eg_crosshierarchy_pkey;
 alter table eg_crosshierarchy drop constraint fk_crossheirarchy_parenttype;
 alter table eg_crosshierarchy drop constraint fk_crossheirarchy_childtype;
 alter table eg_crosshierarchy drop constraint fk_crossheirarchy_parent;
 alter table eg_crosshierarchy drop constraint fk_crossheirarchy_child;
 alter table eg_crosshierarchy drop constraint eg_crosshierarchy_id_tenant_uk;

 alter table eg_crosshierarchy add constraint   eg_crosshierarchy_pkey primary key(id,tenantid);



alter table eg_boundary  drop constraint  parent_bndry_fk;

alter table eg_boundary  drop constraint  bndry_type_fk;
alter table eg_boundary  drop constraint  eg_boundary_name_tenant_uk;

alter table eg_boundary  drop constraint eg_boundary_pkey;

alter table eg_boundary add constraint   eg_boundary_pkey primary key(id,tenantid);


alter table eg_boundary_type drop constraint bndry_type_heirarchy_fk;
alter table eg_boundary_type drop constraint bndry_type_parent;
 alter table eg_boundary_type drop constraint eg_boundarytype_id_tenant_uk;
 alter table eg_boundary_type drop constraint eg_boundary_type_pkey;



 alter table eg_boundary_type add constraint  eg_boundary_type_pkey primary key(id,tenantid);

alter table eg_hierarchy_type   drop constraint eg_heirarchy_type_type_code_key;
alter table eg_hierarchy_type   drop constraint eg_hierarchytype_code_tenant_uk;
alter table eg_hierarchy_type   drop constraint eg_heirarchy_type_type_name_key;
alter table eg_hierarchy_type   add constraint eg_hierarchy_type_name_unique unique(name,tenantid);
alter table eg_hierarchy_type   drop constraint eg_heirarchy_type_pkey;
 
alter table eg_hierarchy_type add constraint  eg_hierarchy_type_pkey primary key (id,tenantid);

 

 

