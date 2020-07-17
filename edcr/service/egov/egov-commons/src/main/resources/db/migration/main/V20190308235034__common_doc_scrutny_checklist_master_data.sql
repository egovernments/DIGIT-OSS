INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate)
    VALUES (nextval('seq_eg_checklist_type'), 'PERMITDOCSCRTNY', 'Permit application document scrutiny checklist', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITDOCSCRTNY'), 'PERMITDOCSCRTNY-01', 'Details of neighbouring land owners', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITDOCSCRTNY'), 'PERMITDOCSCRTNY-02', 'Whether respective details in various documents are matching', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITDOCSCRTNY'), 'PERMITDOCSCRTNY-03', 'Whether all required documents attached', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITDOCSCRTNY'), 'PERMITDOCSCRTNY-04', 'Whether all pages of documents attached', 0, 1, now(), 1, now());


INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate)
    VALUES (nextval('seq_eg_checklist_type'), 'OCDOCSCRTNY', 'Occupancy certificate application document scrutiny checklist', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDOCSCRTNY'), 'OCDOCSCRTNY-01', 'Details of neighbouring land owners', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDOCSCRTNY'), 'OCDOCSCRTNY-02', 'Whether respective details in various documents are matching', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDOCSCRTNY'), 'OCDOCSCRTNY-03', 'Whether all required documents attached', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDOCSCRTNY'), 'OCDOCSCRTNY-04', 'Whether all pages of documents attached', 0, 1, now(), 1, now());