insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Super User','SUPERUSER','System Administrator. Can change all master data and has access to all the system screens.',now(),1,1,now(),0,'pb.jalandhar')
ON CONFLICT (code, tenantid) DO NOTHING;

