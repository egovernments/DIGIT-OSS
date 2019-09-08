package org.egov.hrms.repository;

import org.springframework.stereotype.Component;

@Component
public class EmployeeQueries {

	public static final String HRMS_GET_EMPLOYEES = "SELECT employee.id as employee_id, employee.uuid as employee_uuid, employee.code as employee_code, "
			+ "employee.dateOfAppointment as employee_doa, employee.employeestatus as employee_status, employeetype as employee_type, employee.active as employee_active, "
			+ "employee.tenantid as employee_tenantid, employee.createdby as employee_createdby, employee.createddate as employee_createddate, "
			+ "employee.lastmodifiedby as employee_lastmodifiedby, employee.lastmodifieddate as employee_lastmodifieddate, assignment.uuid as assignment_uuid, "
			+ "assignment.position as assignment_position, assignment.department as assignment_department, assignment.designation as assignment_designation, "
			+ "assignment.fromdate as assignment_fromdate, assignment.todate as assignment_todate, assignment.govtordernumber as assignment_govtordernumber, "
			+ "assignment.reportingto as assignment_reportingto, assignment.ishod as assignment_ishod, assignment.iscurrentassignment as assignment_iscurrentassignment, "
			+ "assignment.tenantid as assignment_tenantid, "
			+ "assignment.createdby as assignment_createdby, assignment.createddate as assignment_createddate, assignment.lastmodifiedby as assignment_lastmodifiedby, "
			+ "assignment.lastmodifieddate as assignment_lastmodifieddate, education.uuid as education_uuid, education.qualification as education_qualification, "
			+ "education.stream as education_stream, education.yearofpassing as education_yearofpassing, education.university as education_university, "
			+ "education.remarks as education_remarks,education.isactive as education_isactive ,education.tenantid as education_tenantid, education.createdby as education_createdby, "
			+ "education.createddate as education_createddate, education.lastmodifiedby as education_lastmodifiedby, education.lastmodifieddate as education_lastmodifieddate, "
			+ "depttest.uuid as depttest_uuid, depttest.test as depttest_test, depttest.yearofpassing as depttest_yearofpassing, depttest.remarks as depttest_remarks, "
			+ "depttest.isactive as depttest_isactive, depttest.tenantid as depttest_tenantid, depttest.createdby as depttest_createdby, depttest.createddate as depttest_createddate, "
			+ "depttest.lastmodifiedby as depttest_lastmodifiedby, depttest.lastmodifieddate as depttest_lastmodifieddate, docs.uuid as docs_uuid, "
			+ "docs.documentid as docs_documentid, docs.documentname as docs_documentname, docs.referencetype as docs_referencetype, "
			+ "docs.referenceid as docs_referenceid, docs.tenantid as docs_tenantid, docs.createdby as docs_createdby, docs.createddate as docs_createddate, "
			+ "docs.lastmodifiedby as docs_lastmodifiedby, docs.lastmodifieddate as docs_lastmodifieddate, jurisdiction.uuid as jurisdiction_uuid, "
			+ "jurisdiction.hierarchy as jurisdiction_hierarchy, jurisdiction.boundarytype as jurisdiction_boundarytype, jurisdiction.boundary as jurisdiction_boundary, "
			+ "jurisdiction.isactive as jurisdiction_isactive, jurisdiction.tenantid as jurisdiction_tenantid, jurisdiction.createdby as jurisdiction_createdby, jurisdiction.createddate as jurisdiction_createddate, "
			+ "jurisdiction.lastmodifiedby as jurisdiction_lastmodifiedby, jurisdiction.lastmodifieddate as jurisdiction_lastmodifieddate, history.uuid as history_uuid, "
			+ "history.servicestatus as history_servicestatus, history.servicefrom as history_servicefrom, history.serviceto as history_serviceto, "
			+ "history.ordernumber as history_ordernumber, history.iscurrentposition as history_iscurrentposition, history.location as history_location, "
			+ "history.tenantid as history_tenantid, history.createdby as history_createdby, history.createddate as history_createddate, "
			+ "history.lastmodifiedby as history_lastmodifiedby, history.lastmodifieddate as history_lastmodifieddate, deact.uuid as deact_uuid, "
			+ "deact.reasonfordeactivation as deact_reasonfordeactivation, deact.effectivefrom as deact_effectivefrom, deact.ordernumber as deact_ordernumber, "
			+ "deact.remarks as deact_remarks, deact.tenantid as deact_tenantid, deact.createdby as deact_createdby, "
			+ "deact.createddate as deact_createddate, deact.lastmodifiedby as deact_lastmodifiedby, deact.lastmodifieddate as deact_lastmodifieddate "
			+ "FROM eg_hrms_employee employee LEFT JOIN eg_hrms_assignment assignment ON employee.uuid = assignment.employeeid LEFT JOIN eg_hrms_educationaldetails education "
			+ "ON employee.uuid = education.employeeid LEFT JOIN eg_hrms_departmentaltests depttest ON employee.uuid = depttest.employeeid LEFT JOIN eg_hrms_empdocuments docs "
			+ "ON employee.uuid = docs.employeeid LEFT JOIN eg_hrms_servicehistory history ON employee.uuid = history.employeeid LEFT JOIN eg_hrms_jurisdiction jurisdiction "
			+ "ON employee.uuid = jurisdiction.employeeid LEFT JOIN eg_hrms_deactivationdetails deact ON employee.uuid = deact.employeeid WHERE ";

	public static final String HRMS_PAGINATION_WRAPPER = "SELECT * FROM "
			+ "(SELECT *, DENSE_RANK() OVER (ORDER BY employee_uuid) offset_ FROM " + "({})" + " result) result_offset "
			+ "WHERE offset_ > $offset AND offset_ <= $limit";
	
	public static final String HRMS_POSITION_SEQ = "SELECT NEXTVAL('EG_HRMS_POSITION')";

	public static final String HRMS_GET_ASSIGNMENT = "select distinct(employeeid)  from eg_hrms_assignment assignment where assignment.tenantid notnull  ";
}
