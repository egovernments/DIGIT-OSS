INSERT INTO EG_ROLE (ID,NAME,DESCRIPTION,CREATEDDATE,CREATEDBY,LASTMODIFIEDBY,LASTMODIFIEDDATE,	VERSION,CODE,TENANTID) 
values(nextval('seq_eg_role'),'Collection Operator','Can Create, Search and Update Receipt',now(),1,1,now(),0,'COLL_OPERATOR','default');

INSERT INTO EG_ROLE (ID,NAME,DESCRIPTION,CREATEDDATE,CREATEDBY,LASTMODIFIEDBY,LASTMODIFIEDDATE,	VERSION,CODE,TENANTID) 
values(nextval('seq_eg_role'),'Bank Collection Operator','Can Create, Search Receipt',now(),1,1,now(),0,'BANK_COLL_OPERATOR','default');

INSERT INTO EG_ROLE (ID,NAME,DESCRIPTION,CREATEDDATE,CREATEDBY,LASTMODIFIEDBY,LASTMODIFIEDDATE,	VERSION,CODE,TENANTID) 
values(nextval('seq_eg_role'),'CSC Collection Operator','Can Create, Search Receipt',now(),1,1,now(),0,'CSC_COLL_OPERATOR','default');


