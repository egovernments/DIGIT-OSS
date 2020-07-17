INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='ADDITIONALREJECTIONREASONS'), 'ADDITIONALREJECTIONREASON-01', 'Additional Rejection Reasons', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITADDITIONALCONDITIONS'), 'PERMITADDITIONALCONDITION-01', 'Permit Additional Condition', 0, 1, now(), 1, now());