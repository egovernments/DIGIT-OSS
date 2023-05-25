ALTER TABLE egcl_receiptheader_v1 alter column businessdetails TYPE character varying(500);
ALTER TABLE egcl_receiptheader_v1 alter column receipttype TYPE character varying(500);	

ALTER TABLE egcl_receiptheader_v1_history alter column businessdetails TYPE character varying(500);
ALTER TABLE egcl_receiptheader_v1_history alter column receipttype TYPE character varying(500);	