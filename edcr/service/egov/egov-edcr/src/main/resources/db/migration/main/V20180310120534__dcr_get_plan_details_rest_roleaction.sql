
Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application)
values(nextval('SEQ_EG_ACTION'),'Get edcr system approved plan details using dcr number','/rest/approved-plan-details/by-edcr-number',(select id from eg_module where name='E-Application' and
parentmodule=(select id from eg_module where name='EDCR' and parentmodule is null)),(select max(ordernumber)+1 from EG_ACTION),'Get edcr system approved plan details using dcr number',false,'edcr',
(select id from eg_module where name='EDCR' and parentmodule is null));

Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Get edcr system approved plan details using dcr number'));

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Get edcr system approved plan details using dcr number'));