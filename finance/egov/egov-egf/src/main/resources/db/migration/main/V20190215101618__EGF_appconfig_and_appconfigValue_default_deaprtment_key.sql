
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
  'DEFAULT_DEPARTMENT_FOR_PAYMENT',
  'This key will be used to decide if a department needs to be defaulted in payment an cheque asignement. Keep department code which will be autoselected.',
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
  'DEPT_25',
  current_date,
  current_date,
  1,
  1,
  (select ac.id from eg_appconfig ac where ac.key_name = 'DEFAULT_DEPARTMENT_FOR_PAYMENT')
);
