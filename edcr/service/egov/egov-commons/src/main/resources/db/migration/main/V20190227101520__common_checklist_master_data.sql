INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='STAKEHOLDERDOCUMENT'), 'STAKEHOLDERDOC-01', 'Experience Certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='STAKEHOLDERDOCUMENT'), 'STAKEHOLDERDOC-02', 'Details of show cause notice received/cancellations of licenses if any', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='STAKEHOLDERDOCUMENT'), 'STAKEHOLDERDOC-03', 'Others', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='STAKEHOLDERDOCUMENT'), 'STAKEHOLDERDOC-04', 'Educational Certificates', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='STAKEHOLDERDOCUMENT'), 'STAKEHOLDERDOC-05', 'Copy of Govt. approved identity card with photo, with the same address as that in the licensee certificate, attested by a gazetted officer within one month from the date of application', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='STAKEHOLDERDOCUMENT'), 'STAKEHOLDERDOC-06', 'Registration certificate of the licensee – copy attested by a gazette officer, including office seal,attested within one month prior to the date of application, to be scanned and uploaded.( including renewal certificate if any)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='STAKEHOLDERDOCUMENT'), 'STAKEHOLDERDOC-07', 'Recent passport size photo - Taken within six months prior to the date of application shall be uploaded – please ensure that the photo uploaded is of passport size and gives a front
and clear view of the face.', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONLOCATION'), 'INSPECTIONLOC-01', 'As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONLOCATION'), 'INSPECTIONLOC-02', 'As per Document:T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONMEASUREMENT'), 'INSPECTIONMEASUREMENT-01', 'As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONACCESS'), 'INSPECTIONACCESS-01', 'Access to Plot As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONACCESS'), 'INSPECTIONACCESS-02', 'Access to Plot As per Document:T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONSURROUNDING'), 'INSPECTIONSURROUNDING-01', 'Surrounding of Plot As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONSURROUNDING'), 'INSPECTIONSURROUNDING-02', 'Surrounding of Plot As per Document:T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONTYPEOFLAND'), 'INSPECTIONTYPEOFLAND-01', 'As per Document:T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONPROPOSEDSTAGEWORK'), 'INSPECTIONPROPOSEDSTAGEWORK-01', 'Work not started:Y/N', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONPROPOSEDSTAGEWORK'), 'INSPECTIONPROPOSEDSTAGEWORK-02', 'Work started:Y/N', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONPROPOSEDSTAGEWORK'), 'INSPECTIONPROPOSEDSTAGEWORK-03', 'Work Completed:Y/N', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONWORKCOMPLETEDPERPLAN'), 'INSPECTIONWORKCOMPLETEDPERPLAN-01', 'Whether as per submitted plan (Subjected to Rule 10, 17(2) and 22(3))', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONHGTBUILDABUTROAD'), 'INSPECTIONHGTBUILDABUTROAD-01', 'Violation of Rule 23(1)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONHGTBUILDABUTROAD'), 'INSPECTIONHGTBUILDABUTROAD-02', 'Violation of Rule 23(2)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONHGTBUILDABUTROAD'), 'INSPECTIONHGTBUILDABUTROAD-03', 'Violation of Rule 23(3)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONHGTBUILDABUTROAD'), 'INSPECTIONHGTBUILDABUTROAD-04', 'Violation of Rule 23(4)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONHGTBUILDABUTROAD'), 'INSPECTIONHGTBUILDABUTROAD-05', 'Violation of Rule 23(4a)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONHGTBUILDABUTROAD'), 'INSPECTIONHGTBUILDABUTROAD-06', 'Violation of Rule 23(5)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONHGTBUILDABUTROAD'), 'INSPECTIONHGTBUILDABUTROAD-07', 'Violation of Rule 11(A)', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONAREALOC'), 'INSPECTIONAREALOC-01', 'As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONLENGTHOFCOMPOUNDWALL'), 'INSPECTIONLENGTHOFCOMPOUNDWALL-01', 'As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONLENGTHOFCOMPOUNDWALL'), 'INSPECTIONLENGTHOFCOMPOUNDWALL-02', 'As per Document:T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONERECTIONOFTOWER'), 'INSPECTIONERECTIONOFTOWER-01', 'As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONERECTIONOFTOWER'), 'INSPECTIONERECTIONOFTOWER-02', 'As per Document:T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONNUMBEROFWELLS'), 'INSPECTIONNUMBEROFWELLS-01', 'As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONNUMBEROFWELLS'), 'INSPECTIONNUMBEROFWELLS-02', 'As per Document:T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONSHUTTER'), 'INSPECTIONSHUTTER-01', 'As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONSHUTTER'), 'INSPECTIONSHUTTER-02', 'As per Document:T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='INSPECTIONROOFCONVERSION'), 'INSPECTIONROOFCONVERSION-01', 'As per site plan T/F', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-01', 'Title Deed of the Property', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-02', 'Possession Certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-03', 'Layout Approval Copy', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-04', 'Location Sketch and Village Sketch', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-05', 'Structural Stability certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-06', 'Specification Report', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-07', 'Others', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-08', 'Declaration by the Applicant - Declaration as per Appendix A, should be signed scanned and uploaded', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-09', 'Certificates and Undertaking by LBE/LBS - Declaration as per Appendix A, should be signed scanned and uploaded', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-10', 'One day permit agreement', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-11', 'Land Tax Receipt', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-12', 'Building Tax Receipt', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-13', 'EMF certification for radiation compliance', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-14', 'SACFA – Application form for full sitting category –full site (BWA)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-15', 'Stability certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-16', 'Deed of lease', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-17', 'Document', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-18', 'Registration certificate for infrastructure provider category -1 (IP-1)(Govt. of India)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-19', 'ARAI certificate – The automotive research association of India', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-20', 'Consent letter', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='DOCUMENTATION'), 'DOCUMENTATION-21', 'Land tax Receipt', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-01', 'Port Trust', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-02', 'Railways', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-03', 'RTP/CTP – Layout Concurrence', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-04', 'Pollution Control Board', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-05', 'Fire Services', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-06', 'CRZ Clearance', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-07', 'Art & Heritage Commission', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-08', 'Forest Department', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='NOC'), 'NOC-09', 'Others if any', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-01', 'Title Deed of the Property', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-02', 'Possession Certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-03', 'Land Tax Receipt', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-04', 'Layout Approval Copy', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-05', 'Others', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-06', 'Location Sketch and Village Sketch', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-07', 'Specification Report', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-08', 'Certificates and Undertaking by LBE/LBS - Declaration as per Appendix A, should be signed scanned and uploaded', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-09', 'EMF certification for radiation compliance', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-10', 'SACFA – Application form for full sitting category –full site (BWA)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-11', 'Stability certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-12', 'Deed of lease', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-13', 'Document', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-14', 'Registration certificate for infrastructure provider category -1 (IP-1)(Govt. of India)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-15', 'ARAI certificate – The automotive research association of India', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-16', 'Consent letter', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-17', 'Building tax Receipt (if the tower is located on top of a building)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='LTP'), 'LTP-18', 'Declaration by the Applicant - Declaration as per Appendix A, should be signed scanned and uploaded', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-01', 'Is the proposed construction is in accordance with the various provisions as per master plan zoning regulations/ Detailed town planning schemes rules for the area?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-02', 'Whether the plot area specified in plan info is in accordance with the plot area as per land deed document/ possession certificate?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-03', 'Whether all habitable rooms are abutting an exterior or interior open space, as specified?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-04', 'Whether the practicality of the provided car parking, two wheeler parking, loading and unloading space, manoeuvring space, slope, maximum open yard area allowable to be covered by parking, width of drive way etc. are ensured with regards to provisions as p (...)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-05', 'The height of building - Whether marked correct and the same value of height is given in pdf?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-06', 'Type of abutting road, building footprint, the minimum distance between plot boundary and building etc. accurately specified with correct layer and dimensions?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-07', 'Whether Front yard, Side yard 1, Side yard 2, Rear yard and plot boundary polygons are accurately marked, and conditions with regards to overhangs stipulated in rules 24-10, 24-11, 62-2 are complied with?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-08', 'Whether the BUILT_UP_AREA, FAR deduct polygons accurately marked?
', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-09', 'Whether the Access width accurately marked', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-10', 'Whether the distance to centre line of the road from the buildings accurately marked?
', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-11', 'Whether the residential units, dining area polygons accurately marked.
', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-12', 'Comparison of EDCR report and pdf drawings- for identicalness with the captured details and details provided in pdf drawings. Whether all the details given in EDCR report is the same to that given in pdf drawings?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-13', 'The height of building - Whether marked correct as specified in KMBR 1999 and related amendments?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-14', 'Whether exit doorways are opened to an enclosed stairway or a horizontal exit or a corridor or passage way providing continous and protected means of egress  as per KMBR 1999 and related amendments?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-15', 'Whether the conditions related to lighting and ventilation as stipulated in KMBR rule 49 and related amendments are complied with?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-16', 'Whether the conditions on incorporating hazardous uses with residential uses  as stipulated in rule 53-2 are complied with?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-17', 'Apartment house, lodging  or rooming house, dormitory, hostel or hotel with residential accommodation having floor area of 300 m2 or more with a capacity for accommodating more than 20 person, are having at least two doorways as stipulated in rule 53 1(b)?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-18', 'In the case of wedding halls, whether proper and adequate arrangements for collection ang hygenic disposal of solid and liquid wastes are provided?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-19', 'Whether commercial buildings proposed in commercial zones, satisfies rule 56-1 (a)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-20', 'Whether minimum acces width, enclosure conditions as per rule 56 (4), 56 (5), for fish / meat stalls are satisfied?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINY'), 'PLANSCRUTINY-21', 'Whether the area of work rooms provided in industrial buildings are adequate as per rule 57-6?', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-01', 'Parking Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-02', 'Roof Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-03', 'Other Details', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-04', 'Building Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-05', 'Service Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-06', 'Site Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-07', 'Details Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-08', 'Floor Plans, Elevations, Sections', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-09', 'Section Plans', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='BPADCRDOCUMENTS'), 'BPADCRDOC-10', 'Elevation Plans', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-01', 'Possession Certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-02', 'Land Tax Receipt', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-03', 'Other documents', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-04', 'Completion certificate in prescribed format duly signed/ authenticated', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-05', 'Copy of land deed document', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-06', 'Title deed of the property', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-07', 'Specification report', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-08', 'Building tax receipt', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-09', 'Layout approval copy', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-10', 'Location sketch / Village sketch', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-11', 'Others', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-12', 'Floor plans', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-13', 'Elevations', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-14', 'Site plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-15', 'Service plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCGENERALDOCUMENTS'), 'OCGENERALDOC-16', 'Sections', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-01', 'Port Trust', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-02', 'Railways', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-03', 'RTP/CTP – Layout Concurrence', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-04', 'Pollution Control Board', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-05', 'Fire Services', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-06', 'CRZ Clearance', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-07', 'Art & Heritage Commission', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-08', 'Forest Department', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCNOC'), 'OCNOC-09', 'Others if any', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-01', 'Possession Certificate', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-02', 'Land Tax Receipt', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-03', 'Floor plans', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-04', 'Elevations', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-05', 'Sections', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-06', 'Site plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-07', 'Service plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCLTPDOCUMENTS'), 'OCLTPDOC-08', 'Others', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-01', 'Whether all drawings and details, specified as per KMBR are uploaded in the system, as drawings in .pdf format?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-02', 'Comparison of EDCR report and PDF drawings - for identicalness with the captured details and the details provided in pdf drawings. Whether all the details given in EDCR report is the same as that given in pdf drawings?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-03', 'Whether the various uses/ occupancies of different spaces in the building/s as specified in the generated EDCR report for the particular application are in accordance with the uses specified against different spaces specified in the uploaded drawings in pd (...)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-04', 'Whether the drawings uploaded in .dxf format is accurately prepared satisfying all the conditions and methods specified in Suvega drawing preparation guidelines applicable?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-05', 'Whether Front yard, Side yard 1, Side yard 2, Rear yard and plot boundary polygons are accurately marked (Plot boundaries shall be excluding the road widening area if any), and conditions with regards to overhangs stipulated in rules 24-10, 24-11, 62-2 are (...)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-06', 'The height of building - Whether marked correct and the same value of height is given in pdf?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-07', 'Type of abutting road, building footprint, the minimum distance between plot boundary and building etc. accurately specified with correct layer and dimensions?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-08', 'Whether all the dimensions related to the buildings, open well, waste disposal facilities, roads, and boundaries are accurately marked?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-09', 'Whether all additional polygons required for calculating the parking requirements are marked as per the respective occupancies?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-10', 'Whether additional details as required for construction involving depth of cutting more than 1.50 m are incorporated?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='PLANSCRUTINYDRAWING'), 'PLANSCRUTINYDRAWING-11', 'Whether the additional polygons for validating dimensions/ distances related to parts of buildings including Stair, Lift, ramps, sanitation facilities, exit width, mezzanine floors, height of rooms etc. are accurately marked?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDCRDOCUMENTS'), 'OCDCRDOC-01', 'Site Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDCRDOCUMENTS'), 'OCDCRDOC-02', 'Service Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDCRDOCUMENTS'), 'OCDCRDOC-03', 'Building Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDCRDOCUMENTS'), 'OCDCRDOC-04', 'Parking Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDCRDOCUMENTS'), 'OCDCRDOC-05', 'Terrace Plan', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCDCRDOCUMENTS'), 'OCDCRDOC-06', 'Others', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-01', 'Whether all habitable rooms are abutting an 
exterior or interior open space, as specified', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-02', 'Is the proposed construction is in accordance 
with the various provisions as per master plan zoning regulations/ Detailed town planning schemes rules for the area?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-03', 'Whether the plot area specified in plan info is in 
accordance with the plot area as per land deed document/ possession certificate?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-04', 'The height of building - Whether marked correct 
as specified in rule book and related amendments?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-05', 'Whether the practicality of the provided car parking, two wheeler parking, loading and unloading space, manoeuvring space, slope, maximum open yard area allowable to 
be covered by parking, width of driveway etc. are ensured with regards to provisions as p (...)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-06', 'Whether exit doorways are opened to an enclosed stairway or a horizontal exit or a corridor or passageway providing continuous and protected means of egress as 
per rule book and related amendments??', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-07', 'Whether the conditions related to lighting and ventilation 
as stipulated in rule book and related amendments are complied with?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-08', 'Whether the conditions on incorporating hazardous uses 
with residential uses as stipulated is complied with?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-09', 'Apartment house, lodging or rooming house, 
dormitory, hostel or hotel with residential accommodation having floor area of 300 m2 or more with a capacity for accommodating more than 20 person, are having at least two doorways as stipulated in rule 53 1(b)?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-10', 'In the case of wedding halls, whether proper and adequate 
arrangements for collection any hygienic disposal of solid and liquid wastes are provided?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-11', 'Whether commercial buildings proposed in commercial zones, satisfies rule 56-1 (a)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-12', 'Whether minimum access width, enclosure conditions as per rule 56 (4), 56 (5), for fish / meat stalls are satisfied?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYRULE'), 'OCPLANSCRUTINYRULE-13', 'Whether the area of work rooms provided in industrial buildings are adequate as per rule 57-6?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-01', 'Whether all drawings and details, 
specified as per rule book are uploaded in the system, as drawings in .pdf format?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-02', 'Comparison of EDCR report and PDF drawings - for identicalness with the captured details and the details provided in pdf drawings. 
Whether all the details given in EDCR report is the same as that given in pdf drawings?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-03', 'Whether the various uses/ occupancies of different 
spaces in the building/s as specified in the generated EDCR report for the particular application, are in accordance with the uses specified against different spaces specified in the uploaded drawings in  (...)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-04', 'Whether the polygons for calculating Built Up area, 
Floor area and covered area are marked correctly?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-05', 'Whether the drawings uploaded in .dxf format is 
accurately prepared satisfying all the conditions and methods specified in Suvega drawing preparation guidelines applicable?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-06', 'Whether Front yard, Side yard 1, Side yard 2, Rear yard and plot boundary polygons are accurately marked (Plot boundaries shall be excluding the road widening area if any), 
and conditions with regards to overhangs stipulated in rules 24-10, 24-11, 62-2 ar (...)', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-07', 'The height of building - Whether marked correct and the same 
value of height is given in pdf?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-08', 'Type of abutting road, building footprint, the minimum distance between plot boundary and building etc. 
accurately specified with correct layer and dimensions?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-09', 'Whether all the dimensions related to the buildings, 
open well, waste disposal facilities, roads and boundaries are accurately marked?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-10', 'Whether all additional polygons required for calculating 
the parkings requirements are marked as per the respective occupancies?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCPLANSCRUTINYDRAWING'), 'OCPLANSCRUTINYDRAWING-11', 'Whether the additional polygons for validating 
dimensions/ distances related to parts of buildings including Stair, Lift, ramps, sanitation facilities, exit width, mezzanine floors, height of rooms etc. are accurately marked?', 0, 1, now(), 1, now());


INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-01', 'Whether all relevant details including the following dimensions, 
quantities, numbers, areas, occupancies of the constructed building as per site conditions are exactly in accordance the various details provided in approved drawings and documents?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-02', 'Over all and floorwise/roomwise horizontal and vertical 
dimensions, occupancies and features of the building(s)/ parts of the building(s) including height of rooms.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-03', 'Access width', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-04', 'Open yards', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-05', 'Presence of various types of openings on external walls', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-06', 'Numbers and dimensions of car parking, two wheeler parking, 
loading and unloading space, parking for physically challenged provided', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-07', 'Biometric waste treatment plant and solar plants', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-08', 'Facilities for liquid waste recycling and reusing, 
Safe facility for waste disposal, Solid waste treatment plant/ In Situ waste treatment plant.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-09', 'Type and dimensions of corridors giving access to stair and 
other corridors/ Verandahs', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-10', 'Horizontal, vertical clearances and voltage of overhead electric 
lines', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-11', 'Types, width and extent of roads/ lanes/ streets/ cul de sacs 
abutting the plot', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-12', 'Distance from C/L of road to the building, boundary of 
the road to building?', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-13', 'Type, location and various distance parameters related with 
waste treatment facilities and open well.', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-14', 'Distance between buildings', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-15', 'Numbers and dimensions of various features intended for 
physically challenged', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-16', 'Numbers and dimensions of various sanitation facilities', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-17', 'Numbers and dimensions of doors, windows, stairs, ramps and lifts', 0, 1, now(), 1, now());

INSERT INTO eg_checklist(id, checklisttypeid, code, description, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES 
(nextval('seq_eg_checklist'), (select id from eg_checklist_type where code='OCINSPECTION'), 'OCINSPECTION-18', 'Other if any (Specify)', 0, 1, now(), 1, now());
	
