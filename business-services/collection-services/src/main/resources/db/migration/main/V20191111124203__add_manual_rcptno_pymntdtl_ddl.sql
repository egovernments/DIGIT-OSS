ALTER TABLE egcl_paymentDetail ADD COLUMN manualreceiptnumber varchar(256);
ALTER TABLE egcl_paymentDetail_audit ADD COLUMN manualreceiptnumber varchar(256);

ALTER TABLE egcl_billdetial DROP COLUMN manualReceiptNumber;
ALTER TABLE egcl_billdetial_audit DROP COLUMN manualReceiptNumber;