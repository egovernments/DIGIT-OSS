CREATE index if not exists idx_egbs_billdetail_v1_billid ON egbs_billdetail_v1 USING btree (billid);
CREATE index if not exists idx_egbs_billaccountdetail_v1_billdetail ON egbs_billaccountdetail_v1 USING btree (billdetail);
