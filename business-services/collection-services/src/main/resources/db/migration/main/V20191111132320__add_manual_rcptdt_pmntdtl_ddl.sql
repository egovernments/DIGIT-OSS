ALTER TABLE egcl_paymentDetail ADD COLUMN manualreceiptdate BIGINT;
ALTER TABLE egcl_paymentDetail_audit ADD COLUMN manualreceiptdate BIGINT;

ALTER TABLE egcl_billdetial DROP COLUMN manualReceiptDate;
ALTER TABLE egcl_billdetial_audit DROP COLUMN manualReceiptDate;