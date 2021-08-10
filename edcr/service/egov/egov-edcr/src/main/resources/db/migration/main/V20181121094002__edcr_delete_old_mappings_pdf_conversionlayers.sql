DELETE from eg_appconfig_values where key_id in (
select id from eg_appconfig where key_name in ('EDCR_DXF_PDF',
'EDCR_SHEET',
'EDCR_SERVICE_PLAN',
'EDCR_PARKING_PLAN',
'EDCR_SITE_PLAN',
'EDCR_SECTION',
'EDCR_ELEVATION',
'EDCR_FLOOR_PLAN'
) and module= (select id from eg_module where name='Digit DCR'));

DELETE from eg_appconfig where key_name in (
'EDCR_SHEET',
'EDCR_SERVICE_PLAN',
'EDCR_PARKING_PLAN',
'EDCR_SITE_PLAN',
'EDCR_SECTION',
'EDCR_ELEVATION',
'EDCR_FLOOR_PLAN'
) and  module= (select id from eg_module where name='Digit DCR');
