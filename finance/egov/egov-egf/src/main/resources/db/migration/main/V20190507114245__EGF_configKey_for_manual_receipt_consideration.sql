
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
  'IsManualReceiptDateConsideredForVoucher',
  'Set Value as Yes/No, If Value is Yes then manual date will be considered from receipt otherwise the system date will be considered as default.',
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
  'Yes',
  current_date,
  current_date,
  1,
  1,
  (select ac.id from eg_appconfig ac where ac.key_name = 'IsManualReceiptDateConsideredForVoucher')
);
