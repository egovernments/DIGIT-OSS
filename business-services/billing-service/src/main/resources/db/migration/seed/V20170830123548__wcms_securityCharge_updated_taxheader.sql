
delete from egbs_taxperiod where service='WC' and  periodcycle='ANNUAL' ;


delete from egbs_taxheadmaster where service='WC' and  code='SECURITYDEPOSITECHARGE' ;
delete from egbs_glcodemaster where service='WC' and  taxhead='SECURITYDEPOSITECHARGE' ;



INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WT201718',
 1491004800000,
 1522454400000,'2017-2018',1503167400000
 ,1503167400000,1,1,'default','ANNUAL');



INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno,
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','WC', 
 'SECURITYDEPOSITECHARGE', 'SECURITYDEPOSITECHARGE', 'N', true, 1,
 1491004800000, 1522454400000, 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 
 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));



insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','SECURITYDEPOSITECHARGE','WC',1491004800000,
  1522454400000,1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1407001');