INSERT INTO eg_module(
            id, name, enabled, contextroot, parentmodule, displayname, ordernumber)
    VALUES (nextval('SEQ_EG_MODULE'), 'E-DCR', true, 'edcr', null, 'E-DCR',
 (select max(ordernumber)+1 from eg_module where parentmodule is null));

INSERT INTO eg_module(
            id, name, enabled, contextroot, parentmodule, displayname, ordernumber)
    VALUES (nextval('SEQ_EG_MODULE'), 'E-Application', true, null, (select id from eg_module where name='E-DCR'), 'E-Application', 1);

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) 
values(nextval('SEQ_EG_ACTION'),'New-EdcrApplication','/edcrapplication/new',(select id from eg_module where name='E-Application' and
parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),1,'New-EdcrApplication',true,'/edcr',
(select id from eg_module where name='E-DCR' and parentmodule is null));

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='New-EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application)
values(nextval('SEQ_EG_ACTION'),'Create-EdcrApplication','/edcrapplication/create',(select id from eg_module where name='E-Application' and 
parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),1,'Create-EdcrApplication',
false,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Create-EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) values(nextval('SEQ_EG_ACTION'),'Update-EdcrApplication','/edcrapplication/update',(select id from eg_module where name='E-Application' and parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),1,'Update-EdcrApplication',false,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Update-EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) values(nextval('SEQ_EG_ACTION'),'View-EdcrApplication','/edcrapplication/view',(select id from eg_module where name='E-Application' and parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),1,'View-EdcrApplication',false,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='View-EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) values(nextval('SEQ_EG_ACTION'),'Edit-EdcrApplication','/edcrapplication/edit',(select id from eg_module where name='E-Application' and parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),1,'Edit-EdcrApplication',false,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Edit-EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) values(nextval('SEQ_EG_ACTION'),'Result-EdcrApplication','/edcrapplication/result',(select id from eg_module where name='E-Application' and parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),1,'Result-EdcrApplication',false,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Result-EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) values(nextval('SEQ_EG_ACTION'),'View EdcrApplication','/edcrapplication/search/view',(select id from eg_module where name='E-Application' and parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),2,'View EdcrApplication',true,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='View EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) values(nextval('SEQ_EG_ACTION'),'Edit EdcrApplication','/edcrapplication/search/edit',(select id from eg_module where name='E-Application' and parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),3,'Edit EdcrApplication',true,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Edit EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) values(nextval('SEQ_EG_ACTION'),'Search and View Result-EdcrApplication','/edcrapplication/ajaxsearch/view',(select id from eg_module where name='E-Application' and parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),1,'Search and View Result-EdcrApplication',false,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Search and View Result-EdcrApplication'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application) values(nextval('SEQ_EG_ACTION'),'Search and Edit Result-EdcrApplication','/edcrapplication/ajaxsearch/edit',(select id from eg_module where name='E-Application' and parentmodule=(select id from eg_module where name='E-DCR' and parentmodule is null)),1,'Search and Edit Result-EdcrApplication',false,'/edcr',(select id from eg_module where name='E-DCR' and parentmodule is null));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Search and Edit Result-EdcrApplication'));

