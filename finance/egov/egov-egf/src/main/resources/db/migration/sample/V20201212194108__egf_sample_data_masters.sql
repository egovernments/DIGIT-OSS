---Banks
INSERT INTO bank (id, code, name, narration, isactive, lastmodifieddate, createddate, lastmodifiedby, type,version,createdby) VALUES (nextval('seq_bank'),'SBI','STATE BANK OF INDIA','STATE BANK OF INDIA', true, now(), now(), 1, NULL,0,1) ON CONFLICT DO NOTHING;

INSERT INTO bank (id, code, name, narration, isactive, lastmodifieddate, createddate, lastmodifiedby, type,version,createdby) VALUES (nextval('seq_bank'),'KKBK','KOTAK MAHINDRA BANK','KOTAK MAHINDRA BANK', true, now(), now(), 1, NULL,0,1) ON CONFLICT DO NOTHING;

INSERT INTO bank (id, code, name, narration, isactive, lastmodifieddate, createddate, lastmodifiedby, type,version,createdby) VALUES (nextval('seq_bank'),'ANDB','ANDHRA BANK','ANDHRA BANK', true, now(), now(), 1, NULL,0,1) ON CONFLICT DO NOTHING;

INSERT INTO bank (id, code, name, narration, isactive, lastmodifieddate, createddate, lastmodifiedby, type,version,createdby) VALUES (nextval('seq_bank'),'HDFC','HDFC Bank','HDFC Bank', true, now(), now(), 1, NULL,0,1) ON CONFLICT DO NOTHING;

INSERT INTO bank (id, code, name, narration, isactive, lastmodifieddate, createddate, lastmodifiedby, type,version,createdby) VALUES (nextval('seq_bank'),'ICIC','ICICI Bank','ICICI Bank', true, now(), now(), 1, NULL,0,1) ON CONFLICT DO NOTHING;

----BankBranch
INSERT INTO bankbranch(id, branchcode, branchname, branchaddress1, branchaddress2, branchcity,branchstate,branchpin, branchphone,branchfax, bankid, contactperson,isactive, narration, micr, createddate, lastmodifieddate, lastmodifiedby, createdby,version)
VALUES (nextval('seq_bankbranch'),'6305','SBI Tresury Branch, Kurnool','COLLECTOR COMPLEX DISTT KURNOOL ANDHRA PRADESH',null,null,null,null,'408743462',null,(select id from bank where code='SBI'),'Branch Manager',true,'Operating Current Accounts','518002007',now(),now(),1,1,0) ON CONFLICT DO NOTHING;

INSERT INTO bankbranch(id, branchcode, branchname, branchaddress1, branchaddress2, branchcity,branchstate, branchpin, branchphone,branchfax, bankid, contactperson,isactive, narration, micr, createddate, lastmodifieddate, lastmodifiedby, createdby,version)
VALUES (nextval('seq_bankbranch'),'7849','Ucon Plaza Kurnool','Ucon Plaza, Park Road Kurnool',null,null,null,null,'812756943',null,(select id from bank where code='KKBK'),'Branch Manager',true,'Nationalized Bank','518064002',now(),now(),1,1,0) ON CONFLICT DO NOTHING;

INSERT INTO bankbranch(id, branchcode, branchname, branchaddress1, branchaddress2, branchcity,branchstate, branchpin, branchphone,branchfax, bankid, contactperson,isactive, narration, micr, createddate, lastmodifieddate, lastmodifiedby, createdby,version)
VALUES (nextval('seq_bankbranch'),'1430','KRISHNANAGAR (KURNOOL)','80/112 Aabbas Nagarabbasnagar,Kurnool 518002',null,null,null,null,'022-2261759',null,(select id from bank where code='ANDB'),'Branch Manager',true,'Nationalized Bank','518011010',now(),now(),1,1,0) ON CONFLICT DO NOTHING; 

INSERT INTO bankbranch(id, branchcode, branchname, branchaddress1, branchaddress2, branchcity,branchstate, branchpin, branchphone,branchfax, bankid, contactperson,isactive, narration, micr, createddate, lastmodifieddate, lastmodifiedby, createdby,version)
VALUES (nextval('seq_bankbranch'),'HDFC147','HDFC Bank - Main City','80/112 HDFC Bank - Main City 518002',null,null,null,null,'022-2261759',null,(select id from bank where code='HDFC'),'Branch Manager',true,'Nationalized Bank','518011010',now(),now(),1,1,0) ON CONFLICT DO NOTHING;

