insert into eg_userrole_v1 (role_code,role_tenantid,user_id,user_tenantid,lastmodifieddate) 
select 'CITIZEN', role_tenantid, user_id, user_tenantid, current_timestamp from eg_userrole_v1 
where role_code='FSM_DSO' and user_id not in (select user_id from eg_userrole_v1 where role_code = 'CITIZEN');
