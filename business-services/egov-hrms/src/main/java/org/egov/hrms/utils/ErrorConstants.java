package org.egov.hrms.utils;

import org.springframework.stereotype.Component;

@Component
public class ErrorConstants {
	
	public static final String HRMS_USER_EXIST_MOB_CODE = "ERR_HRMS_USER_EXIST_MOB";
	public static final String HRMS_USER_EXIST_MOB_MSG = "User already exists for the entered mobile number. Use a different mobile number to proceed.";
	
	public static final String HRMS_USER_EXIST_USERNAME_CODE = "ERR_HRMS_USER_EXIST_USERNAME";
	public static final String HRMS_USER_EXIST_USERNAME_MSG = "User already exists for the entered user name.";
	
	public static final String HRMS_INVALID_MOB_NO_CODE = "ERR_HRMS_INVALID_MOB_NO";
	public static final String HRMS_INVALID_MOB_NO_MSG = "Invalid mobile number entered.";
	
	public static final String HRMS_MISSING_ROLES_CODE = "ERR_HRMS_MISSING_ROLES";
	public static final String HRMS_INVALID_ROLES_MSG = "Invalid mobile number entered.";
	
	public static final String HRMS_INVALID_ROLE_CODE = "ERR_HRMS_INVALID_ROLE";
	public static final String HRMS_INVALID_ROLE_MSG = "Invalid role assigned to the employee.";
	
	public static final String HRMS_INVALID_EMP_STATUS_CODE = "ERR_HRMS_INVALID_EMP_STATUS_ROLE";
	public static final String HRMS_INVALID_EMP_STATUS_MSG = "Invalid employment status entered.";
	
	public static final String HRMS_INVALID_EMP_TYPE_CODE = "ERR_HRMS_INVALID_EMP_TYPE";
	public static final String HRMS_INVALID_EMP_TYPE_MSG = "Invalid employee type entered.";
	
	public static final String HRMS_INVALID_DATE_OF_APPOINTMENT_CODE = "ERR_HRMS_INVALID_DATE_OF_APPOINTMENT";
	public static final String HRMS_INVALID_DATE_OF_APPOINTMENT_MSG = "Invalid employee date of appointment entered by the user.";
	
	public static final String HRMS_INVALID_DATE_OF_APPOINTMENT_DOB_CODE = "ERR_HRMS_INVALID_DATE_OF_APPOINTMENT_DOB";
	public static final String HRMS_INVALID_DATE_OF_APPOINTMENT_DOB_MSG = "Employee date of appointment can not be before date of birth.";
	
	public static final String HRMS_INVALID_DOB_CODE = "ERR_HRMS_INVALID_DOB";
	public static final String HRMS_INVALID_DOB_MSG = "Invalid date of birth entered.";
	
	public static final String HRMS_INVALID_CURRENT_ASSGN_CODE = "ERR_HRMS_INVALID_CURRENT_ASSGN";
	public static final String HRMS_INVALID_CURRENT_ASSGN_MSG = "There should be exactly one current assignment for the employee.";
	
	public static final String HRMS_OVERLAPPING_ASSGN_CODE = "ERR_HRMS_OVERLAPPING_ASSGN";
	public static final String HRMS_OVERLAPPING_ASSGN_MSG = "There should not be overlapping period of assignments for the employee.";

	public static final String HRMS_OVERLAPPING_ASSGN_CURRENT_CODE = "ERR_HRMS_OVERLAPPING_ASSGN_CURRENT";
	public static final String HRMS_OVERLAPPING_ASSGN_CURRENT_MSG = "Period of assignements of employee should not be after  current assignment.";

	public static final String HRMS_INVALID_DEPT_CODE = "ERR_HRMS_INVALID_DEPT";
	public static final String HRMS_INVALID_DEPT_MSG = "Invalid department of employee entered.";
	
	public static final String HRMS_INVALID_DESG_CODE = "ERR_HRMS_INVALID_DESG";
	public static final String HRMS_INVALID_DESG_MSG = "Invalid designation of employee.";
	
	public static final String HRMS_INVALID_ASSIGNMENT_PERIOD_CODE = "ERR_HRMS_INVALID_ASSIGNMENT_PERIOD";
	public static final String HRMS_INVALID_ASSIGNMENT_PERIOD_MSG = "Invalid period of assignment (From date - To date).";

	public static final String HRMS_INVALID_ASSIGNMENT_CURRENT_TO_DATE_CODE = "ERR_HRMS_INVALID_ASSIGNMENT_CURRENT_TO_DATE";
	public static final String HRMS_INVALID_ASSIGNMENT_CURRENT_TO_DATE_MSG = "To Date field should be blank for current assignment of the employee.";

