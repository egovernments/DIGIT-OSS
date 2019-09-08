delete from eg_roleaction where actionid in(select id from eg_action where parentmodule ='PGR')
and rolecode='EMPLOYEE' and tenantid='panavel';