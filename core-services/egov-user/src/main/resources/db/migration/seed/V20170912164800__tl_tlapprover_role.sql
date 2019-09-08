INSERT INTO EG_ROLE (ID,NAME,DESCRIPTION,CREATEDDATE,CREATEDBY,LASTMODIFIEDBY,LASTMODIFIEDDATE,	VERSION,CODE,TENANTID) values(nextval('seq_eg_role'),'TL Approver','Who has a access to Trade License Workflow',now(),1,1,now(),0,'TL_APPROVER','default');

	
--rollback delete from eg_role where name = 'TL Approver' and tenantid = 'default';