ALTER TABLE egcl_paymentDetail_audit ADD COLUMN receiptdate BIGINT;
ALTER TABLE egcl_paymentDetail_audit ADD COLUMN receipttype character varying(256);