	public static final String HRMS_OVERLAPPING_SERVICEHISTORY_CURRENT_CODE = "ERR_HRMS_OVERLAPPING_SERVICEHISTORY_CURRENT";
	public static final String HRMS_OVERLAPPING_SERVICEHISTORY_CURRENT_MSG = "Period of service details of employee should not be after  current assignment!";


	public static final String HRMS_INVALID_ASSIGNMENT_NON_CURRENT_TO_DATE_CODE = "ERR_HRMS_INVALID_ASSIGNMENT_NOT_CURRENT_TO_DATE";
	public static final String HRMS_INVALID_ASSIGNMENT_NON_CURRENT_TO_DATE_MSG = "To date field should not be blank for non current assignment of the employee.";

	public static final String HRMS_INVALID_ASSIGNMENT_DATES_CODE = "ERR_HRMS_INVALID_ASSIGNMENT_DATES";
	public static final String HRMS_INVALID_ASSIGNMENT_DATES_MSG = "Employee period of assignment (From Date or To date) can not be before date of birth.";

	public static final String HRMS_INVALID_ASSIGNMENT_DATES_APPOINTMENT_CODE = "ERR_HRMS_INVALID_ASSIGNMENT_DATES_APPOINTMENT";
	public static final String HRMS_INVALID_ASSIGNMENT_DATES_APPOINTMENT_MSG = "Employee period of assignment (From Date or To date) can not be before date of appointment.";

	public static final String HRMS_INVALID_SERVICE_STATUS_CODE = "ERR_HRMS_INVALID_SERVICE_STATUS";
	public static final String HRMS_INVALID_SERVICE_STATUS_MSG = "Service stataus of employee is invalid.";

	public static final String HRMS_INVALID_SERVICE_PERIOD_CODE = "ERR_HRMS_INVALID_SERVICE_PERIOD";
	public static final String HRMS_INVALID_SERVICE_PERIOD_MSG = "Service period (From date or To date) of employee is invalid.";
	
	public static final String HRMS_INVALID_SERVICE_DATES_CODE = "ERR_HRMS_INVALID_SERVICE_DATES";
	public static final String HRMS_INVALID_SERVICE_DATES_MSG = "Employee service period (From date or To date) can not be before date of birth.";

	public static final String HRMS_INVALID_SERVICE_CURRENT_TO_DATE_CODE = "ERR_HRMS_INVALID_SERVICE_CURRENT_TO_DATE";
	public static final String HRMS_INVALID_SERVICE_CURRENT_TO_DATE_MSG = "To Date of service period should be blank for currently working employees.";

	public static final String HRMS_INVALID_SERVICE_NON_CURRENT_TO_DATE_CODE = "ERR_HRMS_INVALID_SERVICE_NOT_CURRENT_TO_DATE";
	public static final String HRMS_INVALID_SERVICE_NON_CURRENT_TO_DATE_MSG = "To Date of service period should not be blank for currently non working employees.";

	public static final String HRMS_INVALID_CURRENT_SERVICE_CODE = "ERR_HRMS_INVALID_SERVICE_ASSGN";
	public static final String HRMS_INVALID_CURRENT_SERVICE_MSG = "There should be maximum one currently working service for the employee.";

	public static final String HRMS_INVALID_QUALIFICATION_CODE = "ERR_HRMS_INVALID_QUALIFICATION";
	public static final String HRMS_INVALID_QUALIFICATION_MSG = "Qualification of the employee is invalid.";
	
	public static final String HRMS_INVALID_EDUCATIONAL_STREAM_CODE = "ERR_HRMS_INVALID_EDUCATIONAL_STREAM";
	public static final String HRMS_INVALID_EDUCATIONAL_STREAM_MSG = "Education stream of the employee is invalid.";
	
	public static final String HRMS_INVALID_EDUCATIONAL_PASSING_YEAR_CODE = "ERR_HRMS_INVALID_EDUCATIONAL_PASSING_YEAR";
	public static final String HRMS_INVALID_EDUCATIONAL_PASSING_YEAR_MSG = "Education year of passing of the employee can not be before date of birth.";
	
	public static final String HRMS_INVALID_DEPARTMENTAL_TEST_CODE = "ERR_HRMS_INVALID_DEPARTMENTAL_TEST";
	public static final String HRMS_INVALID_DEPARTMENTAL_TEST_MSG = "Departmental evaluation test of the employee is invalid.";
	
