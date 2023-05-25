
INSERT INTO egbs_business_service_details(id ,businessservice ,collectionmodesnotallowed ,callbackforapportioning ,
  partpaymentallowed , callbackapportionurl ,createddate,lastmodifieddate , createdby ,lastmodifiedby ,tenantid) values(NEXTVAL('seq_egbs_business_srvc_details'),'Water Charge',null,false,false,null,
(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),1,1,'default');



INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'Water Charge','WT201704',
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')),
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-14')),'2017-2018',(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31'))
 ,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-14')),1,1,'default','ANNUAL');

INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno, 
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','Water Charge', 'Water Charge Estimation Charges', 'ESTIMATIONCHARGES', 'N', true, 1,
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')), (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));



insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','ESTIMATIONCHARGES','Water Charge',(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')),
  (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')),1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1407011');




INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno, 
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','Water Charge', 'Water Charge Supervision charges', 'SUPERVISIONCHARGE', 'N', true, 1,
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')), (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));



insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','SUPERVISIONCHARGE','Water Charge',(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')),
  (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')),1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'140-50-02');


INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno, 
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','Water Charge', 'Water Charge Road cutting charges', 'ROADCUTCHARGE', 'N', true, 1,
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')), (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));


insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','ROADCUTCHARGE','Water Charge',(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')),
  (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')),1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1407001');


INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno, 
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','Water Charge', 'Water Charge Special Deposit charges', 'SPLDEPOSITECHARGE', 'N', true, 1,
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')), (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));



insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','SPLDEPOSITECHARGE','Water Charge',(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')),
  (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')),1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1407001');
-- need to check for this charges glcode-SPLDEPOSITECHARGE

INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno, 
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','Water Charge', 'Water Charge Security Deposit charges', 'SECURITYDEPOSITECHARGE', 'N', true, 1,
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')), (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));


insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','SECURITYDEPOSITECHARGE','Water Charge',(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')),
  (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')),1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1407001');

INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno, 
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','Water Charge', 'Water Charge-Metered', 'WATERCHARGEMETERED', 'N', true, 1,
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')), (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));

insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','WATERCHARGEMETERED','Water Charge',(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')),
  (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')),1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1405014');


INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno, 
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','Water Charge', 'Water Charge NonMetered', 'WATERCGARGENONMETERED', 'N', true, 1,
 (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')), (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));


insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','WATERCGARGENONMETERED','Water Charge',(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')),
  (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')),1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1405013');