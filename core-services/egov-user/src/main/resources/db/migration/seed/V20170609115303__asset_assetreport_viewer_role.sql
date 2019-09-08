INSERT INTO EG_ROLE (ID,NAME,DESCRIPTION,CREATEDDATE,CREATEDBY,LASTMODIFIEDBY,LASTMODIFIEDDATE,
	VERSION,CODE,TENANTID) values(nextval('seq_eg_role'),'Asset Report Viewer',
		'Viewer of Assets Reports',now(),1,1,now(),0,'AssetReportViewer','default');
	
--rollback delete from eg_role where name = 'Asset Report Viewer' and tenantid = 'default';