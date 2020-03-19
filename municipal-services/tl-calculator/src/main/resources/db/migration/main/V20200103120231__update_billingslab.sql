alter table eg_tl_billingslab add applicationtype character varying;

update eg_tl_billingslab set applicationtype='NEW' where applicationtype='';
