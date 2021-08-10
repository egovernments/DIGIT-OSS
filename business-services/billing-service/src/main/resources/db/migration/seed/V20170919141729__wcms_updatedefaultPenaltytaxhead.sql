

update egbs_taxheadmaster set code='WATERCHARGEPENALTY' where tenantid='default' and service='WC' and code='PENALTY';


update egbs_glcodemaster set taxhead='WATERCHARGEPENALTY' where tenantid='default' and service='WC' and taxhead='PENALTY';


update egbs_glcodemaster  set fromdate=1143849600000 where service='WC' and taxhead='WATERCHARGEPENALTY'  and tenantid='default' ;


update egbs_taxheadmaster  set validfrom=1143849600000 where service='WC' and code='WATERCHARGEPENALTY' and tenantid='default' ;