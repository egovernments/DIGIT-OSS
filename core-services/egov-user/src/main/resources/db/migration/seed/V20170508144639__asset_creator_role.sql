INSERT INTO EG_ROLE (ID,NAME,DESCRIPTION,CREATEDDATE,CREATEDBY,LASTMODIFIEDBY,LASTMODIFIEDDATE,VERSION,CODE,TENANTID) values(nextval('seq_eg_role'),'Asset Creator','Creator of Assets',now(),1,1,now(),0,'AssetCreator','default');
	
--rollback delete from eg_role where name like 'Asset Creator' and tenantid = 'default';