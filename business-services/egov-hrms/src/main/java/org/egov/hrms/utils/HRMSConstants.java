package org.egov.hrms.utils;

import org.springframework.stereotype.Component;

@Component
public class HRMSConstants {
	
	public static final String HRMS_MDMS_COMMON_MASTERS_CODE = "common-masters";
	public static final String HRMS_MDMS_HR_MASTERS_CODE = "egov-hrms";
	public static final String HRMS_AC_ROLES_MASTERS_CODE = "ACCESSCONTROL-ROLES";
	public static final String HRMS_MDMS_EGOV_LOCATION_MASTERS_CODE = "egov-location";
	
	public static final String HRMS_MDMS_DEPT_CODE = "Department";
	public static final String HRMS_MDMS_DESG_CODE = "Designation";
	public static final String HRMS_MDMS_EMP_STATUS_CODE = "EmployeeStatus";
	public static final String HRMS_MDMS_EMP_TYPE_CODE = "EmployeeType";
	public static final String HRMS_MDMS_SERVICE_STATUS_CODE = "ServiceStatus";
	public static final String HRMS_MDMS_ROLES_CODE = "roles";
	public static final String HRMS_MDMS_QUALIFICATION_CODE = "Degree";
	public static final String HRMS_MDMS_STREAMS_CODE = "Specalization";
	public static final String HRMS_MDMS_YEAR_CODE = "Year";
	public static final String HRMS_MDMS_DEPT_TEST_CODE = "EmploymentTest";
	public static final String HRMS_MDMS_DEACT_REASON_CODE = "DeactivationReason";
	public static final String HRMS_MDMS_TENANT_BOUNDARY_CODE = "TenantBoundary";
	
	public static final String HRMS_LOCALIZATION_CODES_JSONPATH = "$.messages.*.code";
	public static final String HRMS_LOCALIZATION_MSGS_JSONPATH = "$.messages.*.message";
	
	
	public static final String HRMS_EMP_CREATE_LOCLZN_CODE = "hrms.employee.create.notification";
	public static final String HRMS_LOCALIZATION_MODULE_CODE = "egov-hrms";
	public static final String HRMS_LOCALIZATION_ENG_LOCALE_CODE = "en_IN";
	public static final String HRMS_TENANTBOUNDARY_HIERARCHY_JSONPATH = "$.TenantBoundary[*].hierarchyType.code";
	public static final String HRMS_TENANTBOUNDARY_BOUNDARY_TYPE_JSONPATH  ="$.TenantBoundary[?(@.hierarchyType.name==\"%s\")]..label";
	public static final String HRMS_TENANTBOUNDARY_BOUNDARY_VALUE_JSONPATH ="$.TenantBoundary[?(@.hierarchyType.name==\"%s\")]..code";

	public static final String HRMS_MDMS_AC_ROLES_FILTER = "[?(@.code != \"CITIZEN\")].code";
	public static final String HRMS_MDMS_CODE_FLITER = "[?(@.active == true)].code";

	public static final String HRMS_USER_SEARCH_CRITERA_UUID = "uuid";
	public static final String HRMS_USER_SEARCH_CRITERA_ROLECODES = "roleCodes";
	public static final String HRMS_USER_SEARCH_CRITERA_TENANTID = "tenantId";
	public static final String HRMS_USER_SEARCH_CRITERA_MOBILENO = "mobileNumber";
	public static final String HRMS_USER_SEARCH_CRITERA_NAME = "name";
	public static final String HRMS_USER_SEARCH_CRITERA_USERNAME = "UserName";
	public static final String HRMS_USER_SERACH_CRITERIA_USERTYPE = "EMPLOYEE";
	public static final String HRMS_USER_SERACH_CRITERIA_USERTYPE_CODE = "userType";

}
