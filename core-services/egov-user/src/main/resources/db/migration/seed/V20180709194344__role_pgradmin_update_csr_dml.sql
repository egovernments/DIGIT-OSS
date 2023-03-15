insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'PGR Administrator','PGR-ADMIN','Admin role that has super access over the system',now(),1,1,now(),0,'pb.amritsar');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'PGR Administrator','PGR-ADMIN','Admin role that has super access over the system',now(),1,1,now(),0,'pb.patiala');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'PGR Administrator','PGR-ADMIN','Admin role that has super access over the system',now(),1,1,now(),0,'pb.jalandhar');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'PGR Administrator','PGR-ADMIN','Admin role that has super access over the system',now(),1,1,now(),0,'pb.bathinda');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'PGR Administrator','PGR-ADMIN','Admin role that has super access over the system',now(),1,1,now(),0,'pb.hoshiarpur');

Update eg_role set name = 'Citizen Service Representative' where code = 'CSR' and tenantid LIKE 'pb%';