insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'EGF Bill Creator','EGF-BILL_CREATOR','Employee who creates Bills mainly expense bill',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'EGF Bill Approver','EGF-BILL_APPROVER','Employee who takes part in  Bills  approval mainly expense bill',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Voucher Creator','EGF-VOUCHER_CREATOR','One who can create a voucher',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Voucher Approver','EGF-VOUCHER_APPROVER','One who can approve a voucher',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Payment Creator','EGF-PAYMENT_CREATOR','One who can create payment',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Payment Approver','EGF-PAYMENT_APPROVER','One who can approve a payment',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Master Admin','EGF-MASTER_ADMIN','One who is the administrator for all master data in Finance',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Finance Report View','EGF-REPORT_VIEW','One who has acess to all financial reports',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Collections Receipt Creator','COLL_RECEIPT_CREATOR','One who can create and approve a receipt and receipt voucher',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;

insert into eg_role (id,name,code,description,createddate,createdby,lastmodifiedby,lastmodifieddate,version,tenantid)values
(nextval('SEQ_EG_ROLE'),'Collections Remitter','COLL_REMIT_TO_BANK','One who can remit the instruments to bank',now(),1,1,now(),0,'pb.phagwara')
ON CONFLICT (code, tenantid) DO NOTHING;
