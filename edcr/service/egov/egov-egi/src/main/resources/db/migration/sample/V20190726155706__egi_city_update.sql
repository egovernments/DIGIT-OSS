update eg_city set domainurl=(CASE WHEN (select current_schema()) = 'state' THEN 'state.egovernments.org' ELSE 'ulb.egovernments.org' END);
update eg_city set name=(CASE WHEN (select current_schema()) = 'state' THEN 'eGov Municipal Corporation' ELSE 'Digit Municipal Corporation' END);
update eg_city set localname=(CASE WHEN (select current_schema()) = 'state' THEN 'state' ELSE 'ulb' END);
update eg_city set districtcode=(CASE WHEN (select current_schema()) = 'state' THEN '001' ELSE '002' END);
update eg_city set code=(CASE WHEN (select current_schema()) = 'state' THEN '0001' ELSE '0002' END);
update eg_city set districtname='eGov';
update eg_citypreferences set municipalityname=(CASE WHEN (select current_schema()) = 'state' THEN 'eGov Municipal Corporation' ELSE 'Digit Municipal Corporation' END);