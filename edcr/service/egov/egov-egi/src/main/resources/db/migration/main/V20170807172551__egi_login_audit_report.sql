INSERT INTO EG_MODULE(id,name,enabled,contextroot,parentmodule,displayname,ordernumber) 
VALUES (nextval('SEQ_EG_MODULE'), 'System Audits', true, 'egi', (select id from eg_module where name='Administration'), 'System Audits', (select count(*)+1 from eg_module where parentmodule=(select id from eg_module where name='Administration')));

INSERT INTO EG_MODULE(id,name,enabled,contextroot,parentmodule,displayname,ordernumber) 
VALUES (nextval('SEQ_EG_MODULE'), 'Audit Reports', true, 'egi', (select id from eg_module where name='System Audits'), 'Audit Reports', 1);

Insert into EG_ACTION (id, name, url, queryparams, parentmodule, ordernumber, displayname, enabled, contextroot, version,
 createdby, createddate, lastmodifiedby, lastmodifieddate, application) values 
(NEXTVAL('SEQ_EG_ACTION'),'Login Audit Report','/audit/report/login',null,
(select id from eg_module where name like 'Audit Reports')
,0,'Login Audit Report',true,'egi',0,1,now(),1,now(),(select id from eg_module where name='Administration'));

Insert into EG_ROLEACTION (ROLEID, ACTIONID) values ((select id from eg_role where name='SYSTEM'),
(select id from eg_action where name='Login Audit Report'));