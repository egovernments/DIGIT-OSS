--DXF TO PDF CONVERSION LAYERS
INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE )
VALUES (nextval('SEQ_EG_APPCONFIG'), 'EDCR_DXF_PDF', 'Edcr Dxf to pdf conversion layers',0,
(select id from eg_module where name='Digit DCR'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'SHEET_*',0);