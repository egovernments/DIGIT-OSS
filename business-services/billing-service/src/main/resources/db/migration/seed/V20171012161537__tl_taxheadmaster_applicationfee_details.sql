update egbs_taxheadmaster set code='TLAPPLNFEE' where code='NEWTRADEAPPLICATIONFEE' and tenantid='default';

update egbs_glcodemaster set taxhead='TLAPPLNFEE' where taxhead='NEWTRADEAPPLICATIONFEE' and tenantid='default';