ALTER TABLE egbs_bill ADD COLUMN mobilenumber character varying(20);

ALTER TABLE egbs_billdetail ADD COLUMN receiptdate bigint, ADD COLUMN receiptnumber character varying(256);
