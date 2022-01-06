ALTER TABLE egcl_receiptheader_v1 ALTER COLUMN receipttype TYPE character varying(256), ALTER COLUMN businessdetails TYPE character varying(256);

ALTER TABLE egcl_receiptheader_v1_history ALTER COLUMN receipttype TYPE character varying(256), ALTER COLUMN businessdetails TYPE character varying(256);