insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Department Grievance Routing Officer','DGRO','GRO for a sepcific dept who assings the grievances to last mile employees',now(),1,1,now(),0,'pb.amritsar')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Department Grievance Routing Officer','DGRO','GRO for a sepcific dept who assings the grievances to last mile employees',now(),1,1,now(),0,'pb.jalandhar')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Department Grievance Routing Officer','DGRO','GRO for a sepcific dept who assings the grievances to last mile employees',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Department Grievance Routing Officer','DGRO','GRO for a sepcific dept who assings the grievances to last mile employees',now(),1,1,now(),0,'pb.nawanshahr')
ON CONFLICT (code, tenantid) DO NOTHING;