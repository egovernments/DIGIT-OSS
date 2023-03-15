DELETE from eg_appconfig_values where key_id in (
select id from eg_appconfig where key_name in ('EDCR_DXF_PDF')
 and module= (select id from eg_module where name='Digit DCR'));