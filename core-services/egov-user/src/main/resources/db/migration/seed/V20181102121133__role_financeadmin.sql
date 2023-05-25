insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Admin','EGF_ADMINISTRATOR','One who is the administrator for all master data in Finance',now(),1,1,now(),0,'pb.mohali')  ON CONFLICT(code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Admin','EGF_ADMINISTRATOR','One who is the administrator for all master data in Finance',now(),1,1,now(),0,'pb.jalandhar')  ON CONFLICT(code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Admin','EGF_ADMINISTRATOR','One who is the administrator for all master data in Finance',now(),1,1,now(),0,'pb.amritsar')  ON CONFLICT(code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Admin','EGF_ADMINISTRATOR','One who is the administrator for all master data in Finance',now(),1,1,now(),0,'pb.kharar')  ON CONFLICT(code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Admin','EGF_ADMINISTRATOR','One who is the administrator for all master data in Finance',now(),1,1,now(),0,'pb.zirakpur')  ON CONFLICT(code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Admin','EGF_ADMINISTRATOR','One who is the administrator for all master data in Finance',now(),1,1,now(),0,'pb.nayagaon')  ON CONFLICT(code, tenantid) DO NOTHING;

