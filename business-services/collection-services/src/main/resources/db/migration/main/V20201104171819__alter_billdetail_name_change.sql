ALTER table egcl_billaccountdetail DROP CONSTRAINT fk_egcl_payment_taxhead;

ALTER TABLE egcl_billdetial RENAME TO egcl_billdetail;

ALTER TABLE egcl_billaccountdetail ADD CONSTRAINT fk_egcl_payment_taxhead FOREIGN KEY (billDetailid) REFERENCES egcl_billdetail(id);

ALTER TABLE egcl_billdetial_audit RENAME TO egcl_billdetail_audit;

