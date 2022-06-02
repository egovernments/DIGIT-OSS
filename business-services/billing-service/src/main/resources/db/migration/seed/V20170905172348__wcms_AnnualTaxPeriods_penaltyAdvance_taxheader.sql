
INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2006',
 1143849600000,1175299200000,'2006-2007',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');



INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2007',
 1175385600000,1206921600000,'2007-2008',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');


INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2008',
 1207008000000,1238457600000,'2008-2009',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');



INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2009',
 1238544000000,1269993600000,'2009-2010',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');





INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2010',
 1270080000000,1301529600000,'2010-2011',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');



INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2011',
 1301616000000,1333152000000,'2011-2012',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');



INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2012',
 1333238400000,
 1364688000000,'2012-2013',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');





INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2013',
 1364774400000,
 1396224000000,'2013-2014',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');








INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2014',
 1396310400000,
 1427760000000,'2014-2015',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');







INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2015',
 1427846400000,
 1459382400000,'2015-2016',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');








INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2016',
 1459468800000,
 1490918400000,'2016-2017',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');




INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, 
createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values
 (NEXTVAL('seq_egbs_taxperiod'),'WC','WTC2017',
 1491004800000,
 1522454400000,'2017-2018',1503167400000
 ,1503167400000,1,1,' default','ANNUAL');








INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno,
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'PENALTY','WC', 'Water Charge-PENALTY', 'PENALTY', 'N', true, 1,
 1143849600000, 1522454400000, 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));



insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','PENALTY','WC',1143849600000,
  1522454400000,1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1405013');


update  egbs_taxheadmaster set validfrom=1143849600000   where service='WC' and code='WATERCHARGE';

update egbs_taxheadmaster  set validfrom=1143849600000 where service='WC' and code='WATERCHARGEPENALTY';


update egbs_glcodemaster  set  fromdate=1143849600000  where service='WC' and taxhead='WATERCHARGE';

update egbs_glcodemaster  set fromdate=1143849600000 where service='WC' and taxhead='WATERCHARGEPENALTY';



INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno,
validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime)
 VALUES (NEXTVAL('seq_egbs_taxheadmaster'), ' default', 'ADVANCE_COLLECTION','WC', 'Water Charge-ADVANCE', 'ADVANCE', 'N', true, 1,
 1491004800000, 1522454400000, 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')));



insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate
  ,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime ,
  glcode) values(NEXTVAL('seq_egbs_glcodemaster'),' default','ADVANCE','WC',1491004800000,
  1522454400000,1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),
  1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-07-11')),'1405013');