	public static final String HRMS_INVALID_DEPARTMENTAL_TEST_PASSING_YEAR_CODE = "ERR_HRMS_INVALID_DEPARTMENTAL_TEST_PASSING_YEAR";
	public static final String HRMS_INVALID_DEPARTMENTAL_TEST_PASSING_YEAR_MSG = "Departmental evaluation test passing  year of the employee can not be before date of birth.";
	
	public static final String HRMS_INVALID_DEACT_REQUEST_CODE = "ERR_HRMS_INVALID_DEACT_REQUEST";
	public static final String HRMS_INVALID_DEACT_REQUEST_MSG = "Employee active flag should be set as false during deactivation.";

	public static final String HRMS_INVALID_DEACT_REASON_CODE = "ERR_HRMS_INVALID_DEACT_REASON";
	public static final String HRMS_INVALID_DEACT_REASON_MSG = "Employee deactivation reason is invalid.";

	public static final String HRMS_UPDATE_JURISDICTION_INCOSISTENT_CODE = "ERR_HRMS_UPDATE_JURISDICTION_INCOSISTENT";
	public static final String HRMS_UPDATE_JURISDICTION_INCOSISTENT_MSG = "Jurisdiction data in an update request should contain all previously entered data.";
	
	public static final String HRMS_UPDATE_ASSIGNEMENT_INCOSISTENT_CODE = "ERR_HRMS_UPDATE_ASSIGNEMENT_INCOSISTENT";
	public static final String HRMS_UPDATE_ASSIGNEMENT_INCOSISTENT_MSG = "Assignment data in an update request should contain all previously entered data.";
	
	public static final String HRMS_UPDATE_TESTS_INCOSISTENT_CODE = "ERR_HRMS_UPDATE_TESTS_INCOSISTENT";
	public static final String HRMS_UPDATE_TESTS_INCOSISTENT_MSG = "Employee evaluation test data in an update request should contain all previously entered data.";
	
	public static final String HRMS_UPDATE_EDUCATION_INCOSISTENT_CODE = "ERR_HRMS_UPDATE_EDUCATION_INCOSISTENT";
	public static final String HRMS_UPDATE_EDUCATION_INCOSISTENT_MSG = "Education data in an update request should contain all previously entered data.";
	
	public static final String HRMS_UPDATE_SERVICE_HISTORY_INCOSISTENT_CODE = "ERR_HRMS_UPDATE_SERVICE_HISTORY_INCOSISTENT";
	public static final String HRMS_UPDATE_SERVICE_HISTORY_INCOSISTENT_MSG = "Service history data in an update request should contain all previously entered data.";
	
	public static final String HRMS_UPDATE_DOCUMENT_INCOSISTENT_CODE = "ERR_HRMS_UPDATE_DOCUMENT_INCOSISTENT";
	public static final String HRMS_UPDATE_DOCUMENT_INCOSISTENT_MSG = "Employee document data in an update request should contain all previously entered data.";
	
	public static final String HRMS_UPDATE_DEACT_DETAILS_INCOSISTENT_CODE = "ERR_HRMS_UPDATE_DEACT_DETAILS_INCOSISTENT";
	public static final String HRMS_UPDATE_DEACT_DETAILS_INCOSISTENT_MSG = "Employee deactivation data in an update request should contain all previously entered data.";
	
	public static final String HRMS_UPDATE_NULL_ID_CODE = "ERR_HRMS_UPDATE_NULL_ID";
	public static final String HRMS_UPDATE_NULL_ID_MSG = "Employee ID in an update request should not be null.";
	
	public static final String HRMS_UPDATE_NULL_CODE_CODE = "ERR_HRMS_UPDATE_NULL";
	public static final String HRMS_UPDATE_NULL_CODE_MSG = "Employee Code in an update request should not be null.";
	
	public static final String HRMS_UPDATE_NULL_UUID_CODE = "ERR_HRMS_UPDATE_NULL_UUID";
	public static final String HRMS_UPDATE_NULL_UUID_MSG = "Employee UUID in an update request should not be null.";
	
	public static final String HRMS_USER_CREATION_FAILED_CODE = "ERR_HRMS_USER_CREATION_FAILED";
	public static final String HRMS_USER_CREATION_FAILED_MSG = "User creation failed at the user service.";
	
	public static final String HRMS_USER_UPDATION_FAILED_CODE = "ERR_HRMS_USER_UPDATION_FAILED";
	public static final String HRMS_USER_UPDATION_FAILED_MSG = "User updation failed at the user service.";
	
