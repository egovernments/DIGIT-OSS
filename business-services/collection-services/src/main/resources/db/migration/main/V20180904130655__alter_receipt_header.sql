ALTER TABLE "egcl_receiptheader"
ADD COLUMN "collectedamount" NUMERIC(12,2) DEFAULT NULL,
ADD COLUMN "manualreceiptdate"  BIGINT;
