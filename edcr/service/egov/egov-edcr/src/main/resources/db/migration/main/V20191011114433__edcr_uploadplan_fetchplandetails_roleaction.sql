
Insert into EG_ACTION (id,name,url,queryparams,parentmodule,ordernumber,displayname,enabled,contextroot,version,createdby,createddate,lastmodifiedby,lastmodifieddate,application) 
values (nextval('SEQ_EG_ACTION'),'Upload plan','/dcr/uploadplan',null,(select id from eg_module where name='E-Application'),13,'Upload plan','false','edcr',0,1,now(),1,now(),
(select id from eg_module where name='Digit DCR'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='Third Party Operator'), (select id from eg_action where name='Upload plan'));


Insert into EG_ACTION (id,name,url,queryparams,parentmodule,ordernumber,displayname,enabled,contextroot,version,createdby,createddate,lastmodifiedby,lastmodifieddate,application) 
values (nextval('SEQ_EG_ACTION'),'Get dcr details','/dcr/getdetails',null,(select id from eg_module where name='E-Application'),13,'Get dcr details','false','edcr',0,1,now(),1,now(),
(select id from eg_module where name='Digit DCR'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='Third Party Operator'), (select id from eg_action where name='Get dcr details'));

Insert into EG_ACTION (id,name,url,queryparams,parentmodule,ordernumber,displayname,enabled,contextroot,version,createdby,createddate,lastmodifiedby,lastmodifieddate,application) 
values (nextval('SEQ_EG_ACTION'),'Download plan','/dcr/downloadfile',null,(select id from eg_module where name='E-Application'),13,'Download plan','false','edcr',0,1,now(),1,now(),
(select id from eg_module where name='Digit DCR'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='Third Party Operator'), (select id from eg_action where name='Download plan'));