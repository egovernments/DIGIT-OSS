insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'EGF Bill Creator','EGF-BILL_CREATOR','Employee who creates Bills mainly expense bill',now(),1,1,now(),0,'pb.jalandhar')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'EGF Bill Approver','EGF-BILL_APPROVER','Employee who takes part in  Bills  approval mainly expense bill',now(),1,1,now(),0,'pb.jalandhar')
ON CONFLICT (code, tenantid) DO NOTHING;