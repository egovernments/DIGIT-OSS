INSERT INTO financialyear (id, financialyear, startingdate, endingdate, isactive, createddate, lastmodifieddate,lastmodifiedby,createdby,version, isactiveforposting, isclosed, transferclosingbalance) 
SELECT nextval('seq_financialyear'), '2010-11', '01-Apr-2010', '31-Mar-2011', true, current_date, current_date, 1,1,0, true, false, false 
WHERE NOT EXISTS (SELECT 1 FROM financialyear WHERE financialyear='2010-11');

INSERT INTO fiscalperiod (id,name, startingdate, endingdate,isactiveforposting, isactive, createddate, lastmodifieddate,lastmodifiedby,createdby,version, financialyearid) 
SELECT nextval('seq_fiscalperiod'),'201011', '01-Apr-2010', '31-Mar-2011',true, true, current_date, current_date,1,1,0, (select id from financialyear where financialyear='2010-11') 
WHERE NOT EXISTS (SELECT 1 FROM fiscalperiod WHERE name='201011');


INSERT INTO financialyear (id, financialyear, startingdate, endingdate, isactive, createddate, lastmodifieddate,lastmodifiedby,createdby,version, isactiveforposting, isclosed, transferclosingbalance) 
SELECT nextval('seq_financialyear'), '2011-12', '01-Apr-2011', '31-Mar-2012', true, current_date, current_date, 1,1,0, true, false, false 
WHERE NOT EXISTS (SELECT 1 FROM financialyear WHERE financialyear='2011-12');

INSERT INTO fiscalperiod (id,name, startingdate, endingdate,isactiveforposting, isactive, createddate, lastmodifieddate,lastmodifiedby,createdby,version, financialyearid) 
SELECT nextval('seq_fiscalperiod'),'201112', '01-Apr-2011', '31-Mar-2012',true, true, current_date, current_date,1,1,0, (select id from financialyear where financialyear='2011-12') 
WHERE NOT EXISTS (SELECT 1 FROM fiscalperiod WHERE name='201112');

INSERT INTO financialyear (id, financialyear, startingdate, endingdate, isactive, createddate, lastmodifieddate,lastmodifiedby,createdby,version, isactiveforposting, isclosed, transferclosingbalance) 
SELECT nextval('seq_financialyear'), '2012-13', '01-Apr-2012', '31-Mar-2013', true, current_date, current_date, 1,1,0, true, false, false 
WHERE NOT EXISTS (SELECT 1 FROM financialyear WHERE financialyear='2012-13');

INSERT INTO fiscalperiod (id,name, startingdate, endingdate,isactiveforposting, isactive, createddate, lastmodifieddate,lastmodifiedby,createdby,version, financialyearid) 
SELECT nextval('seq_fiscalperiod'),'201213', '01-Apr-2012', '31-Mar-2013',true, true, current_date, current_date,1,1,0, (select id from financialyear where financialyear='2012-13') 
WHERE NOT EXISTS (SELECT 1 FROM fiscalperiod WHERE name='201213');

update fiscalperiod set  isactiveforposting=true where name='201718';
