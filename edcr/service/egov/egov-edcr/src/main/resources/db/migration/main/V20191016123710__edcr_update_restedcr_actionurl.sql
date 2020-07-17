


update eg_action set url='/rest/dcr/downloadfile' where name='Download plan';
update eg_action set url='/rest/dcr/scrutinydetails' where name='Get dcr details';
update eg_action set url='/rest/dcr/scrutinizeplan' where name='Upload plan';


delete from eg_roleaction where roleid =(select id from eg_role where name='Third Party Operator') and actionid=(select id from eg_action where name='Download plan');
Insert into eg_roleaction (roleid,actionid) values ((select id from eg_role where name='PUBLIC'), (select id from eg_action where name='Download plan'));