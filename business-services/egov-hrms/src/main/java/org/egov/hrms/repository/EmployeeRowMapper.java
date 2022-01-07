package org.egov.hrms.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.hrms.model.*;
import org.egov.hrms.model.enums.EmployeeDocumentReferenceType;
import org.egov.hrms.web.contract.User;
import org.egov.tracer.model.CustomException;
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

	private final String ASSIGNMENT_UUID="assignment_uuid";

	private final String ROWMAPPER_ERROR="ROWMAPPER_ERROR";

	private final String JURISDICTION_ISACTIVE="jurisdiction_isactive";

	private final String JURISDICTION_UUID="jurisdiction_uuid";

	private final String EDUCATION_ISACTIVE="education_isactive";

	private final String EDUCATION_UUID="education_uuid";

	private final String DEPTTEST_ISACTIVE="depttest_isactive";

	private final String DEPTTEST_UUID="depttest_uuid";

	private final String HISTORY_UUID="history_uuid";

	private final String DOCS_UUID="docs_uuid";

	private final String DEACT_UUID="deact_uuid";

	private final String REACT_UUID="react_uuid";

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
						.employeeStatus(rs.getString("employee_status")).employeeType(rs.getString("employee_type")).auditDetails(auditDetails).reActivateEmployee(rs.getBoolean("employee_reactive"))
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
		setReactivationDetails(rs, currentEmployee);
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
			if(!StringUtils.isEmpty(rs.getString(ASSIGNMENT_UUID)) && !ids.contains(rs.getString(ASSIGNMENT_UUID))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("assignment_createdby")).createdDate(rs.getLong("assignment_createddate"))
						.lastModifiedBy(rs.getString("assignment_lastmodifiedby")).lastModifiedDate(rs.getLong("assignment_lastmodifieddate")).build();
				
				Assignment assignment = Assignment.builder().id(rs.getString(ASSIGNMENT_UUID)).position(rs.getLong("assignment_position")).department(rs.getString("assignment_department"))
				.designation(rs.getString("assignment_designation")).fromDate(rs.getLong("assignment_fromdate")).toDate(null == rs.getObject("assignment_todate")? null : rs.getLong("assignment_todate"))
			    .govtOrderNumber(rs.getString("assignment_govtordernumber")).reportingTo(rs.getString("assignment_reportingto")).isHOD(rs.getBoolean("assignment_ishod"))
				.isCurrentAssignment(rs.getBoolean("assignment_iscurrentassignment")).tenantid(rs.getString("assignment_tenantid")).auditDetails(auditDetails).build();
				
				assignments.add(assignment);
			}
			currentEmployee.setAssignments(assignments);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Assignments: ",e);
			throw new CustomException(ROWMAPPER_ERROR ,"Error in row mapper while mapping Assignments");
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
			Boolean isActive =  rs.getBoolean(JURISDICTION_ISACTIVE) !=false;
			if(isActive && !StringUtils.isEmpty(rs.getString(JURISDICTION_UUID)) && !ids.contains(rs.getString(JURISDICTION_UUID))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("jurisdiction_createdby")).createdDate(rs.getLong("jurisdiction_createddate"))
						.lastModifiedBy(rs.getString("jurisdiction_lastmodifiedby")).lastModifiedDate(rs.getLong("jurisdiction_lastmodifieddate")).build();
				
				Jurisdiction jurisdiction = Jurisdiction.builder().id(rs.getString(JURISDICTION_UUID)).hierarchy(rs.getString("jurisdiction_hierarchy"))
						.boundary(rs.getString("jurisdiction_boundary")).boundaryType(rs.getString("jurisdiction_boundarytype"))
						.tenantId(rs.getString("jurisdiction_tenantid"))
						.isActive(null == rs.getObject(JURISDICTION_ISACTIVE)?true:rs.getBoolean(JURISDICTION_ISACTIVE))
						.auditDetails(auditDetails).build();
				
				jurisdictions.add(jurisdiction);
			}
			currentEmployee.setJurisdictions(jurisdictions);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Jurisdictions: ",e);
			throw new CustomException(ROWMAPPER_ERROR ,"Error in row mapper while mapping Jurisdictions");
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
			Boolean isActive =rs.getBoolean(EDUCATION_ISACTIVE) !=false;
			if( isActive &&!StringUtils.isEmpty( rs.getString(EDUCATION_UUID)) && !ids.contains(rs.getString(EDUCATION_UUID))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("education_createdby")).createdDate(rs.getLong("education_createddate"))
						.lastModifiedBy(rs.getString("education_lastmodifiedby")).lastModifiedDate(rs.getLong("education_lastmodifieddate")).build();
				EducationalQualification education = EducationalQualification.builder().id(rs.getString(EDUCATION_UUID)).qualification(rs.getString("education_qualification")).stream(rs.getString("education_stream"))
						.yearOfPassing(rs.getLong("education_yearofpassing")).university(rs.getString("education_university")).remarks(rs.getString("education_remarks"))
						.tenantId(rs.getString("education_tenantid"))
						.isActive(null == rs.getObject(EDUCATION_ISACTIVE)?true:rs.getBoolean(EDUCATION_ISACTIVE))
						.auditDetails(auditDetails).build();
				
				educationDetails.add(education);
			}
			currentEmployee.setEducation(educationDetails);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Educational Details: ",e);
			throw new CustomException(ROWMAPPER_ERROR ,"Error in row mapper while mapping Educational Details");
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
			Boolean isActive = rs.getBoolean(DEPTTEST_ISACTIVE) !=false;
			if(isActive  && !StringUtils.isEmpty(rs.getString(DEPTTEST_UUID)) && !ids.contains(rs.getString(DEPTTEST_UUID))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("depttest_createdby")).createdDate(rs.getLong("depttest_createddate"))
						.lastModifiedBy(rs.getString("depttest_lastmodifiedby")).lastModifiedDate(rs.getLong("depttest_lastmodifieddate")).build();
				
				DepartmentalTest test = DepartmentalTest.builder().id(rs.getString(DEPTTEST_UUID)).test(rs.getString("depttest_test")).yearOfPassing(rs.getLong("depttest_yearofpassing"))
						.remarks(rs.getString("depttest_remarks")).tenantId(rs.getString("depttest_tenantid"))
						.isActive(null == rs.getObject(DEPTTEST_ISACTIVE)?true:rs.getBoolean(DEPTTEST_ISACTIVE))
						.auditDetails(auditDetails).build();
				
				tests.add(test);
			}
			currentEmployee.setTests(tests);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Departmental Tests: ",e);
			throw new CustomException(ROWMAPPER_ERROR ,"Error in row mapper while mapping Departmental Tests");
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
			if(!StringUtils.isEmpty(rs.getString(HISTORY_UUID)) && !ids.contains(rs.getString(HISTORY_UUID))) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("history_createdby")).createdDate(rs.getLong("history_createddate"))
						.lastModifiedBy(rs.getString("history_lastmodifiedby")).lastModifiedDate(rs.getLong("history_lastmodifieddate")).build();
				
				ServiceHistory service = ServiceHistory.builder().id(rs.getString(HISTORY_UUID)).serviceStatus(rs.getString("history_servicestatus")).serviceFrom(rs.getLong("history_servicefrom"))
						.serviceTo(null == rs.getObject("history_serviceto")? null :rs.getLong("history_serviceto")).orderNo(rs.getString("history_ordernumber")).isCurrentPosition(rs.getBoolean("history_iscurrentposition"))
						.location(rs.getString("history_location")).tenantId(rs.getString("history_tenantid")).auditDetails(auditDetails).build();
				
				history.add(service);
			}
			currentEmployee.setServiceHistory(history);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping Service History: ",e);
			throw new CustomException(ROWMAPPER_ERROR ,"Error in row mapper while mapping Service History");
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
			if(!StringUtils.isEmpty(rs.getString(DOCS_UUID)) && !ids.contains(rs.getString(DOCS_UUID)) ) {
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("docs_createdby")).createdDate(rs.getLong("docs_createddate"))
						.lastModifiedBy(rs.getString("docs_lastmodifiedby")).lastModifiedDate(rs.getLong("docs_lastmodifieddate")).build();
				EmployeeDocument document = EmployeeDocument.builder().id(rs.getString(DOCS_UUID)).documentId(rs.getString("docs_documentid"))
						.documentName(rs.getString("docs_documentname")).referenceType(rs.getString("docs_referencetype") != null ? EmployeeDocumentReferenceType.valueOf(rs.getString("docs_referencetype")): null)
						.referenceId(rs.getString("docs_referenceid")).tenantId(rs.getString("docs_tenantid")).auditDetails(auditDetails).build();
				
				documents.add(document);
			}
			currentEmployee.setDocuments(documents);
		}catch(Exception e) {
			log.error("Error in row mapper while mapping document: ",e);
			throw new CustomException(ROWMAPPER_ERROR ,"Error in row mapper while mapping document");

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
			if(!StringUtils.isEmpty(rs.getString(DEACT_UUID)) && !ids.contains(rs.getString(DEACT_UUID)) ) {
				if(rs.getString(DEACT_UUID)!=null){
					AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("deact_createdby")).createdDate(rs.getLong("deact_createddate"))
							.lastModifiedBy(rs.getString("deact_lastmodifiedby")).lastModifiedDate(rs.getLong("deact_lastmodifieddate")).build();

					DeactivationDetails deactDetail = DeactivationDetails.builder().id(rs.getString(DEACT_UUID)).reasonForDeactivation(rs.getString("deact_reasonfordeactivation"))
							.effectiveFrom(rs.getLong("deact_effectivefrom")).orderNo(rs.getString("deact_ordernumber")).remarks(rs.getString("deact_remarks")!= null ? (rs.getString("deact_remarks")) : null)
							.tenantId(rs.getString("deact_tenantid")).auditDetails(auditDetails).build();

					deactDetails.add(deactDetail);
				}
			}
			currentEmployee.setDeactivationDetails(deactDetails);

		}catch(Exception e) {
			log.error("Error in row mapper while mapping deactivation details: ",e);
			throw new CustomException(ROWMAPPER_ERROR ,"Error in row mapper while mapping deactivation details");
		}
	}

	public void setReactivationDetails(ResultSet rs, Employee currentEmployee){
		try {
			List<ReactivationDetails> reactDetails = new ArrayList<>();
			if(CollectionUtils.isEmpty(currentEmployee.getReactivationDetails()))
				reactDetails = new ArrayList<ReactivationDetails>();
			else
				reactDetails = currentEmployee.getReactivationDetails();

			List<String> ids = reactDetails.stream().map(ReactivationDetails::getId).collect(Collectors.toList());
			if(!StringUtils.isEmpty(rs.getString(REACT_UUID)) && !ids.contains(rs.getString(REACT_UUID)) ) {
				if(rs.getString(REACT_UUID)!=null){
					AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("react_createdby")).createdDate(rs.getLong("react_createddate"))
							.lastModifiedBy(rs.getString("react_lastmodifiedby")).lastModifiedDate(rs.getLong("react_lastmodifieddate")).build();

					ReactivationDetails reactDetail = ReactivationDetails.builder().id(rs.getString(REACT_UUID)).reasonForReactivation(rs.getString("react_reasonforreactivation"))
							.effectiveFrom(rs.getLong("react_effectivefrom")).orderNo(rs.getString("react_ordernumber")).remarks(rs.getString("react_remarks")!= null ? (rs.getString("react_remarks")) : null)
							.tenantId(rs.getString("react_tenantid")).auditDetails(auditDetails).build();

					reactDetails.add(reactDetail);
				}
			}
			currentEmployee.setReactivationDetails(reactDetails);

		}catch(Exception e) {
			log.error("Error in row mapper while mapping reactivation details ",e);
			throw new CustomException(ROWMAPPER_ERROR ,"Error in row mapper while mapping reactivation details");
		}
	}

}
