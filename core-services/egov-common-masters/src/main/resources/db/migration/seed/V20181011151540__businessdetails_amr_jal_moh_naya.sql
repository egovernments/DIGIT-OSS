insert into eg_businesscategory(id,name,code,active,tenantid,version,createdby,lastmodifiedby,createddate,lastmodifieddate) values(
nextval('seq_eg_businesscategory'),'Entry Fees','ETY',true,'pb.amritsar',0,1,1,153327168499,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Parks Entry Fees','/receipts/receipt-create.action',true,'ETYPK','ADHOC','01','606100','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.amritsar'),false,1,1,1,0,'pb.amritsar',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Museum Entry Fees','/receipts/receipt-create.action',true,'ETYM','ADHOC','01','606100','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.amritsar'),false,1,1,1,0,'pb.amritsar',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Playgrounds Entry Fees','/receipts/receipt-create.action',true,'ETYG','ADHOC','01','606200','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.amritsar'),false,1,1,1,0,'pb.amritsar',false,1533271684996,1533271684996);

----------------------------------

insert into eg_businesscategory(id,name,code,active,tenantid,version,createdby,lastmodifiedby,createddate,lastmodifieddate) values(
nextval('seq_eg_businesscategory'),'Entry Fees','ETY',true,'pb.jalandhar',0,1,1,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Parks Entry Fees','/receipts/receipt-create.action',true,'ETYPK','ADHOC','01','606100','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.jalandhar'),false,1,1,1,0,'pb.jalandhar',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Museum Entry Fees','/receipts/receipt-create.action',true,'ETYM','ADHOC','01','606100','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.jalandhar'),false,1,1,1,0,'pb.jalandhar',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Playgrounds Entry Fees','/receipts/receipt-create.action',true,'ETYG','ADHOC','01','606200','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.jalandhar'),false,1,1,1,0,'pb.jalandhar',false,1533271684996,1533271684996);

--------------------------------
update eg_businessdetails set vouchercreation=true where code='ATH' and tenantid='pb.amritsar';
update eg_businessdetails set vouchercreation=true where code='ATH' and tenantid='pb.jalandhar';

-------------------------------------
insert into eg_businesscategory(id,name,code,active,tenantid,version,createdby,lastmodifiedby,createddate,lastmodifieddate) values(
nextval('seq_eg_businesscategory'),'Entry Fees','ETY',true,'pb.mohali',0,1,1,153327168499,1533271684996);

insert into eg_businesscategory(id,name,code,active,tenantid,version,createdby,lastmodifiedby,createddate,lastmodifieddate) values(
nextval('seq_eg_businesscategory'),'Advertisement Tax','AT',true,'pb.mohali',0,1,1,1533271684996,1533271684996);


insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Parks Entry Fees','/receipts/receipt-create.action',true,'ETYPK','ADHOC','01','606100','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.mohali'),false,1,1,1,0,'pb.mohali',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Museum Entry Fees','/receipts/receipt-create.action',true,'ETYM','ADHOC','01','606100','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.mohali'),false,1,1,1,0,'pb.mohali',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Playgrounds Entry Fees','/receipts/receipt-create.action',true,'ETYG','ADHOC','01','606200','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.mohali'),false,1,1,1,0,'pb.mohali',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Advt Tax on hoardings','/receipts/receipt-create.action',true,'ATH','ADHOC','01','909100','DEPT_1',true,
(select id from eg_businesscategory where code='AT' and tenantid='pb.mohali'),false,1,1,1,0,'pb.mohali',false,1533271684996,1533271684996);

----------------------------------

insert into eg_businesscategory(id,name,code,active,tenantid,version,createdby,lastmodifiedby,createddate,lastmodifieddate) values(
nextval('seq_eg_businesscategory'),'Entry Fees','ETY',true,'pb.nayagaon',0,1,1,1533271684996,1533271684996);

insert into eg_businesscategory(id,name,code,active,tenantid,version,createdby,lastmodifiedby,createddate,lastmodifieddate) values(
nextval('seq_eg_businesscategory'),'Advertisement Tax','AT',true,'pb.nayagaon',0,1,1,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Parks Entry Fees','/receipts/receipt-create.action',true,'ETYPK','ADHOC','01','606100','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.nayagaon'),false,1,1,1,0,'pb.nayagaon',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Museum Entry Fees','/receipts/receipt-create.action',true,'ETYM','ADHOC','01','606100','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.nayagaon'),false,1,1,1,0,'pb.nayagaon',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Playgrounds Entry Fees','/receipts/receipt-create.action',true,'ETYG','ADHOC','01','606200','DEPT_2',true,
(select id from eg_businesscategory where code='ETY' and tenantid='pb.nayagaon'),false,1,1,1,0,'pb.nayagaon',false,1533271684996,1533271684996);

insert into eg_businessdetails(id,name,businessurl,isenabled,code,businesstype,fund,function,department,vouchercreation,
businesscategory,isvoucherapproved,createdby,
lastmodifiedby,ordernumber,version,tenantid,callbackforapportioning,createddate,lastmodifieddate)
values(nextval('seq_eg_businessdetails'),'Advt Tax on hoardings','/receipts/receipt-create.action',true,'ATH','ADHOC','01','909100','DEPT_1',true,
(select id from eg_businesscategory where code='AT' and tenantid='pb.nayagaon'),false,1,1,1,0,'pb.nayagaon',false,1533271684996,1533271684996);
--------------------------------




