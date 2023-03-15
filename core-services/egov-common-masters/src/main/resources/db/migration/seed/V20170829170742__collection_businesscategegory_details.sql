delete from eg_business_accountdetails where businessdetails in (select id from eg_businessdetails where code in ('CS','PT','WT','WC') and tenantid='default');
delete from eg_businessdetails where code in ('CS','PT','WT','WC') and tenantid='default';
delete from eg_businesscategory where code in ('CS','PT','WT','WC') and tenantid='default';

INSERT INTO eg_businesscategory(
          id, name, code, active, tenantid, version, createdby, createddate, 
          lastmodifiedby, lastmodifieddate)
  VALUES (nextval('seq_eg_businesscategory'),'Citizen Services','CS',true,'default',0,1,(select extract ('epoch' from (select * from now()))*1000), 
          1, (select extract ('epoch' from (select * from now()))*1000));

INSERT INTO eg_businessdetails(
          id, name, businessurl, isenabled, code, businesstype, fund, function, 
          fundsource, functionary, department, vouchercreation, businesscategory, 
          isvoucherapproved, vouchercutoffdate, createddate, lastmodifieddate, 
          createdby, lastmodifiedby, ordernumber, version, tenantid, callbackforapportioning)
  VALUES (nextval('seq_eg_businessdetails'), 'Citizen Services', '/receipts/receipt-create.action', true, 'CS','B','01','909100',null,null,'AS',false,(select id from eg_businesscategory where code='CS' and tenantid='default'),false,null,(select extract ('epoch' from (select * from now()))*1000),(select extract ('epoch' from (select * from now()))*1000),1,1,1,0,'default',false);


INSERT INTO eg_businesscategory(
          id, name, code, active, tenantid, version, createdby, createddate, 
          lastmodifiedby, lastmodifieddate)
  VALUES (nextval('seq_eg_businesscategory'),'Water Charges','WC',true,'default',0,1,(select extract ('epoch' from (select * from now()))*1000), 
          1, (select extract ('epoch' from (select * from now()))*1000));

INSERT INTO eg_businesscategory(
          id, name, code, active, tenantid, version, createdby, createddate, 
          lastmodifiedby, lastmodifieddate)
  VALUES (nextval('seq_eg_businesscategory'),'Property Tax','PT',true,'default',0,1,(select extract ('epoch' from (select * from now()))*1000), 
          1, (select extract ('epoch' from (select * from now()))*1000));
          
INSERT INTO eg_businessdetails(
          id, name, businessurl, isenabled, code, businesstype, fund, function, 
          fundsource, functionary, department, vouchercreation, businesscategory, 
          isvoucherapproved, vouchercutoffdate, createddate, lastmodifieddate, 
          createdby, lastmodifiedby, ordernumber, version, tenantid, callbackforapportioning)
  VALUES (nextval('seq_eg_businessdetails'), 'Water Charges', '/receipts/receipt-create.action', true, 'WC','B','01','505100',null,null,'AS',false,(select id from eg_businesscategory where code='WC' and tenantid='default'),false,null,(select extract ('epoch' from (select * from now()))*1000),(select extract ('epoch' from (select * from now()))*1000),1,1,1,0,'default',false);

INSERT INTO eg_businessdetails(
          id, name, businessurl, isenabled, code, businesstype, fund, function, 
          fundsource, functionary, department, vouchercreation, businesscategory, 
          isvoucherapproved, vouchercutoffdate, createddate, lastmodifieddate, 
          createdby, lastmodifiedby, ordernumber, version, tenantid, callbackforapportioning)
  VALUES (nextval('seq_eg_businessdetails'), 'Property Tax', '/receipts/receipt-create.action', true, 'PT','B','01','909100',null,null,'AS',false,(select id from eg_businesscategory where code='PT' and tenantid='default'),false,null,(select extract ('epoch' from (select * from now()))*1000),(select extract ('epoch' from (select * from now()))*1000),1,1,1,0,'default',false);


