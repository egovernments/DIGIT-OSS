package org.egov.pgr.utils;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;


@Component
public class PGRConstants {
	
	private PGRConstants() {}

	public static final String SERV_REQ_ID_NAME = "rainmaker.pgr.servicerequestid";
	public static final String SERV_REQ_ID_FORMAT = "[cy:dd]/[cy:MM]/[cy:yyyy]/[SEQ_EG_PGR_SERVICEREQUESTID]";
		
	//Notification
	public static final String TEMPLATE_COMPLAINT_EMAIL = "./src/main/resources/email-templates/velocityEmailNotifSample.vm";
	
	
	public static final String SEARCHER_PGR_MOD_NAME = "rainmaker-pgr-V2";
	public static final String SEARCHER_SRSEARCH_DEF_NAME = "serviceSearchWithDetails";
	public static final String SEARCHER_PLAINSEARCH_DEF_NAME = "plainSearch";
	public static final String SEARCHER_COUNT_DEF_NAME = "count";
	public static final String PG_JSONPATH_COUNT = "$.count[0].count";
	public static final String SEARCHER_SRID_ASSIGNEDTO_DEF_NAME = "getServiceRequestsOnAssignedTo";
	public static final String SRID_ASSIGNEDTO_JSONPATH = "$.servicesRequestIds.*.businesskey";
	public static final String MDMS_PGR_MOD_NAME = "RAINMAKER-PGR";
	public static final String MDMS_SERVICETYPE_MASTER_NAME = "ServiceDefs";
	public static final String MDMS_COMMON_MASTERS_MODULE_NAME = "common-masters";
	public static final String MDMS_DEPT_MASTERS_MASTER_NAME = "Department";
	public static final String MDMS_DESIGNATION_MASTERS_MASTER_NAME = "Designation";
	public static final String LOCALIZATION_MODULE_NAME = "rainmaker-pgr";
	

	public static final String LOCALIZATION_CODE_SUBMIT_CITIZEN = "pgr.sms.notification.submit.citizen";
	
	public static final String LOCALIZATION_CODE_REOPEN_CITIZEN = "pgr.sms.notification.reopen.citizen";
	public static final String LOCALIZATION_CODE_REOPEN_EMPLOYEE = "pgr.sms.notification.reopen.employee";

	public static final String LOCALIZATION_CODE_ASSIGN_CITIZEN = "pgr.sms.notification.assign.citizen";
	public static final String LOCALIZATION_CODE_ASSIGN_EMPLOYEE = "pgr.sms.notification.assign.employee";

	public static final String LOCALIZATION_CODE_REASSIGN_CITIZEN = "pgr.sms.notification.reassign.citizen";
	public static final String LOCALIZATION_CODE_REASSIGN_EMPLOYEE = "pgr.sms.notification.reassign.employee";
	
	public static final String LOCALIZATION_CODE_REJECT_CITIZEN = "pgr.sms.notification.reject.citizen";
	
	public static final String LOCALIZATION_CODE_RESOLVE_CITIZEN = "pgr.sms.notification.resolve.citizen";
	
	public static final String LOCALIZATION_CODE_CLOSE_EMPLOYEE = "pgr.sms.notification.close.employee";
	
	public static final String LOCALIZATION_CODE_COMMENT = "pgr.sms.notification.comment";
	public static final String LOCALIZATION_CODE_DEFAULT = "pgr.sms.notification.default";
	public static final String LOCALIZATION_CODE_COMMENT_DEFAULT = "pgr.sms.notification.comment.default";
	public static final String LOCALIZATION_COMP_CATEGORY_PREFIX = "pgr.complaint.category.";


	public static final String SERVICE_CODES = "serviceCode";
	public static final String JSONPATH_SERVICEDEFS = "$.MdmsRes.RAINMAKER-PGR.ServiceDefs";
	public static final String JSONPATH_SERVICE_CODES = "$.MdmsRes.RAINMAKER-PGR.ServiceDefs.*.serviceCode";
	public static final String JSONPATH_SLA = "$.MdmsRes.RAINMAKER-PGR.ServiceDefs.*.slaHours";
	public static final String JSONPATH_DEPARTMENTS = "$.MdmsRes.common-masters.Department";
	public static final String JSONPATH_DESIGNATIONS = "$.MdmsRes.common-masters.Designation";

