insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'TL Counter Employee','TL_CEMP','Counter Employee in Trade License who files TL on behalf of the citizen',now(),1,1,now(),0,'pb.amritsar')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'TL Approver','TL_APPROVER','Approver who verifies and approves the TL application',now(),1,1,now(),0,'pb.amritsar')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'TL Counter Employee','TL_CEMP','Counter Employee in Trade License who files TL on behalf of the citizen',now(),1,1,now(),0,'pb.jalandhar')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'TL Approver','TL_APPROVER','Approver who verifies and approves the TL application',now(),1,1,now(),0,'pb.jalandhar')
ON CONFLICT (code, tenantid) DO NOTHING;