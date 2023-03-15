insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'ULB Operator','ULB Operator','City Official',now(),1,1,now(),0,'default');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Property Verifier','Property Verifier','One who do field survey and verified the data entered by ULB Operator',now(),1,1,now(),0,'default');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Property Approver','Property Approver','One who approves the record finally',now(),1,1,now(),0,'default');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Asset Administrator','Asset Administrator','One who manages the Asset Master data',now(),1,1,now(),0,'default');