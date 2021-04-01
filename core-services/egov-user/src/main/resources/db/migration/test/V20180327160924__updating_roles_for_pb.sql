delete from eg_userrole where tenantid='pb.Amritsar';
delete from eg_user where tenantid='pb.Amritsar'; 


delete from eg_role where tenantid='pb.Amritsar';
delete from eg_role where tenantid='pb.Patiala';
delete from eg_role where tenantid='pb.Jalandhar';
delete from eg_role where tenantid='pb.Bathinda';
delete from eg_role where tenantid='pb.Hoshiarpur';

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen','CITIZEN','Citizen who can raise complaint',now(),1,1,now(),0,'pb.amritsar');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'pb.amritsar');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grievance Routing Officer','GRO','Grievance Routing Officer',now(),1,1,now(),0,'pb.amritsar');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen','CITIZEN','Citizen who can raise complaint',now(),1,1,now(),0,'pb.patiala');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'pb.patiala');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grievance Routing Officer','GRO','Grievance Routing Officer',now(),1,1,now(),0,'pb.patiala');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen','CITIZEN','Citizen who can raise complaint',now(),1,1,now(),0,'pb.jalandhar');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'pb.jalandhar');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grievance Routing Officer','GRO','Grievance Routing Officer',now(),1,1,now(),0,'pb.jalandhar');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen','CITIZEN','Citizen who can raise complaint',now(),1,1,now(),0,'pb.bathinda');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'pb.bathinda');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grievance Routing Officer','GRO','Grievance Routing Officer',now(),1,1,now(),0,'pb.bathinda');

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Citizen','CITIZEN','Citizen who can raise complaint',now(),1,1,now(),0,'pb.hoshiarpur');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Employee','EMPLOYEE','Default role for all employees',now(),1,1,now(),0,'pb.hoshiarpur');
insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Grievance Routing Officer','GRO','Grievance Routing Officer',now(),1,1,now(),0,'pb.hoshiarpur');