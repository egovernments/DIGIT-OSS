Insert into EG_ACTION (id,name,url,queryparams,parentmodule,ordernumber,displayname,enabled,contextroot,version,createdby,createddate,lastmodifiedby,lastmodifieddate,application) 
values (nextval('SEQ_EG_ACTION'),'Submit new plan to scrutinize for occupancy certiifcate','/occupancy-certificate/plan/submit',null,(select id from eg_module where name='E-Application'),(select max(ordernumber)+1 from EG_ACTION),'Submit new plan to scrutinize for occupancy certiifcate','false','edcr',0,1,now(),1,now(),
(select id from eg_module where name='Digit DCR'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='BUSINESS'), (select id from eg_action where name='Submit new plan to scrutinize for occupancy certiifcate'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='CITIZEN'), (select id from eg_action where name='Submit new plan to scrutinize for occupancy certiifcate'));

Insert into EG_ACTION (id,name,url,queryparams,parentmodule,ordernumber,displayname,enabled,contextroot,version,createdby,createddate,lastmodifiedby,lastmodifieddate,application) 
values (nextval('SEQ_EG_ACTION'),'Resubmit plan to scrutinize for occupancy certiifcate','/occupancy-certificate/plan/resubmit',null,(select id from eg_module where name='E-Application'),(select max(ordernumber)+1 from EG_ACTION),'Resubmit plan to scrutinize for occupancy certiifcate','false','edcr',0,1,now(),1,now(),
(select id from eg_module where name='Digit DCR'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='BUSINESS'), (select id from eg_action where name='Resubmit plan to scrutinize for occupancy certiifcate'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='CITIZEN'), (select id from eg_action where name='Resubmit plan to scrutinize for occupancy certiifcate'));

Insert into EG_ACTION (id,name,url,queryparams,parentmodule,ordernumber,displayname,enabled,contextroot,version,createdby,createddate,lastmodifiedby,lastmodifieddate,application) 
values (nextval('SEQ_EG_ACTION'),'Result of scrutinized plan details for occupancy certiifcate','/occupancy-certificate/plan/result',null,(select id from eg_module where name='E-Application'),(select max(ordernumber)+1 from EG_ACTION),'Result of scrutinized plan details for occupancy certiifcate','false','edcr',0,1,now(),1,now(),
(select id from eg_module where name='Digit DCR'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='BUSINESS'), (select id from eg_action where name='Result of scrutinized plan details for occupancy certiifcate'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='CITIZEN'), (select id from eg_action where name='Result of scrutinized plan details for occupancy certiifcate'));

Insert into EG_ACTION (id,name,url,queryparams,parentmodule,ordernumber,displayname,enabled,contextroot,version,createdby,createddate,lastmodifiedby,lastmodifieddate,application) 
values (nextval('SEQ_EG_ACTION'),'Validate scrutinized plan by permit number','/scrutinized-plan/findby-permitnumber',null,(select id from eg_module where name='E-Application'),(select max(ordernumber)+1 from EG_ACTION),'Validate scrutinized plan by permit number','false','edcr',0,1,now(),1,now(),
(select id from eg_module where name='Digit DCR'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='BUSINESS'), (select id from eg_action where name='Validate scrutinized plan by permit number'));

Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='CITIZEN'), (select id from eg_action where name='Validate scrutinized plan by permit number'));