INSERT INTO bankbranch(id, branchcode, branchname, branchaddress1, branchaddress2, branchcity,branchstate, branchpin, branchphone,branchfax, bankid, contactperson,isactive, narration, micr, createddate, lastmodifieddate, lastmodifiedby, createdby,version)
VALUES (nextval('seq_bankbranch'),'ICIC550','ICIC Bank - Main City','80/112 ICIC Bank - Main City 518002',null,null,null,null,'022-2261759',null,(select id from bank where code='ICIC'),'Branch Manager',true,'Nationalized Bank','518011010',now(),now(),1,1,0) ON CONFLICT DO NOTHING;
          

-----BankAccount
INSERT INTO bankaccount(id,branchid,accountnumber,accounttype,narration,isactive,glcodeid,fundid,payto,type,createdby,lastmodifiedby,createddate,lastmodifieddate,version)
VALUES(nextval('seq_bankaccount'),(select id from bankbranch where branchcode='HDFC147'),'63897421','45020 - Balance with Banks – Main Municipal Fund','45022 - Other Scheduled Banks',true,(select id from chartofaccounts where glcode='4502201'),(select id from fund where code='01'),'Commissioner','RECEIPTS_PAYMENTS',1,1,now(),now(),0) ON CONFLICT DO NOTHING;

INSERT INTO bankaccount(id, branchid, accountnumber, accounttype, narration, isactive,glcodeid, fundid, payto, type, createdby, lastmodifiedby, createddate,lastmodifieddate, version, chequeformatid)
VALUES (nextval('seq_bankaccount'),(select id from bankbranch where branchcode='6305'),'844102001001VN','45021 - Nationalised Banks','PD Account-001',true,(select id from chartofaccounts where glcode='4502101'),(select id from fund where code='01'),'Commissioner, KMC','RECEIPTS_PAYMENTS',1,1,now(),now(),0,null) ON CONFLICT DO NOTHING;

INSERT INTO bankaccount(id, branchid, accountnumber, accounttype, narration, isactive,glcodeid, fundid, payto, type, createdby, lastmodifiedby, createddate,lastmodifieddate, version, chequeformatid)
VALUES (nextval('seq_bankaccount'),(select id from bankbranch where branchcode='ICIC550'),'2042417454076','45021 - Nationalised Banks','PD Account-001',true,(select id from chartofaccounts where glcode='4502102'),(select id from fund where code='01'),'Commissioner, KMC','RECEIPTS_PAYMENTS',1,1,now(),now(),0,null) ON CONFLICT DO NOTHING;

----Deduction
INSERT INTO tds (id,type,glcodeid,isactive,lastmodifieddate,createddate,createdby,recoveryname,recovery_mode,remitted,description,partytypeid,version) values (nextval('seq_tds'),'CPF',(select id from chartofaccounts where glcode='3502003'),true,now(),now(),1,'CPF Deduction','M','Central Provident Fund Board','CPF Deduction',(select id from eg_partytype where code='Employee'),0) ON CONFLICT DO NOTHING;

INSERT INTO tds (id,type,glcodeid,isactive,lastmodifieddate,createddate,createdby,recoveryname,recovery_mode,remitted,description,partytypeid,version) values (nextval('seq_tds'),'TDS',(select id from chartofaccounts where glcode='3502001'),true,now(),now(),1,'TDS Deduction','M','Central Government','TDS Deduction',(select id from eg_partytype where code='Contractor'),0) ON CONFLICT DO NOTHING;

INSERT INTO tds (id,type,glcodeid,isactive,lastmodifieddate,createddate,createdby,recoveryname,recovery_mode,remitted,description,partytypeid,version) values (nextval('seq_tds'),'TDS Employees',(select id from chartofaccounts where glcode='3502008'),true,now(),now(),1,'TDS from Employees','M','Central Government','TDS from Employees',(select id from eg_partytype where code='Employee'),0) ON CONFLICT DO NOTHING;

INSERT INTO tds (id,type,glcodeid,isactive,lastmodifieddate,createddate,createdby,recoveryname,recovery_mode,remitted,description,partytypeid,version) values (nextval('seq_tds'),'TDSC',(select id from chartofaccounts where glcode='3502016'),true,now(),now(),1,'TDS - Contractors (Income Tax)','M','Central Government','TDS - Contractors (Income Tax)',(select id from eg_partytype where code='Contractor'),0) ON CONFLICT DO NOTHING;

