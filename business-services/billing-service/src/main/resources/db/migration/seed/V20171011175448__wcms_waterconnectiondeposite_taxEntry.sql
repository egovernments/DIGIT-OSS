
INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno,
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'CHARGES','WC', 
 'WATERCONNECTIONDEPOSITE', 'WATERCONNECTIONDEPOSITE', 'N', true, 1,
 1491004800000, 1522454400000, 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-10-11')), 
 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-10-11')));



insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','WATERCONNECTIONDEPOSITE','WC',1491004800000,
  1522454400000,1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-10-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-10-11')),'1407001');