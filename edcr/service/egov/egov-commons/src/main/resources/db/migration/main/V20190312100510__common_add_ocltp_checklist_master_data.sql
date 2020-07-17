update eg_checklist set description='Other documents' where code='OCLTPDOC-03';
update eg_checklist set description='Completion certificate in prescribed format duly signed/ authenticated' where code='OCLTPDOC-04';
update eg_checklist set description='Copy of land deed document' where code='OCLTPDOC-05';
update eg_checklist set description='Title deed of the property' where code='OCLTPDOC-06';
update eg_checklist set description='Specification report' where code='OCLTPDOC-07';
update eg_checklist set description='Building tax receipt' where code='OCLTPDOC-08';

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-09', 'Layout approval copy', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-10', 'Location sketch / Village sketch', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-11', 'Others', 0, 1, now(), 1, now());
