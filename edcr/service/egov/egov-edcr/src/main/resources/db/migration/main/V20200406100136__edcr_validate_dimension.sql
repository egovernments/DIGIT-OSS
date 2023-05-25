INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE )
VALUES (nextval('SEQ_EG_APPCONFIG'), 'EDCR_STRICTLY_VALIDATE_DIMENSION', 'Dimension in dxf to be strictly validated',0,
(select id from eg_module where name='Digit DCR'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_STRICTLY_VALIDATE_DIMENSION' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'NO',0);