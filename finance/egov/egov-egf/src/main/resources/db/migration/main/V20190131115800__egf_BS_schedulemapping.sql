update chartofaccounts set scheduleid=null where scheduleid in(select id from schedulemapping where reporttype='BS');
delete from schedulemapping where reporttype='BS';

insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-01','Fund Balance',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-02','EARMARKED FUNDS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-03','RESERVE',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-04','GRANTS, CONTRIBUTION FOR SPECIFIC PURPOSES',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-05','SECURED LOANS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-06','UNSECURED LOANS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-07','DEPOSITS RECEIVED',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-08','DEPOSIT WORKS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-09','OTHER LIABILITIES',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-10','PROVISIONS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-11','FIXED ASSETS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-12','ACCUMULATED DEPRECIATION',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-13','CAPITAL WORK IN PROGRESS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-14','INVESTMENT GENERAL FUND',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-15','INVESTMENT OTHER FUNDS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-16','STOCK IN HAND',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-17','SUNDRY DEBTORS (RECEIVABLES)',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-18','ACCUMULATED PROVISIONS AGANIST DEBTORS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-19','CASH AND BANK BALANCES',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-20','LOANS, ADVANCES  AND  DEPOSITS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-21','ACCUMULATED PROVISONS AGAINST LOANS, ADVANCES  AND  DEPOSITS',1,current_date);
insert into schedulemapping(id,reporttype,schedule,schedulename,createdby,createddate) values(nextval('seq_schedulemapping'),'BS','B-22','EXPENDITURE AGAINST GRANTS THE RECIEVED',1,current_date);

