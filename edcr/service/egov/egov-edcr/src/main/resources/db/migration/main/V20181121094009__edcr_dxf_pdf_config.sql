
--SITE PLAN
INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'SITE_PLAN',0);


--SERVICE PLAN
INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'SERVICE_PLAN',0);

--PARKING PLAN
INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'PARKING_PLAN',0);

--FLOOR PLAN
INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'FLOOR_PLAN_*',0);

--ROOF PLAN
INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'ROOF_PLAN_*',0);

--ELEVATION
INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'ELEVATION_*',0);

--SECTION
INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'SECTION_*',0);

--DETAILS
INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_DXF_PDF' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'DETAILS_*',0);


