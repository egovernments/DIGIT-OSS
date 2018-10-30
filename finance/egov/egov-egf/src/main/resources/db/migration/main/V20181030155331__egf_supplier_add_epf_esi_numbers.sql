update egf_supplier set esinumber = null;
update egf_supplier set epfnumber = null;

ALTER TABLE egf_supplier ALTER COLUMN epfnumber TYPE varchar(24);
ALTER TABLE egf_supplier ALTER COLUMN esinumber TYPE varchar(21);