INSERT INTO tds (id,type,glcodeid,isactive,lastmodifieddate,createddate,createdby,recoveryname,recovery_mode,remitted,description,partytypeid,version) values (nextval('seq_tds'),'GSTC',(select id from chartofaccounts where glcode='3502017'),true,now(),now(),1,'TDS on GST - Contractors ','M','Central Government','TDS on GST - Contractors ',(select id from eg_partytype where code='Contractor'),0) ON CONFLICT DO NOTHING;

INSERT INTO tds(id,type,glcodeid,isactive,lastmodifieddate,createddate,createdby,recoveryname,recovery_mode,remitted,description,partytypeid,version) values (nextval('seq_tds'),'TDS',(select id from chartofaccounts where glcode='3502001'),true,now(),now(),1,'TDS - Salary','M','Central Government','TDS - Salary',(select id from eg_partytype where code='Employee'),0) ON CONFLICT DO NOTHING;

INSERT INTO tds(id,type,glcodeid,isactive,lastmodifieddate,createddate,createdby,recoveryname,recovery_mode,remitted,description,partytypeid,version) values (nextval('seq_tds'),'LCC',(select id from chartofaccounts where glcode='3502018'),true,now(),now(),1,'Labour Cess','M','Central Government','Labour Cess',(select id from eg_partytype where code='Employee'),0) ON CONFLICT DO NOTHING;

INSERT INTO tds(id,type,glcodeid,isactive,lastmodifieddate,createddate,createdby,recoveryname,recovery_mode,remitted,description,partytypeid,version) values (nextval('seq_tds'),'TCS',(select id from chartofaccounts where glcode='3502034'),true,now(),now(),1,'Tax Collected at Source','M','Central Government','Tax Collected at Source',null,0) ON CONFLICT DO NOTHING;

-----Contractor
INSERT INTO egf_contractor(id, code,name, correspondenceaddress, paymentaddress, contactperson, email, narration, pannumber,tinnumber, bank, ifsccode, bankaccount,registrationnumber, status, createdby, lastmodifiedby, createddate,lastmodifieddate, version, mobilenumber, epfnumber, esinumber,gstregisteredstate)
 VALUES (nextval('SEQ_EGF_CONTRACTOR'),'PRE000142','Preetpal and Sons','#123 Sector 22 Chandighar','Sector 17, Chandigarh','Preetpal Singh','Preetpalxxyyzz@gmail.com',null,'CMBV4534M','22AAAAA0000A1Z5',(select id from bank where name='Punjab Gramin Bank'),'PUNB0309300','00002445789613','XYZ123',(select id from egw_status where code='Active' and moduletype='Contractor'),1,1,now(),now(),0,'9847591236',null,null,'22AAAAA0000A1Z5') ON CONFLICT DO NOTHING;

INSERT INTO egf_contractor(id, code,name, correspondenceaddress, paymentaddress,contactperson, email, narration, pannumber,tinnumber, bank, ifsccode, bankaccount,registrationnumber, status, createdby, lastmodifiedby, createddate,lastmodifieddate, version, mobilenumber, epfnumber, esinumber,gstregisteredstate)
VALUES (nextval('SEQ_EGF_CONTRACTOR'),'RAK00123','Rakesh','#62 5th main road ITPL Bangalore','#141/25 2nd Cross koramangala Bangalore','Rakesh','Rakesh@gmail.com',null,'AFRPN8746N','NIL',null,'ICIC0000007','541654656787','NIL',(select id from egw_status where code='Active' and moduletype='Contractor'),1,1,now(),now(),0,'9845198452',null,null,'NIL') ON CONFLICT DO NOTHING;

INSERT INTO egf_contractor(id, code,name, correspondenceaddress, paymentaddress, contactperson, email, narration, pannumber,tinnumber, bank, ifsccode, bankaccount,registrationnumber, status, createdby, lastmodifiedby, createddate,lastmodifieddate, version, mobilenumber, epfnumber, esinumber,gstregisteredstate)
VALUES (nextval('SEQ_EGF_CONTRACTOR'),'ABC00143','ABC Constructions','null','#1/1 8th Main JP Nagar Bangalore','Mahesh','contact@abcconstruction.com',null,'PNBQ7412B','22AAAAA0000A1Z6',null,'PUNB0309300','00002445789613','XYZ123',(select id from egw_status where code='Active' and moduletype='Contractor'),1,1,now(),now(),0,'9889887894',null,null,'22AAAAA0000A1Z5') ON CONFLICT DO NOTHING;

