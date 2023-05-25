INSERT INTO financialyear (id, financialyear, startingdate, endingdate, isactive, createddate, lastmodifieddate,lastmodifiedby,createdby,version, isactiveforposting, isclosed, transferclosingbalance) 
SELECT nextval('seq_financialyear'), '2017-18', '01-Apr-2017', '31-Mar-2018', true, current_date, current_date, 1,1,0, false, false, false 
WHERE NOT EXISTS (SELECT 1 FROM financialyear WHERE financialyear='2017-18');

INSERT INTO fiscalperiod (id,name, startingdate, endingdate,isactiveforposting, isactive, createddate, lastmodifieddate,lastmodifiedby,createdby,version, financialyearid) 
SELECT nextval('seq_fiscalperiod'),'201718', '01-Apr-2017', '31-Mar-2018',false, true, current_date, current_date,1,1,0, (select id from financialyear where financialyear='2017-18') 
WHERE NOT EXISTS (SELECT 1 FROM fiscalperiod WHERE name='201718');
