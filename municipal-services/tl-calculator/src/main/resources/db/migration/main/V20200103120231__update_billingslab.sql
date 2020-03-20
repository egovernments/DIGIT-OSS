alter table eg_tl_billingslab  ADD COLUMN IF NOT EXISTS applicationtype character varying;

update eg_tl_billingslab set applicationtype='NEW' where applicationtype='';
