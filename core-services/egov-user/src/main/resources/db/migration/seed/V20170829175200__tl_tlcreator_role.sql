INSERT INTO EG_ROLE (ID,NAME,DESCRIPTION,CREATEDDATE,CREATEDBY,LASTMODIFIEDBY,LASTMODIFIEDDATE,	VERSION,CODE,TENANTID) 
values(nextval('seq_eg_role'),'TL Creator','Who has a access to Trade License Transactions',now(),1,1,now(),0,'TL_CREATOR','default');

	
--rollback delete from eg_role where name = 'TL_CREATOR' and tenantid = 'default';
