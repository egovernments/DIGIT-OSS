--business service entry
INSERT INTO egbs_business_service_details(id ,businessservice ,collectionmodesnotallowed ,callbackforapportioning ,partpaymentallowed , callbackapportionurl ,createddate,lastmodifieddate , createdby ,lastmodifiedby ,tenantid) values(NEXTVAL('seq_egbs_business_srvc_details'),'TRADELICENSE',null,false,false,null, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-08-30')),(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-08-30')),1,1,'default');


--Tax periods entry
INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values (NEXTVAL('seq_egbs_taxperiod'),'TRADELICENSE','TL201112', 1301596200000,1333152000000,'2011-2012',1504081044000,1504081044000,1,1,'default','ANNUAL');

INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values (NEXTVAL('seq_egbs_taxperiod'),'TRADELICENSE','TL201213', 1333238400000,1364688000000,'2012-2013',1504081044000,1504081044000,1,1,'default','ANNUAL');

INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values (NEXTVAL('seq_egbs_taxperiod'),'TRADELICENSE','TL201314', 1364774400000,1396224000000,'2013-2014',1504081044000,1504081044000,1,1,'default','ANNUAL');

INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values (NEXTVAL('seq_egbs_taxperiod'),'TRADELICENSE','TL201415', 1396310400000,1427760000000,'2014-2015',1504081044000,1504081044000,1,1,'default','ANNUAL');

INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values (NEXTVAL('seq_egbs_taxperiod'),'TRADELICENSE','TL201516', 1427846400000,1459382400000,'2015-2016',1504081044000,1504081044000,1,1,'default','ANNUAL');

INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values (NEXTVAL('seq_egbs_taxperiod'),'TRADELICENSE','TL201617', 1459468800000,1490918400000,'2016-2017',1504081044000,1504081044000,1,1,'default','ANNUAL');

INSERT INTO egbs_taxperiod(id,service,code,fromdate,todate,financialYear, createddate, lastmodifieddate, createdby, lastmodifiedby, tenantid,periodcycle) values (NEXTVAL('seq_egbs_taxperiod'),'TRADELICENSE','TL201718', 1491004800000,1522454400000,'2017-2018',1504081044000,1504081044000,1,1,'default','ANNUAL');


----Taxhead mater entry
INSERT INTO egbs_taxheadmaster(id, tenantid, category,service, name, code, isdebit,isactualdemand, orderno,validfrom, validtill, createdby, createdtime,lastmodifiedby, lastmodifiedtime) VALUES (NEXTVAL('seq_egbs_taxheadmaster'), 'default', 'License Fees','TRADELICENSE', 'New Trade License Fee', 'NEWTRADELICENSEFEE', 'N', false, 1, 1301596200000, 1522454400000, 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-08-30')), 1, (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-08-30')));

-- GL Code entry
insert into egbs_glcodemaster (id ,tenantid,taxhead , service,fromdate,todate,createdby ,createdtime ,lastmodifiedby , lastmodifiedtime , glcode) values(NEXTVAL('seq_egbs_glcodemaster'),'default','NEWTRADELICENSEFEE','TRADELICENSE',1301596200000,1522454400000,1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-08-30')),1,(SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-08-30')),'1401101');