	public static final String SERVICE_NAME = "serviceName";
	public static final String DEFAULT_COMPLAINT_TYPE = "resolution";
	public static final String EMPLOYEE_DEPTCODES_JSONPATH = "$.Employees[0].assignments.*.department";
	public static final String EMPLOYEE_DEPTCODE_JSONPATH = "$.Employees.[0].assignments.[?(@.isCurrentAssignment == true)].department";
	public static final String EMPLOYEE_DESGCODE_JSONPATH = "$.Employees.[0].assignments.[?(@.isCurrentAssignment == true)].designation";
	public static final String EMPLOYEE_NAME_JSONPATH = "$.Employees[0].user.name";
	public static final String EMPLOYEE_PHNO_JSONPATH = "$.Employees[0].user.mobileNumber";
	public static final String EMPLOYEE_TENANTID_JSONPATH = "$.Employees[0].tenantId";
	public static final String EMPLOYEE_BASE_JSONPATH = "$.Employees";
	public static final String DEPARTMENTNAME_EMPLOYEE_JSONPATH = "$.Department[0].name";
	
	public static final String LOCALIZATION_CODES_JSONPATH = "$.messages.*.code";
	public static final String LOCALIZATION_MSGS_JSONPATH = "$.messages.*.message";
	
	public static final String LOCATION__BOUNDARY_NAMES_JSONPATH = "$.TenantBoundary.*.boundary.*.name";
	public static final String LOCATION__BOUNDARY_CODES_JSONPATH = "$.TenantBoundary.*.boundary.*.code";
	public static final String LOCATION__BOUNDARY_HIERARCHYTYPE_ADMIN = "ADMIN";
	public static final String LOCATION__BOUNDARY_BOUNDARYTYPE_LOCALITY = "Locality";

	
	public static final String SEARCHER_RESPONSE_TEXT = "Searcher response : ";
		
	public static final String SMS_NOTIFICATION_STATUS_KEY = "<status>";
	public static final String SMS_NOTIFICATION_COMPLAINT_TYPE_KEY = "<complaint_type>";
	public static final String SMS_NOTIFICATION_DATE_KEY = "<date>";
	public static final String SMS_NOTIFICATION_ID_KEY = "<id>";
	public static final String SMS_NOTIFICATION_EMP_NAME_KEY = "<emp_name>";
	public static final String SMS_NOTIFICATION_USER_NAME_KEY = "<emp_name>";
	public static final String SMS_NOTIFICATION_EMP_DEPT_KEY = "<emp_department>";
	public static final String SMS_NOTIFICATION_EMP_DESIGNATION_KEY = "<emp_designation>";
	public static final String SMS_NOTIFICATION_COMMENT_KEY = "<comment>";
	public static final String SMS_NOTIFICATION_REASON_FOR_REOPEN_KEY = "<reason>";
	public static final String SMS_NOTIFICATION_ADDITIONAL_COMMENT_KEY = "<additional_comments>";
	public static final String SMS_NOTIFICATION_APP_LINK_KEY = "<app_link>";
	public static final String SMS_NOTIFICATION_APP_DOWNLOAD_LINK_KEY = "<download_link>";
	public static final String SMS_NOTIFICATION_AO_DESIGNATION = "<ao_designation>";
	public static final String SMS_NOTIFICATION_ULB_NAME = "<ulb>";
	public static final String SMS_NOTIFICATION_SLA_NAME = "<sla>";
	public static final String SMS_NOTIFICATION_RATING_KEY = "<rating>";
	
	public static final String  USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
	public static final String  USREVENTS_EVENT_NAME = "Public Grievance Redressal";
	public static final String  USREVENTS_EVENT_POSTEDBY = "SYSTEM-PGR";
	
	
	public static final String  SERVICE_REQID_REGEX = "(^[0-9/]*$)";


	


	
	/*  search on roles constant */
	
	
	
	public static final String ROLE_EMPLOYEE = "EMPLOYEE";
	public static final String ROLE_CITIZEN = "CITIZEN";
	public static final String ROLE_GRO = "GRO";
	public static final String ROLE_DGRO = "DGRO";
	public static final String ROLE_CSR = "CSR";
	
	
	public static final String ROLE_NAME_CITIZEN = "Citizen";
	public static final String ROLE_NAME_EMPLOYEE = "Employee";
	public static final String ROLE_NAME_GRO = "Grievance Routing Officer";
	public static final String ROLE_NAME_DGRO = "Department Grievance Routing Officer";
	public static final String ROLE_NAME_CSR = "Customer Support Representative";
	public static final String  ROLE_NAME_ANONYMOUS = "ANONYMOUS";
	
	
	private static Map<String, String> statusNotifKeyMap = prepareStatusNotifKeyMap();

