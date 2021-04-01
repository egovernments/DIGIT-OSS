Alter Sequence SEQ_EG_SERVICECATEGORY rename to SEQ_EG_BUSINESSCATEGORY;
Alter table eg_servicecategory rename to eg_businesscategory;
Alter table eg_businesscategory drop constraint uk_eg_servicecategory_idtenant;
Alter table eg_businesscategory drop constraint uk_eg_servicecategory_codetenant;
Alter table eg_businesscategory add constraint uk_eg_businesscategory_nametenant UNIQUE(name,tenantid);
Alter table eg_businesscategory add constraint uk_eg_businesscategory_codetenant UNIQUE(code,tenantid);
Alter table eg_businesscategory alter column id TYPE bigint;
ALTER table eg_businesscategory alter column id SET NOT NULL;