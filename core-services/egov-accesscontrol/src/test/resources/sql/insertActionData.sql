insert into service (id,code,name,enabled,contextroot,displayname,ordernumber,parentmodule,tenantId) values (nextval('SEQ_SERVICE'),'PGR','PGR',true,'pgr','Grievance Redressal',3,'','ap.public');
insert into service (id,code,name,enabled,contextroot,displayname,ordernumber,parentmodule,tenantId) values (nextval('SEQ_SERVICE'),'PgrComp','PGRComplaints',true,'','Grievance',1,(select id from service where name='PGR'and contextroot='pgr'),'ap.public');

insert into eg_action(id, name,url,servicecode,queryparams,parentmodule,ordernumber,displayname,enabled,createdby,createddate,lastmodifiedby,lastmodifieddate)
values(1,'Get all ReceivingMode','/pgr/receivingmode','PGR','tenantId=','PGR',1,'Get all ReceivingMode',false,1,now(),1,now());
insert into eg_action(id, name,url,servicecode,queryparams,parentmodule,ordernumber,displayname,enabled,createdby,createddate,lastmodifiedby,lastmodifieddate)
values(2,'Get all CompaintTypeCategory','/pgr/complaintTypeCategories','PGR','tenantId=','PGR',2,'Get all CompaintTypeCategory',false,1,now(),1,now());
insert into eg_action(id, name,url,servicecode,queryparams,parentmodule,ordernumber,displayname,enabled,createdby,createddate,lastmodifiedby,lastmodifieddate)
values(3,'Get ComplaintType by type,count and tenantId','/pgr/services','PGR','type=&count=&tenantId=','PgrComp',5,'Get ComplaintType by type,count and tenantId',false,1,now(),1,now());
insert into eg_action(id, name,url,servicecode,queryparams,parentmodule,ordernumber,displayname,enabled,createdby,createddate,lastmodifiedby,lastmodifieddate)
values(4,'Get all ReceivingCenters','/pgr/receivingcenter','PGR','tenantId=','PgrComp',4,'Get all ReceivingCenters',false,1,now(),1,now());

insert into eg_roleaction(rolecode,actionid,tenantId)values('CITIZEN',1,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('CITIZEN',2,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('CITIZEN',3,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('CITIZEN',4,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('SUPERUSER',1,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('SUPERUSER',2,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('SUPERUSER',3,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('SUPERUSER',4,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('GO',1,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('GO',2,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('GO',3,'ap.public');
insert into eg_roleaction(rolecode,actionid,tenantId)values('GO',4,'ap.public');
