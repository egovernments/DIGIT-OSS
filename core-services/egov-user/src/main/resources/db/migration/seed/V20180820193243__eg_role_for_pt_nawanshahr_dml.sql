insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Counter Employee','CEMP','Employee at the counter who performs assessment on behalf of citizen',now(),1,1,now(),0,'pb.nawanshahr')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Field Employee','FEMP','Employee on the field',now(),1,1,now(),0,'pb.nawanshahr')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'ULB Administrator','ULBADMIN','Admin role that as access over an ulb',now(),1,1,now(),0,'pb.nawanshahr')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'State Administrator','STADMIN',
'Admin role that as access over a state',now(),1,1,now(),0,'pb.nawanshahr')
ON CONFLICT (code, tenantid) DO NOTHING;