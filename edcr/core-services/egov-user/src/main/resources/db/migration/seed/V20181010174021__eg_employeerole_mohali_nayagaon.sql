insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'pb.mohali')
ON CONFLICT (code, tenantid) DO NOTHING;
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'pb.nayagaon')
ON CONFLICT (code, tenantid) DO NOTHING;
