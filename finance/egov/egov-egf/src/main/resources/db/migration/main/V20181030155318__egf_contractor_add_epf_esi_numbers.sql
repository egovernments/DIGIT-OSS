update egf_contractor set esinumber = null;
update egf_contractor set epfnumber = null;

ALTER TABLE egf_contractor ALTER COLUMN epfnumber TYPE varchar(24);
ALTER TABLE egf_contractor ALTER COLUMN esinumber TYPE varchar(21);