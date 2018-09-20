update accountdetailtype set full_qualified_name = 'org.egov.model.masters.Supplier' ,tablename = 'EGF_SUPPLIER' where name = 'Supplier';

Insert into ACCOUNTDETAILTYPE (ID,NAME,DESCRIPTION,TABLENAME,COLUMNNAME,ATTRIBUTENAME,NBROFLEVELS,ISACTIVE,CREATEDDATE,LASTMODIFIEDDATE,LASTMODIFIEDBY ,CREATEDBY,FULL_QUALIFIED_NAME,VERSION)
 values (nextval('seq_accountdetailtype'),'Contractor','Contractor','EGF_CONTRACTOR','id','Contractor_id',1,true,current_date,current_date,null,null,'org.egov.model.masters.Contractor',0);

