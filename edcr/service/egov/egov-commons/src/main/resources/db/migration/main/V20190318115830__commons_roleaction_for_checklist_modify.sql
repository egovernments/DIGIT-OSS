Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application,createdby, createddate, lastmodifiedby, lastmodifieddate) values
(nextval('SEQ_EG_ACTION'),'update-checklist','/checklist/update',(select id from eg_module where name='Checklist Master' ),3,'Modify CheckList',true,'common',
(select id from eg_module where name='Common' and parentmodule is null),1,now(),1,now());

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='update-checklist'));
