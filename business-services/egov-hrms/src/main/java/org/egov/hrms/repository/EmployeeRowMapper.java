package org.egov.hrms.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.hrms.model.*;
import org.egov.hrms.model.enums.DeactivationType;
import org.egov.hrms.model.enums.ReferenceType;
import org.egov.hrms.web.contract.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
public class EmployeeRowMapper implements ResultSetExtractor<List<Employee>> {

	@Autowired
	private ObjectMapper mapper;

	@Override
	/**
	 * Maps ResultSet to Employee POJO.
	 */
	public List<Employee> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, Employee> employeeMap = new HashMap<>();
		while(rs.next()) {
			String currentid = rs.getString("employee_uuid");
			Employee currentEmployee = employeeMap.get(currentid);
			if(null == currentEmployee) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("employee_createdby")).createdDate(rs.getLong("employee_createddate"))
						.lastModifiedBy(rs.getString("employee_lastmodifiedby")).lastModifiedDate(rs.getLong("employee_lastmodifieddate")).build();
				currentEmployee = Employee.builder().id(rs.getLong("employee_id")).uuid(rs.getString("employee_uuid")).tenantId(rs.getString("employee_tenantid"))
						.code(rs.getString("employee_code")).dateOfAppointment(null == rs.getObject("employee_doa")? null : rs.getLong("employee_doa")).IsActive(rs.getBoolean("employee_active"))
						.employeeStatus(rs.getString("employee_status")).employeeType(rs.getString("employee_type")).auditDetails(auditDetails)
						.jurisdictions(new ArrayList<Jurisdiction>()).assignments(new ArrayList<Assignment>()).user(new User())
						.build();
			}
			addChildrenToEmployee(rs, currentEmployee);
			employeeMap.put(currentid, currentEmployee);
		}
		
		return new ArrayList<>(employeeMap.values());

	}
	
	/**
	 * Adds all the children data to a employee object.
	 * 
	 * @param rs
	 * @param currentEmployee
	 */
	public void addChildrenToEmployee(ResultSet rs, Employee currentEmployee) {
		setAssignments(rs, currentEmployee);
		setJurisdictions(rs, currentEmployee);
		setEducationDetails(rs, currentEmployee);
		setDeptTests(rs, currentEmployee);
		setServiceHistory(rs, currentEmployee);
		setDocuments(rs, currentEmployee);
		setDeactivationDetails(rs, currentEmployee);
	}
	
	/**
	 * Maps Assignments inside a ResultSet to the Assignment POJO inside employee object.
	 * 
	 * @param rs
	 * @param currentEmployee
	 */
	public void setAssignments(ResultSet rs, Employee currentEmployee) {
		try {
			List<Assignment> assignments = new ArrayList<>();
			if(CollectionUtils.isEmpty(currentEmployee.getAssignments()))
				assignments = new ArrayList<Assignment>();
			else
				assignments = currentEmployee.getAssignments();
			
			List<String> ids = assignments.stream().map(Assignment::getId).collect(Collectors.toList());
			if(!StringUtils.isEmpty(rs.getString("assignment_uuid")) && !ids.contains(rs.getString("assignment_uuid"))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("assignment_createdby")).createdDate(rs.getLong("assignment_createddate"))
						.lastModifiedBy(rs.getString("assignment_lastmodifiedby")).lastModifiedDate(rs.getLong("assignment_lastmodifieddate")).build();
				
				Assignment assignment = Assignment.builder().id(rs.getString("assignment_uuid")).position(rs.getLong("assignment_position")).department(rs.getString("assignment_department"))
				.designation(rs.getString("assignment_designation")).fromDate(rs.getLong("assignment_fromdate")).toDate(null == rs.getObject("assignment_todate")? null : rs.getLong("assignment_todate"))
			    .govtOrderNumber(rs.getString("assignment_govtordernumber")).reportingTo(rs.getString("assignment_reportingto")).isHOD(rs.getBoolean("assignment_ishod"))
				.isCurrentAssignment(rs.getBoolean("assignment_iscurrentassignment")).tenantid(rs.getString("assignment_tenantid")).auditDetails(auditDetails).build();
				
				assignments.add(assignment);
			}
			currentEmployee.setAssignments(assignments);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Assignments: ",e);
		}
	}
	
	/**
	 * Maps Jurisdictions inside a ResultSet to the Jurisdiction POJO inside employee object.
	 * 
	 * @param rs
	 * @param currentEmployee
	 */
	public void setJurisdictions(ResultSet rs, Employee currentEmployee) {
		try {
			List<Jurisdiction> jurisdictions = new ArrayList<>();
			if(CollectionUtils.isEmpty(currentEmployee.getJurisdictions()))
				jurisdictions = new ArrayList<Jurisdiction>();
			else
				jurisdictions = currentEmployee.getJurisdictions();
			
			List<String> ids = jurisdictions.stream().map(Jurisdiction::getId).collect(Collectors.toList());
			Boolean isActive =  rs.getBoolean("jurisdiction_isactive") !=false;
			if(isActive && !StringUtils.isEmpty(rs.getString("jurisdiction_uuid")) && !ids.contains(rs.getString("jurisdiction_uuid"))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("jurisdiction_createdby")).createdDate(rs.getLong("jurisdiction_createddate"))
						.lastModifiedBy(rs.getString("jurisdiction_lastmodifiedby")).lastModifiedDate(rs.getLong("jurisdiction_lastmodifieddate")).build();
				
				Jurisdiction jurisdiction = Jurisdiction.builder().id(rs.getString("jurisdiction_uuid")).hierarchy(rs.getString("jurisdiction_hierarchy"))
						.boundary(rs.getString("jurisdiction_boundary")).boundaryType(rs.getString("jurisdiction_boundarytype"))
						.tenantId(rs.getString("jurisdiction_tenantid"))
						.isActive(null == rs.getObject("jurisdiction_isactive")?true:rs.getBoolean("jurisdiction_isactive"))
						.auditDetails(auditDetails).build();
				
				jurisdictions.add(jurisdiction);
			}
			currentEmployee.setJurisdictions(jurisdictions);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Jurisdictions: ",e);
		}
	}
	
	/**
	 * Maps EducationDetails inside a ResultSet to the EducationDetails POJO inside employee object.
	 * 
	 * @param rs
	 * @param currentEmployee
	 */
	public void setEducationDetails(ResultSet rs, Employee currentEmployee) {
		try {
			List<EducationalQualification> educationDetails = new ArrayList<>();
			if(CollectionUtils.isEmpty(currentEmployee.getEducation()))
				educationDetails = new ArrayList<EducationalQualification>();
			else
				educationDetails = currentEmployee.getEducation();
			List<String> ids = educationDetails.stream().map(EducationalQualification::getId).collect(Collectors.toList());
			Boolean isActive =rs.getBoolean("education_isactive") !=false;
			if( isActive &&!StringUtils.isEmpty( rs.getString("education_uuid")) && !ids.contains(rs.getString("education_uuid"))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("education_createdby")).createdDate(rs.getLong("education_createddate"))
						.lastModifiedBy(rs.getString("education_lastmodifiedby")).lastModifiedDate(rs.getLong("education_lastmodifieddate")).build();
				EducationalQualification education = EducationalQualification.builder().id(rs.getString("education_uuid")).qualification(rs.getString("education_qualification")).stream(rs.getString("education_stream"))
						.yearOfPassing(rs.getLong("education_yearofpassing")).university(rs.getString("education_university")).remarks(rs.getString("education_remarks"))
						.tenantId(rs.getString("education_tenantid"))
						.isActive(null == rs.getObject("education_isactive")?true:rs.getBoolean("education_isactive"))
						.auditDetails(auditDetails).build();
				
				educationDetails.add(education);
			}
			currentEmployee.setEducation(educationDetails);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Educational Details: ",e);
		}
	}
	
	/**
	 * Maps Dept Tests inside a ResultSet to the DeptTest POJO inside employee object.
	 * 
	 * @param rs
	 * @param currentEmployee
	 */
	public void setDeptTests(ResultSet rs, Employee currentEmployee) {
		try {
			List<DepartmentalTest> tests = new ArrayList<>();
			if(CollectionUtils.isEmpty(currentEmployee.getTests()))
				tests = new ArrayList<DepartmentalTest>();
			else
				tests = currentEmployee.getTests();
			
			List<String> ids = tests.stream().map(DepartmentalTest::getId).collect(Collectors.toList());
			Boolean isActive = rs.getBoolean("depttest_isactive") !=false;
			if(isActive  && !StringUtils.isEmpty(rs.getString("depttest_uuid")) && !ids.contains(rs.getString("depttest_uuid"))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("depttest_createdby")).createdDate(rs.getLong("depttest_createddate"))
						.lastModifiedBy(rs.getString("depttest_lastmodifiedby")).lastModifiedDate(rs.getLong("depttest_lastmodifieddate")).build();
				
				DepartmentalTest test = DepartmentalTest.builder().id(rs.getString("depttest_uuid")).test(rs.getString("depttest_test")).yearOfPassing(rs.getLong("depttest_yearofpassing"))
						.remarks(rs.getString("depttest_remarks")).tenantId(rs.getString("depttest_tenantid"))
						.isActive(null == rs.getObject("depttest_isactive")?true:rs.getBoolean("depttest_isactive"))
						.auditDetails(auditDetails).build();
				
				tests.add(test);
			}
			currentEmployee.setTests(tests);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Departmental Tests: ",e);
		}
	}
	
	/**
	 * Maps ServiceHistory inside a ResultSet to the ServiceHistory POJO inside employee object.
	 * 
	 * @param rs
	 * @param currentEmployee
	 */
	public void setServiceHistory(ResultSet rs, Employee currentEmployee) {
		try {
			List<ServiceHistory> history = new ArrayList<>();
			if(CollectionUtils.isEmpty(currentEmployee.getServiceHistory()))
				history = new ArrayList<ServiceHistory>();
			else
				history = currentEmployee.getServiceHistory();
			
			List<String> ids = history.stream().map(ServiceHistory::getId).collect(Collectors.toList());
			if(!StringUtils.isEmpty(rs.getString("history_uuid")) && !ids.contains(rs.getString("history_uuid"))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("history_createdby")).createdDate(rs.getLong("history_createddate"))
						.lastModifiedBy(rs.getString("history_lastmodifiedby")).lastModifiedDate(rs.getLong("history_lastmodifieddate")).build();
				
				ServiceHistory service = ServiceHistory.builder().id(rs.getString("history_uuid")).serviceStatus(rs.getString("history_servicestatus")).serviceFrom(rs.getLong("history_servicefrom"))
						.serviceTo(null == rs.getObject("history_serviceto")? null :rs.getLong("history_serviceto")).orderNo(rs.getString("history_ordernumber")).isCurrentPosition(rs.getBoolean("history_iscurrentposition"))
						.location(rs.getString("history_location")).tenantId(rs.getString("history_tenantid")).auditDetails(auditDetails).build();
				
				history.add(service);
			}
			currentEmployee.setServiceHistory(history);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Service History: ",e);
		}
	
	}
	
	/**
	 * Maps Documents inside a ResultSet to the Document POJO inside employee object.
	 * 
	 * @param rs
	 * @param currentEmployee
	 */
	public void setDocuments(ResultSet rs, Employee currentEmployee) {
		try {
			List<EmployeeDocument> documents = new ArrayList<>();
			if(CollectionUtils.isEmpty(currentEmployee.getDocuments()))
				documents = new ArrayList<EmployeeDocument>();
			else
				documents = currentEmployee.getDocuments();
			
			List<String> ids = documents.stream().map(EmployeeDocument::getId).collect(Collectors.toList());
			if(!StringUtils.isEmpty(rs.getString("docs_uuid")) && !ids.contains(rs.getString("docs_uuid")) ) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("docs_createdby")).createdDate(rs.getLong("docs_createddate"))
						.lastModifiedBy(rs.getString("docs_lastmodifiedby")).lastModifiedDate(rs.getLong("docs_lastmodifieddate")).build();
				EmployeeDocument document = EmployeeDocument.builder().id(rs.getString("docs_uuid")).documentId(rs.getString("docs_documentid"))
						.documentName(rs.getString("docs_documentname")).referenceType(rs.getString("docs_referencetype") != null ? ReferenceType.valueOf(rs.getString("docs_referencetype")): null)
						.referenceId(rs.getString("docs_referenceid")).tenantId(rs.getString("docs_tenantid")).auditDetails(auditDetails).build();
				
				documents.add(document);
			}
			currentEmployee.setDocuments(documents);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Service History: ",e);
		}
	}
	
	/**
	 * Maps DeactivationDetails inside a ResultSet to the DeactivationDetail POJO inside employee object.
	 * 
	 * @param rs
	 * @param currentEmployee
	 */
	public void setDeactivationDetails(ResultSet rs, Employee currentEmployee) {
		try {
			List<DeactivationDetails> deactDetails = new ArrayList<>();
			if(CollectionUtils.isEmpty(currentEmployee.getDeactivationDetails()))
				deactDetails = new ArrayList<DeactivationDetails>();
			else
				deactDetails = currentEmployee.getDeactivationDetails();
			
			List<String> ids = deactDetails.stream().map(DeactivationDetails::getId).collect(Collectors.toList());
			if(!StringUtils.isEmpty(rs.getString("deact_uuid")) && !ids.contains(rs.getString("deact_uuid")) ) {
				if(rs.getString("deact_uuid")!=null){
					AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("deact_createdby")).createdDate(rs.getLong("deact_createddate"))
							.lastModifiedBy(rs.getString("deact_lastmodifiedby")).lastModifiedDate(rs.getLong("deact_lastmodifieddate")).build();

					DeactivationDetails deactDetail = DeactivationDetails.builder().id(rs.getString("deact_uuid")).reasonForDeactivation(rs.getString("deact_reasonfordeactivation"))
							.effectiveFrom(rs.getLong("deact_effectivefrom")).orderNo(rs.getString("deact_ordernumber")).remarks(rs.getString("deact_remarks")!= null ? (rs.getString("deact_remarks")) : null)
							.tenantId(rs.getString("deact_tenantid")).auditDetails(auditDetails).build();

					deactDetails.add(deactDetail);
				}
			}
			currentEmployee.setDeactivationDetails(deactDetails);

		}catch(Exception e) {
			log.error("Error in row mapper while mapping Service History: ",e);
		}
	}

}
