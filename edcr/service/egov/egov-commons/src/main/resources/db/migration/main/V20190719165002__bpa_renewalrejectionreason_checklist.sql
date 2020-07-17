
INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_checklist_type'), 'RENEWALREJECTIONREASONS', 'Renewal Rejection Reasons', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='RENEWALREJECTIONREASONS'), 'RENEWALREJECTIONREASON-01', 'The work or use of the site for the work or particulars comprised in the site plan, ground plan, elevation, sections, or specifications would contravene provisions of law or order, rule, declaration or bye law made under such law.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='RENEWALREJECTIONREASONS'), 'RENEWALREJECTIONREASON-02', 'The application does not contain the particulars or is not prepared in the manner required by the rules or bye law made under the Act.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='RENEWALREJECTIONREASONS'), 'RENEWALREJECTIONREASON-03', 'The documents required to be signed by a registered Architect, Engineer, Town planner or Supervisor or the owner/applicant as required under the Act or the rules or bye laws made under the Act has not been signed by such Architect, Engineer, Town planner or Supervisor or the owner/applicant.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='RENEWALREJECTIONREASONS'), 'RENEWALREJECTIONREASON-04', 'Information or document or certificate required by the Secretary under the rules or bye laws made under the Act has not been duly furnished.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='RENEWALREJECTIONREASONS'), 'RENEWALREJECTIONREASON-05', 'The owner of the land has not laid down and made street or streets or road or roads giving access to the site or sites connecting with an existing public or private street while utilizing, selling or leasing out or otherwise disposing of the land or any portion or portions of the same site for construction of building,provided that the site abuts on any existing public or private street no such street or road shall be laid down or made.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='RENEWALREJECTIONREASONS'), 'RENEWALREJECTIONREASON-06', 'The proposed building would be an encroachment upon a land belonging to the Government or the Municipality.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='RENEWALREJECTIONREASONS'), 'RENEWALREJECTIONREASON-07', 'The land is under acquisition proceedings.', 0, 1, now(), 1, now());
