delete from eg_roleaction where actionid in(select id from eg_action where name='Get all CompaintTypeCategory' and url='/pgr/complaintTypeCategories/_search')
and tenantid='panavel';