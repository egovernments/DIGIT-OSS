INSERT into eg_module (id, name, enabled, contextroot, parentmodule, displayname, ordernumber) values 
(nextval('SEQ_EG_ACTION'),'Checklist Master',true,'common',(select id from eg_module where name='Common-Masters' and contextroot='common'),'Check List',1);

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application,createdby, createddate, lastmodifiedby, lastmodifieddate) values
(nextval('SEQ_EG_ACTION'),'create-checklist','/checklist/create',(select id from eg_module where name='Checklist Master' ),1,'Create CheckList',true,'common',
(select id from eg_module where name='Common' and parentmodule is null),1,now(),1,now());

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='create-checklist'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application,createdby, createddate, lastmodifiedby, lastmodifieddate) values
(nextval('SEQ_EG_ACTION'),'view-checkList','/checklist/view',(select id from eg_module where name='Checklist Master'),2,'View CheckList',true,'common',
(select id from eg_module where name='Common' and parentmodule is null),1,now(),1,now());

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='view-checkList'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application,createdby, createddate, lastmodifiedby, lastmodifieddate) values
(nextval('SEQ_EG_ACTION'),'checklist-result','/checklist/result',(select id from eg_module where name='Checklist Master' ),1,'Result Checklist',false,'common',
(select id from eg_module where name='Common' and parentmodule is null),1,now(),1,now());

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='checklist-result'));

