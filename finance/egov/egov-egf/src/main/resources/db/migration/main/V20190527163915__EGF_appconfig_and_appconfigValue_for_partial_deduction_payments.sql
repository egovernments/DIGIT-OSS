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
  'PARTIAL_DEDUCTION_PAYMENT_ENABLED',
  'This key will be used to decide whether partial payment will be allowed for dedcution payments or not. Keep value Yes for enable and No for disable.',
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
  'No',
  current_date,
  current_date,
  1,
  1,
  (select ac.id from eg_appconfig ac where ac.key_name = 'PARTIAL_DEDUCTION_PAYMENT_ENABLED')
);