------Supplier
INSERT INTO egf_supplier(id, code, name, correspondenceaddress, paymentaddress, contactperson,email, narration, pannumber, tinnumber, mobilenumber, bank, ifsccode,bankaccount, registrationnumber, status, createdby, lastmodifiedby, createddate, lastmodifieddate, version, epfnumber, esinumber,gstregisteredstate)
VALUES (nextval('SEQ_EGF_SUPPLIER'),'ABZ123','Harpaal and Sons','#123 Sector 22 Chandighar','Sector 27, Chandigarh','Harpaal Singh','harpaalxyz@gmail.com',null,'CMBOS8521V','22AAAAA0000A1Z5','9845298412',(select id from bank where name='Punjab Gramin Bank'),'PUNB0309300','1457954263','974521236',(select id from egw_status where code='Active' and moduletype='Supplier'),1,1,now(),now(),0,null,null,'22AAAAA0000A1Z5') ON CONFLICT DO NOTHING;

INSERT INTO egf_supplier(id, code, name, correspondenceaddress, paymentaddress, contactperson,email, narration, pannumber, tinnumber, mobilenumber, bank, ifsccode,bankaccount, registrationnumber, status, createdby, lastmodifiedby, createddate, lastmodifieddate, version, epfnumber, esinumber,gstregisteredstate)
VALUES (nextval('SEQ_EGF_SUPPLIER'),'MAH871','Mahindra','null','1st Main Road Punjab','Mahi','Mahi@gmail.com',null,'AFRPB7415B','22AAA8A0000A1Z5','9845298412',null,' ICIC0000007','541654656787','47593145263',(select id from egw_status where code='Active' and moduletype='Supplier'),1,1,now(),now(),0,null,null,'22AAAAA0000A1Z5') ON CONFLICT DO NOTHING;

---------Scheme
INSERT INTO scheme(id, code, name, validfrom, validto, isactive, description, fundid,createddate, lastmodifieddate, createdby,lastmodifiedby) VALUES (nextval('seq_scheme'),'10','AMRUT','05/01/2018','06/01/2021',true,'Amrut',(select id from fund where code='02'),now(),now(),1,1) ON CONFLICT DO NOTHING;

INSERT INTO scheme(id, code, name, validfrom, validto, isactive, description, fundid,createddate, lastmodifieddate, createdby,lastmodifiedby) VALUES (nextval('seq_scheme'),'20','Swachh Bharat Mission','06/01/2017','07/01/2020',true,'Swachh Bharat Mission',(select id from fund where code='02'),now(),now(),1,1) ON CONFLICT DO NOTHING;

INSERT INTO scheme(id, code, name, validfrom, validto, isactive, description, fundid,createddate, lastmodifieddate, createdby,lastmodifiedby) VALUES (nextval('seq_scheme'),'30','Finance Commission','03/01/2016','03/04/2020',true,'Finance Commission',(select id from fund where code='01'),now(),now(),1,1) ON CONFLICT DO NOTHING;

INSERT INTO scheme(id, code, name, validfrom, validto, isactive, description, fundid,createddate, lastmodifieddate, createdby,lastmodifiedby) VALUES (nextval('seq_scheme'),'40','Housing for All','04/01/2016','03/03/2021',true,'Housing for All',(select id from fund where code='01'),now(),now(),1,1) ON CONFLICT DO NOTHING;;

-----Sub-Scheme
INSERT INTO sub_scheme(id, code,name,validfrom, validto, isactive, schemeid,initial_estimate_amount,createddate, createdby, lastmodifiedby,lastmodifieddate) VALUES (nextval('seq_sub_scheme'),'1003','Storm Water Drains','05/01/2018','06/01/2021',true,(select id from scheme where code='10'),2500000,now(),1,1,now()) ON CONFLICT DO NOTHING;

INSERT INTO sub_scheme(id, code,name,validfrom, validto, isactive, schemeid,initial_estimate_amount,createddate, createdby, lastmodifiedby,lastmodifieddate) VALUES (nextval('seq_sub_scheme'),'SBM02','Solid Waste Management- SWM','06/01/2017','07/01/2020',true,(select id from scheme where code='20'),1000000,now(),1,1,now()) ON CONFLICT DO NOTHING;

INSERT INTO sub_scheme(id, code,name,validfrom, validto, isactive, schemeid,initial_estimate_amount,createddate, createdby, lastmodifiedby,lastmodifieddate) VALUES (nextval('seq_sub_scheme'),'5001','Street Lights','03/01/2016','05/04/2019',true,(select id from scheme where code='30'),2000000,now(),1,1,now()) ON CONFLICT DO NOTHING;
