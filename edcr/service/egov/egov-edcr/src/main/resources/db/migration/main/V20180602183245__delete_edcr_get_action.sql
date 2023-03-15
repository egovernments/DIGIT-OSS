delete from eg_roleaction where roleid = (select id from eg_role where name='BUSINESS') and actionid = (select id from eg_action where name='Get edcr system approved report using dcr number');
delete from eg_roleaction where roleid = (select id from eg_role where name='SYSTEM') and actionid = (select id from eg_action where name='Get edcr system approved report using dcr number');
delete from eg_roleaction where roleid = (select id from eg_role where name='BPA Approver') and actionid = (select id from eg_action where name='Get edcr system approved report using dcr number');
delete from eg_roleaction where roleid = (select id from eg_role where name='CITIZEN') and actionid = (select id from eg_action where name='Get edcr system approved report using dcr number');
delete from eg_roleaction where roleid = (select id from eg_role where name='Bpa Administrator') and actionid = (select id from eg_action where name='Get edcr system approved report using dcr number');

delete from eg_action where name = 'Get edcr system approved report using dcr number' and parentmodule = (select id from eg_module where name='E-Application' and
parentmodule=(select id from eg_module where name='Digit DCR' and parentmodule is null));