update eg_boundary_type set code = 'ADMCITY' where 
name = 'City' and tenantid = 'default' 
and hierarchytype = (select id from eg_hierarchy_type where code = 'ADMIN' and tenantid = 'default');

update eg_boundary 
set parent = (select id from eg_boundary where parent is null and 
boundarytype = (select id from eg_boundary_type where code = 'ADMCITY' and tenantid = 'default'))
where name like '%Election%' and parent is null and tenantid = 'default';


update eg_crosshierarchy ch set parenttype = (select boundarytype from eg_boundary where id = (select parent from eg_crosshierarchy where id = ch.id));
update eg_crosshierarchy ch set childtype = (select boundarytype from eg_boundary where id = (select child from eg_crosshierarchy where id = ch.id));
