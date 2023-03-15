INSERT INTO egeis_employee (id, code, dateofappointment, dateofjoining, dateofretirement, employeestatus, recruitmentmodeid, recruitmenttypeid, recruitmentquotaid, retirementage, dateofresignation, dateoftermination, employeetypeid, mothertongueid, religionid, communityid, categoryid, physicallydisabled, medicalreportproduced, maritalstatus, passportno, gpfno, bankid, bankbranchid, bankaccount, groupid, placeofbirth, tenantid) 
VALUES ((select id from eg_user where username = 'ravi' and tenantid = 'default'), '658041', NULL, NULL, NULL, (select id from egeis_hrstatus where code = 'EMPLOYED' and tenantid = 'default'), NULL, NULL, NULL, NULL, NULL, NULL,
(select id from egeis_employeetype where name = 'Permanent' and tenantid = 'default'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'default');

INSERT INTO egeis_assignment (id, employeeid, positionid, fundid, functionaryid, functionid, departmentid, designationid, isprimary, fromdate, todate, gradeid, govtordernumber, createdby, createddate, lastmodifiedby, lastmodifieddate, tenantid)
VALUES (nextval('seq_egeis_assignment'), (select id from egeis_employee where code = '658041' and tenantid = 'default'),
(select id from egeis_position where name = 'ENG_Junior Assistant_1' and tenantid = 'default'), NULL, NULL, NULL,
(select id from eg_department where code = 'ENG' and tenantid = 'default'),
(select id from egeis_designation where code = 'JASST' and tenantid = 'default'), true, '2015-04-01', '2020-03-31', NULL, NULL, 1, now(), 1, NULL, 'default');