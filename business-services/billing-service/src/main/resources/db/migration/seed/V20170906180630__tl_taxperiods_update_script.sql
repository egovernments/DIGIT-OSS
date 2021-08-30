--Updating Tax periods entry
UPDATE egbs_taxperiod SET fromdate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2011-04-01')), todate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2012-03-31')) where code = 'TL201112' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2012-04-01')), todate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2013-03-31')) where code = 'TL201213' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2013-04-01')), todate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2014-03-31')) where code = 'TL201314' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2014-04-01')), todate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2015-03-31')) where code = 'TL201415' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2015-04-01')), todate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2016-03-31')) where code = 'TL201516' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2016-04-01')), todate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-03-31')) where code = 'TL201617' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2017-04-01')), todate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')) where code = 'TL201718' and tenantid = 'default';

UPDATE egbs_taxheadmaster SET validfrom = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2011-04-01')), validtill = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')) where code = 'NEWTRADELICENSEFEE' and tenantid = 'default';

UPDATE egbs_glcodemaster SET fromdate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2011-04-01')), todate = (SELECT EXTRACT(EPOCH FROM TIMESTAMP  '2018-03-31')) where taxhead = 'NEWTRADELICENSEFEE' and tenantid = 'default';