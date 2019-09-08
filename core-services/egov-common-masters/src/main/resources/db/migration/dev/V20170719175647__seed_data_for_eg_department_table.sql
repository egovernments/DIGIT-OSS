SELECT setval('seq_eg_department', nextval('seq_eg_department'), true);

INSERT INTO eg_department (id, name, code, active, tenantid) VALUES (nextval('seq_eg_department'), 'TOWN PLANNING', 'TP', true, 'default');
INSERT INTO eg_department (id, name, code, active, tenantid) VALUES (nextval('seq_eg_department'), 'REVENUE', 'REV', true, 'default');
INSERT INTO eg_department (id, name, code, active, tenantid) VALUES (nextval('seq_eg_department'), 'PUBLIC HEALTH AND SANITATION', 'PHS', true, 'default');
INSERT INTO eg_department (id, name, code, active, tenantid) VALUES (nextval('seq_eg_department'), 'URBAN POVERTY ALLEVIATION', 'UPA', true, 'default');
INSERT INTO eg_department (id, name, code, active, tenantid) VALUES (nextval('seq_eg_department'), 'EDUCATION', 'EDU', true, 'default');