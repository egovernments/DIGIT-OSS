insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen','CITIZEN','Citizen who can raise complaint',now(),1,1,now(),0,'pb')
ON CONFLICT (code, tenantid) DO NOTHING;