	public static final String HRMS_INVALID_SEARCH_REQ_CODE = "ERR_HRMS_INVALID_SEARCH_REQ";
	public static final String HRMS_INVALID_SEARCH_REQ_MSG = "Open search is disabled for this user.";

	public static final String HRMS_INVALID_JURISDICTION_HEIRARCHY_CODE = "ERR_HRMS_INVALID_JURISDICTION_HEIRARCHY";
	public static final String HRMS_INVALID_JURISDICTION_HEIRARCHY_MSG = "Jurisiction hierarchy value is invalid.";

	public static final String HRMS_INVALID_JURISDICTION_BOUNDARY_TYPE_CODE = "ERR_HRMS_INVALID_BOUNDARY_TYPE_HEIRARCHY";
	public static final String HRMS_INVALID_JURISDICTION_BOUNDARY_TYPE_MSG = "Jurisiction boundary type value is invalid.";

	public static final String HRMS_INVALID_JURISDICTION_BOUNDARY_CODE = "ERR_HRMS_INVALID_JURISDICTION_BOUNDARY";
	public static final String HRMS_INVALID_JURISDICTION_BOUNDARY_MSG = "Jurisiction boundary value is invalid.";

	public static final String HRMS_INVALID_JURISDICTION_ACTIIEV_NULL_CODE = "ERR_HRMS_INVALID_JURISDICTION_ACTIIEV_NULL";
	public static final String HRMS_INVALID_JURISDICTION_ACTIIEV_NULL_MSG = "Jurisiction should have atleast 1 active data";

	public static final String HRMS_INVALID_SEARCH_AOD_CODE = "ERR_HRMS_INVALID_SEARCH_AOD";
	public static final String HRMS_INVALID_SEARCH_AOD_MSG = "Along with as on date, atleast one department and designation need to be passed as search criteria.";

	public static final String HRMS_INVALID_SEARCH_ROLES_CODE = "ERR_HRMS_INVALID_SEARCH_ROLES";
	public static final String HRMS_INVALID_SEARCH_ROLES_MSG = "For search based on roles, passing of tenant id is mandatory.";

	public static final String HRMS_INVALID_SEARCH_USER_CODE = "ERR_HRMS_INVALID_SEARCH_USER";
	public static final String HRMS_INVALID_SEARCH_USER_MSG = "For search based on phone number and name, passing of tenant id is mandatory.";

	public static final String HRMS_UPDATE_EMPLOYEE_CODE_CHANGE_CODE = "ERR_HRMS_UPDATE_EMPLOYEE_CODE_CHANGE";
	public static final String HRMS_UPDATE_EMPLOYEE_CODE_CHANGE_MSG = "Employee code can not be changed in an update request.";
	public static final String HRMS_UPDATE_EMPLOYEE_NOT_EXIST_CODE = "ERR_HRMS_UPDATE_EMPLOYEE_NOT_EXIST_CODE";
	public static final String HRMS_UPDATE_EMPLOYEE_NOT_EXIST_MSG = "No employee found for given UUID.";

	public static final String HRMS_UPDATE_EXISTING_MOBNO_CODE = "ERR_HRMS_UPDATE_EXISTING_MOBNO";
	public static final String HRMS_UPDATE_EXISTING_MOBNO_MSG = "User exist for given mobile no";

	public static final String HRMS_BULK_CREATE_DUPLICATE_MOBILE_CODE = "ERR_HRMS_BULK_CREATE_DUPLICATE_MOBILE";
	public static final String HRMS_BULK_CREATE_DUPLICATE_MOBILE_MSG = "Bulk request has duplicate mobile number ";

	public static final String HRMS_BULK_CREATE_DUPLICATE_EMPCODE_CODE = "ERR_HRMS_BULK_CREATE_DUPLICATE_EMPCODE";
	public static final String HRMS_BULK_CREATE_DUPLICATE_EMPCODE_MSG = "Bulk request has duplicate employee code ";

	public static final String HRMS_UPDATE_DEACT_DETAILS_INCORRECT_EFFECTIVEFROM_CODE = "ERR_HRMS_UPDATE_DEACT_DETAILS_INCORRECT_EFFECTIVEFROM";
	public static final String HRMS_UPDATE_DEACT_DETAILS_INCORRECT_EFFECTIVEFROM_MSG = "Employee deactivation effective date should not be future date.";

	public static final String HRMS_GENERATE_ID_ERROR_CODE = "ERR_HRMS_GENERATE_ID_ERROR";
	public static final String HRMS_GENERATE_ID_ERROR_MSG = "Unable to create ids " ;

}
