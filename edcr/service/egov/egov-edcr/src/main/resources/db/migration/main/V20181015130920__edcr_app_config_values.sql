--FLOOR PLAN
INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE )
VALUES (nextval('SEQ_EG_APPCONFIG'), 'EDCR_FLOOR_PLAN', 'Edcr floor plan layers',0,
(select id from eg_module where name='Digit DCR'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_FLOOR_PLAN' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'FLOOR_PLAN_*',0);

--ELEVATION
INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE )
VALUES (nextval('SEQ_EG_APPCONFIG'), 'EDCR_ELEVATION', 'Edcr elevation layers',0,
(select id from eg_module where name='Digit DCR'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_ELEVATION' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'ELEVATION_*',0);

--SECTION
INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE )
VALUES (nextval('SEQ_EG_APPCONFIG'), 'EDCR_SECTION', 'Edcr section layers',0,
(select id from eg_module where name='Digit DCR'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_SECTION' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'SECTION_*',0);

--SITE PLAN
INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE )
VALUES (nextval('SEQ_EG_APPCONFIG'), 'EDCR_SITE_PLAN', 'Edcr site plan layer',0,
(select id from eg_module where name='Digit DCR'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_SITE_PLAN' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'SITE_PLAN',0);

--PARKING PLAN
INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE )
VALUES (nextval('SEQ_EG_APPCONFIG'), 'EDCR_PARKING_PLAN', 'Edcr parking plan layer',0,
(select id from eg_module where name='Digit DCR'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_PARKING_PLAN' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'PARKING_PLAN',0);

--SERVICE PLAN
INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE )
VALUES (nextval('SEQ_EG_APPCONFIG'), 'EDCR_SERVICE_PLAN', 'Edcr service plan layer',0,
(select id from eg_module where name='Digit DCR'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION )
VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (
SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='EDCR_SERVICE_PLAN' and module= (select id from eg_module where name='Digit DCR')),
current_date, 'SERVICE_PLAN',0);

