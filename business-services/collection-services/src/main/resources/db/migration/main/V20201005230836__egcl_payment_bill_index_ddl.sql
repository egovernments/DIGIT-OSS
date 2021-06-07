CREATE index if not exists idx_egcl_billaccountdetail_billdetailid ON egcl_billaccountdetail USING btree (billdetailid);
CREATE index if not exists idx_egcl_billdetial_billdetail_billid ON egcl_billdetial USING btree (billid);
CREATE index if not exists idx_egcl_paymentdetail_paymentid ON egcl_paymentdetail USING btree (paymentid);
