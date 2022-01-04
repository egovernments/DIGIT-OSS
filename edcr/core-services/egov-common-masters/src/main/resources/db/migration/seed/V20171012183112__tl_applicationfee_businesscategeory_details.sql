update eg_businessdetails set businesscategory=(select id from eg_businesscategory where code='TRADELICENSE' 
  and tenantid='default') where code='TLAPPLNFEE' and tenantid='default';
delete from eg_businesscategory where code='TLAPPLNFEE' and tenantid='default';