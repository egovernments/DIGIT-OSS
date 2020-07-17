Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application)
values(nextval('SEQ_EG_ACTION'),'Re Upload Edcr file','/edcrapplication/resubmit',(select id from eg_module where name='E-Application' and
parentmodule=(select id from eg_module where name='EDCR' and parentmodule is null)),1,'Re Upload Edcr file',true,'edcr',
(select id from eg_module where name='EDCR' and parentmodule is null));

Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Re Upload Edcr file'));

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Re Upload Edcr file'));

Insert into eg_action(id,name,url,parentmodule,ordernumber,displayname,enabled,contextroot,application)
values(nextval('SEQ_EG_ACTION'),'Get edcr applcation details','/edcrapplication/get-information',(select id from eg_module where name='E-Application' and
parentmodule=(select id from eg_module where name='EDCR' and parentmodule is null)),1,'Get edcr applcation details',true,'edcr',
(select id from eg_module where name='EDCR' and parentmodule is null));

Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Get edcr applcation details'));

Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='Get edcr applcation details'));
