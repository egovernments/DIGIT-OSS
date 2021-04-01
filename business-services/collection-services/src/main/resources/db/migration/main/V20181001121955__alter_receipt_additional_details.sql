ALTER TABLE egcl_receiptheader ADD COLUMN additionalDetails JSONB;
ALTER TABLE egcl_receiptdetails ADD COLUMN additionalDetails JSONB;
ALTER TABLE egcl_instrumentheader ADD COLUMN additionalDetails JSONB;

ALTER TABLE egcl_receiptheader ADD COLUMN payeemobile varchar(50);

ALTER TABLE egcl_receiptheader ALTER COLUMN transactionid TYPE varchar(50);

ALTER TABLE egcl_instrumentheader ADD COLUMN instrumentDate BIGINT;
ALTER TABLE egcl_instrumentheader ADD COLUMN instrumentNumber varchar(50);