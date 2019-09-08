insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen','CITIZEN','Citizen who can raise complaint',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grievance Routing Officer','GRO','Grievance Routing Officer',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen Service Representative','CSR',
'Employee who files and follows up complaints on behalf of the citizen',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'PGR Administrator','PGR-ADMIN','Admin role that has super access over the system',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Super User','SUPERUSER','System Administrator. Can change all master data and has access to all the system screens.',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;