	private static Map<String, String> actionNotifKeyMap = prepareActionNotifKeyMap();
	
	private static Map<String, String> statusRoleLocalizationKeyMap = prepareStatusRoleLocalizationKeyMap();

	private static Map<String, String> actionRoleLocalizationKeyMap = prepareActionRoleLocalizationKeyMap();

	
	private static Map<String, String> prepareStatusNotifKeyMap() {
		
		Map<String, String> map = new HashMap<>();
		map.put(WorkFlowConfigs.STATUS_OPENED, "submitted");
		map.put(WorkFlowConfigs.STATUS_ASSIGNED, "assigned");
		map.put(WorkFlowConfigs.STATUS_REJECTED, "rejected");
		map.put(WorkFlowConfigs.STATUS_RESOLVED, "resolved");
	
		return map;
	}
	
	private static Map<String, String> prepareActionNotifKeyMap() {

		Map<String, String> map = new HashMap<>();
		map.put(WorkFlowConfigs.ACTION_REOPEN, "reopened");
		map.put(WorkFlowConfigs.ACTION_REASSIGN, "reassigned");

		return map;
	}
	
	/**
	 * Mapping between which messages are to be sent to which actor and on what status.
	 * @return
	 */
	private static Map<String, String> prepareStatusRoleLocalizationKeyMap() {

		Map<String, String> map = new HashMap<>();
		map.put(WorkFlowConfigs.STATUS_OPENED + "|" + PGRConstants.ROLE_CITIZEN, LOCALIZATION_CODE_SUBMIT_CITIZEN);
		map.put(WorkFlowConfigs.STATUS_ASSIGNED + "|" + PGRConstants.ROLE_CITIZEN, LOCALIZATION_CODE_ASSIGN_CITIZEN);
		map.put(WorkFlowConfigs.STATUS_ASSIGNED + "|" + PGRConstants.ROLE_EMPLOYEE, LOCALIZATION_CODE_ASSIGN_EMPLOYEE);
		map.put(WorkFlowConfigs.STATUS_REJECTED + "|" + PGRConstants.ROLE_CITIZEN, LOCALIZATION_CODE_REJECT_CITIZEN);
		map.put(WorkFlowConfigs.STATUS_RESOLVED + "|" + PGRConstants.ROLE_CITIZEN, LOCALIZATION_CODE_RESOLVE_CITIZEN);
		map.put(WorkFlowConfigs.STATUS_CLOSED + "|" + PGRConstants.ROLE_EMPLOYEE, LOCALIZATION_CODE_CLOSE_EMPLOYEE);
	
		return map;
	}
	
	/**
     * Mapping between which messages are to be sent to which actor and on what action. 
	 * @return
	 */
	private static Map<String, String> prepareActionRoleLocalizationKeyMap() {

		Map<String, String> map = new HashMap<>();
		map.put(WorkFlowConfigs.ACTION_REOPEN + "|" + PGRConstants.ROLE_EMPLOYEE, LOCALIZATION_CODE_REOPEN_EMPLOYEE);
		map.put(WorkFlowConfigs.ACTION_REOPEN + "|" + PGRConstants.ROLE_CITIZEN, LOCALIZATION_CODE_REOPEN_CITIZEN);
		map.put(WorkFlowConfigs.ACTION_REASSIGN + "|" + PGRConstants.ROLE_CITIZEN, LOCALIZATION_CODE_REASSIGN_CITIZEN);
		map.put(WorkFlowConfigs.ACTION_REASSIGN + "|" + PGRConstants.ROLE_EMPLOYEE, LOCALIZATION_CODE_REASSIGN_EMPLOYEE);

	
		return map;
	}
	
	public static Map<String, String> getStatusNotifKeyMap(){
		return statusNotifKeyMap;
	}
	
	public static Map<String, String> getActionNotifKeyMap(){
		return actionNotifKeyMap;
	}
	
	public static Map<String, String> getStatusRoleLocalizationKeyMap(){
		return statusRoleLocalizationKeyMap;
	}
	
	public static Map<String, String> getActionRoleLocalizationKeyMap(){
		return actionRoleLocalizationKeyMap;
	}
		
}
