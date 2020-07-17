--------------------------------OWNERSHIPDOCUMENTS------------------------------------------------------

INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate)
    VALUES (nextval('seq_eg_checklist_type'), 'OWNERSHIPDOCUMENTS', 'Ownership Transfer Documents', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPDOCUMENTS'), 'OWNERDOC-01', 'Application duly signed by the owner', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPDOCUMENTS'), 'OWNERDOC-02', 'New land deed document', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPDOCUMENTS'), 'OWNERDOC-03', 'New Possession certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPDOCUMENTS'), 'OWNERDOC-04', 'New Land tax receipt', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPDOCUMENTS'), 'OWNERDOC-05', 'Building permit', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPDOCUMENTS'), 'OWNERDOC-06', 'Stage Photos', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPDOCUMENTS'), 'OWNERDOC-07', 'Other', 0, 1, now(), 1, now());



-------------------------------------------------------OWNERSHIPREJECTIONREASONS--------------------------------------------------------------

INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_checklist_type'), 'OWNERSHIPREJECTIONREASONS', 'Ownership Transfer Rejection Reasons', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPREJECTIONREASONS'), 'OWNERSHIPTRANSFERREJECTIONREASON-01', 'The work or use of the site for the work or particulars comprised in the site plan, ground plan, elevation, sections, or specifications would contravene provisions of law or order, rule, declaration or bye law made under such law.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPREJECTIONREASONS'), 'OWNERSHIPTRANSFERREJECTIONREASON-02', 'The application does not contain the particulars or is not prepared in the manner required by the rules or bye law made under the Act.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPREJECTIONREASONS'), 'OWNERSHIPTRANSFERREJECTIONREASON-03', 'The documents required to be signed by a registered Architect, Engineer, Town planner or Supervisor or the owner/applicant as required under the Act or the rules or bye laws made under the Act has not been signed by such Architect, Engineer, Town planner or Supervisor or the owner/applicant.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPREJECTIONREASONS'), 'OWNERSHIPTRANSFERREJECTIONREASON-04', 'Information or document or certificate required by the Secretary under the rules or bye laws made under the Act has not been duly furnished.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPREJECTIONREASONS'), 'OWNERSHIPTRANSFERREJECTIONREASON-05', 'The owner of the land has not laid down and made street or streets or road or roads giving access to the site or sites connecting with an existing public or private street while utilizing, selling or leasing out or otherwise disposing of the land or any portion or portions of the same site for construction of building,provided that the site abuts on any existing public or private street no such street or road shall be laid down or made.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPREJECTIONREASONS'), 'OWNERSHIPTRANSFERREJECTIONREASON-06', 'The proposed building would be an encroachment upon a land belonging to the Government or the Municipality.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OWNERSHIPREJECTIONREASONS'), 'OWNERSHIPTRANSFERREJECTIONREASON-07', 'The land is under acquisition proceedings.', 0, 1, now(), 1, now());

