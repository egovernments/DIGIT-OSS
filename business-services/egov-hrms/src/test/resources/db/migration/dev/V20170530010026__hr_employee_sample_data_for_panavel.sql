INSERT INTO egeis_employee (id, code, dateofappointment, dateofjoining, dateofretirement, employeestatus, recruitmentmodeid, recruitmenttypeid, recruitmentquotaid, retirementage, dateofresignation, dateoftermination, employeetypeid, mothertongueid, religionid, communityid, categoryid, physicallydisabled, medicalreportproduced, maritalstatus, passportno, gpfno, bankid, bankbranchid, bankaccount, groupid, placeofbirth, tenantid) 
VALUES ((select id from eg_user where username = 'admin' and tenantid = 'panavel'), '658039', NULL, NULL, NULL, (select id from egeis_hrstatus where code = 'EMPLOYED' and tenantid = 'panavel'), NULL, NULL, NULL, NULL, NULL, NULL, 
(select id from egeis_employeetype where name = 'Permanent' and tenantid = 'panavel'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'panavel');

INSERT INTO egeis_employee (id, code, dateofappointment, dateofjoining, dateofretirement, employeestatus, recruitmentmodeid, recruitmenttypeid, recruitmentquotaid, retirementage, dateofresignation, dateoftermination, employeetypeid, mothertongueid, religionid, communityid, categoryid, physicallydisabled, medicalreportproduced, maritalstatus, passportno, gpfno, bankid, bankbranchid, bankaccount, groupid, placeofbirth, tenantid) 
VALUES ((select id from eg_user where username = 'ajay' and tenantid = 'panavel'), '658040', NULL, NULL, NULL, (select id from egeis_hrstatus where code = 'EMPLOYED' and tenantid = 'panavel'), NULL, NULL, NULL, NULL, NULL, NULL, 
(select id from egeis_employeetype where name = 'Permanent' and tenantid = 'panavel'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'panavel');

INSERT INTO egeis_assignment (id, employeeid, positionid, fundid, functionaryid, functionid, departmentid, designationid, isprimary, fromdate, todate, gradeid, govtordernumber, createdby, createddate, lastmodifiedby, lastmodifieddate, tenantid) 
VALUES (nextval('seq_egeis_assignment'), (select id from egeis_employee where code = '658039' and tenantid = 'panavel'), 
(select id from egeis_position where name = 'ENG_Assistant Engineer_2' and tenantid = 'panavel'), NULL, NULL, NULL,
(select id from eg_department where code = 'ADM' and tenantid = 'panavel'), 
(select id from egeis_designation where code = 'SASST' and tenantid = 'panavel'), true, '2015-04-01', '2020-03-31', NULL, NULL, 1, now(), 1, NULL, 'panavel');
INSERT INTO egeis_assignment (id, employeeid, positionid, fundid, functionaryid, functionid, departmentid, designationid, isprimary, fromdate, todate, gradeid, govtordernumber, createdby, createddate, lastmodifiedby, lastmodifieddate, tenantid) 
VALUES (nextval('seq_egeis_assignment'), (select id from egeis_employee where code = '658040' and tenantid = 'panavel'), 
(select id from egeis_position where name = 'Acc_Senior Account_2' and tenantid = 'panavel'), NULL, NULL, NULL,
(select id from eg_department where code = 'ENG' and tenantid = 'panavel'),
(select id from egeis_designation where code = 'AO' and tenantid = 'panavel'), true, '2015-04-01', '2020-03-31', NULL, NULL, 1, now(), 1, NULL, 'panavel');


