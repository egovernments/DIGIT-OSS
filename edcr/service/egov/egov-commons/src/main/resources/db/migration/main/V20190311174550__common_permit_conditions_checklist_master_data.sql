INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_checklist_type'), 'PERMITNOCCONDITIONS', 'Permit NOC Conditions', 0, 1, now(), 1, now());
INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_checklist_type'), 'PERMITGENERALCONDITIONS', 'Permit General Conditions', 0, 1, now(), 1, now());
INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_checklist_type'), 'PERMITREJECTIONREASONS', 'Permit Rejection Reasons', 0, 1, now(), 1, now());
INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_checklist_type'), 'OCREJECTIONREASONS', 'Occupancy Certificate Rejection Reasons', 0, 1, now(), 1, now());
INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_checklist_type'), 'PERMITADDITIONALCONDITIONS', 'Permit Additional Conditions', 0, 1, now(), 1, now()); 
INSERT INTO eg_checklist_type(id, code, description, version, createdby, createddate,lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_checklist_type'), 'ADDITIONALREJECTIONREASONS', 'Rejection Additional Reasons', 0, 1, now(), 1, now()); 


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-01', 'Permit issued based on the Approval Certificate of  PCB as per the Order No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-02', 'Permit issued based on the Approval Certificate of Fire & Rescue Service as per the Order No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-03', 'Permit issued based on the Approval Certificate of Ministry of Environment & Forests as per the Order No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-04', 'Permit issued based on the concurrence of CTP vide No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-05', 'Permit issued based on the Approval Certificate of Railway Department as per the Order No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-06', 'Permit issued based on the Approval Certificate of Defence Department as per the Order No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-07', 'Permit issued based on the concurrence of Art & Heritage Commission vide No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-08', 'Permit issued based on the concurrence of KCZMA vide No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-09', 'Permit issued based on the Approval Certificate of DMRC/Light Metro Project as per the Order No.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITNOCCONDITIONS'), 'PERMITNOCCONDITION-10', 'Permit issued based on the Approval Certificate of National Highway Authority as per the Order.', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-01', 'Adequate safety precaution shall be provided at all stage of construction for safe guarding the life of workers public any hazards.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-02', 'The work shall be carried out strictly following the KMBR provision under the supervision of a qualified engineer as per the plans. The name and address of engineer having supervision over the construction shall be informed in advance.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-03', 'The owner shall be responsible for the structural stability and other safety of the building.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-04', 'Arrangement should be there to dispose the solid ans liquid waste from the propoed building inside the owners site itself and it should not be diverted to any public place drain or public place.A drawing showing the treatment plant proposed shall be submitted in advance.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-05', 'Rain water harvesting tank,solar heating and lighting shall be provided as per KMBR.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-06', 'Recreation space shall be ear marked.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-07', 'No over hanging in open space shall be provided.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-08', 'No construction shall be made in road widening area.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-09', 'Pipe composting /biogas plants/vermi composting etc.. anyone of these should be provided with appropriate technique at the time of completion of building, for processing organic waste at source itself.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-10', 'Owner shall arrange all safety measures at site and inform this to office before starting work', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-11', 'Disabled persons  entries shall be made as per KMBR', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-12', 'Sewage and solid waste disposal arrangements shall be made scientifically.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-13', 'The Plan and Permit shall be exhibited infront of construction site itself for inspection purpose.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-14', 'For the development, that happens and warrants tree to be cut, at least same number of trees shall be planted, maintained and brought up with in the plot in the immediate vicinity of the development.', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITREJECTIONREASONS'), 'PERMITREJECTIONREASON-01', 'The work or use of the site for the work or particulars comprised in the site plan, ground plan, elevation, sections, or specifications would contravene provisions of law or order, rule, declaration or bye law made under such law.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITREJECTIONREASONS'), 'PERMITREJECTIONREASON-02', 'The application does not contain the particulars or is not prepared in the manner required by the rules or bye law made under the Act.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITREJECTIONREASONS'), 'PERMITREJECTIONREASON-03', 'The documents required to be signed by a registered Architect, Engineer, Town planner or Supervisor or the owner/applicant as required under the Act or the rules or bye laws made under the Act has not been signed by such Architect, Engineer, Town planner or Supervisor or the owner/applicant.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITREJECTIONREASONS'), 'PERMITREJECTIONREASON-04', 'Information or document or certificate required by the Secretary under the rules or bye laws made under the Act has not been duly furnished.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITREJECTIONREASONS'), 'PERMITREJECTIONREASON-05', 'The owner of the land has not laid down and made street or streets or road or roads giving access to the site or sites connecting with an existing public or private street while utilizing, selling or leasing out or otherwise disposing of the land or any portion or portions of the same site for construction of building,provided that the site abuts on any existing public or private street no such street or road shall be laid down or made.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITREJECTIONREASONS'), 'PERMITREJECTIONREASON-06', 'The proposed building would be an encroachment upon a land belonging to the Government or the Municipality.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITREJECTIONREASONS'), 'PERMITREJECTIONREASON-07', 'The land is under acquisition proceedings.', 0, 1, now(), 1, now());
  

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCREJECTIONREASONS'), 'OCREJECTIONREASON-01', 'The constructed building is in contradiction to any of the provisions of any of the law or order, rule, declaration or bye laws applicable.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCREJECTIONREASONS'), 'OCREJECTIONREASON-02', 'The application for occupancy certificate does not contain the particulars or is not prepared in the manner required by these rules or bye law made under the acts concerned.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCREJECTIONREASONS'), 'OCREJECTIONREASON-03', 'Any of the documents submitted do not conforms to the qualification requirements of the Architect, Engineer, Town Planner or supervisor or the owner/ applicant as required by the rule or byelaws concerned.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCREJECTIONREASONS'), 'OCREJECTIONREASON-04', 'Any information or document or certificate as required by the permit approval system/ rule/ byelaws related has not been submitted properly or incorporated in an incorrect manner.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCREJECTIONREASONS'), 'OCREJECTIONREASON-05', 'The owner of the land has not laid down and made street or streets or road or roads giving access to the site or sitesconnecting with an existing public or private streets while utilising , selling or leasing out or otherwise disposing of the land orany portion of the land or any portion or portions of the same site for construction of building.#The constructed building has made an encroachment upon a land belonging to the Government and / or the Corporationand/ or properties belonging to others than the applicant.', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITADDITIONALCONDITIONS'), 'ADDITIONALPC-01', 'Additional Permit Conditions', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-15', 'The applicant should avail the NOC of the State Pollution Control Board if any environmental problem arises after the erection of the tower/pole.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-16', 'No construction other than the one approved as per plan enclosed is permitted.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-17', 'Warning light and colors should be provided as per Rule.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-18', 'The Owner/Applicant shall be responsible for the Structural stability of the telecommunication Tower/Pole and accessories room for any damage cases due to inadequate shelter measures.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-19', 'Rule should be strictly followed.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-20', 'Diesel Generator should be fixed in the aquatics sound proof cabin.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-21', 'The Tower/Pole should be constructed and operated without any public nuisance.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-22', 'The [ownerName] will be responsible for any damage caused by the Tower/Pole.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-23', 'The owner of the proposed mobile tower/Pole will be responsible for the stability and safety of the proposed Tower/Pole.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-24', 'The permit is issued on the basis of the Affidavit submitted by Applicant in stamp paper worth RS.100/- on [planPermissionDate]', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PERMITGENERALCONDITIONS'), 'PERMITGENERALCONDITION-25', 'After completing the construction of Tower, DG, Shelter Room, Stabilizer room, Occupancy certificate should be availed from the Corporation Authorities before Operating the Tower/Pole.', 0, 1, now(), 1, now());




