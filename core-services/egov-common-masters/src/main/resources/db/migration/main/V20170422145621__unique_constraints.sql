alter table eg_language drop CONSTRAINT uk_eg_language_name;
alter table eg_language add CONSTRAINT eg_language_name_tenat_key UNIQUE (name,tenantid);

alter table eg_community drop CONSTRAINT uk_eg_community_name;
alter table eg_community add CONSTRAINT uk_eg_community_name_tenantid UNIQUE (name,tenantid);

alter table eg_religion drop CONSTRAINT uk_eg_religion_name;
alter table eg_religion add CONSTRAINT uk_eg_religion_name_tenantid UNIQUE (name,tenantid);

alter table eg_category drop CONSTRAINT uk_eg_category_name;
alter table eg_category add CONSTRAINT uk_eg_category_name_tenantid UNIQUE (name,tenantid);
