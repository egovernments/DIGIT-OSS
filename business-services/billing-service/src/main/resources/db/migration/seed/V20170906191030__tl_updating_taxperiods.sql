--Updating Tax periods entry
UPDATE egbs_taxperiod SET fromdate = 1301549400000, todate = 1333132200000 where code = 'TL201112' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = 1333171800000, todate = 1364668200000 where code = 'TL201213' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = 1364707800000, todate = 1396204200000 where code = 'TL201314' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = 1396243800000, todate = 1427740200000 where code = 'TL201415' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = 1427779800000, todate = 1459362600000 where code = 'TL201516' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = 1459402200000, todate = 1490898600000 where code = 'TL201617' and tenantid = 'default';
UPDATE egbs_taxperiod SET fromdate = 1490938200000, todate = 1522434600000 where code = 'TL201718' and tenantid = 'default';

UPDATE egbs_taxheadmaster SET validfrom = 1301549400000, validtill = 1522434600000 where code = 'NEWTRADELICENSEFEE' and tenantid = 'default';

UPDATE egbs_glcodemaster SET fromdate = 1301549400000, todate = 1522434600000 where taxhead = 'NEWTRADELICENSEFEE' and tenantid = 'default';