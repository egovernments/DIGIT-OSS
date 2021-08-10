
INSERT INTO eg_appconfig
(
  id,
  key_name,
  description,
  module
)
VALUES
(
  nextval('SEQ_EG_APPCONFIG'),
  'DEFAULT_AUTO_POPULATE_CURR_DATE',
  'This key will be used to decide if a date needs to be defaulted with today date. Keep value Y for enable and N for disable.',
  (select id from eg_module mo where mo.name = 'EGF')
);

INSERT INTO eg_appconfig_values
(
  id,
  effective_from,
  value,
  createddate,
  lastmodifieddate,
  createdby,
  lastmodifiedby,
  key_id
)
VALUES
(
  nextval('SEQ_EG_APPCONFIG_VALUES'),
  current_date,
  'Y',
  current_date,
  current_date,
  1,
  1,
  (select ac.id from eg_appconfig ac where ac.key_name = 'DEFAULT_AUTO_POPULATE_CURR_DATE')
);
