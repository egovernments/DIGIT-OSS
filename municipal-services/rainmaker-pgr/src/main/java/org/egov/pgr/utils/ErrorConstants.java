package org.egov.pgr.utils;

public class ErrorConstants {

	private ErrorConstants() {}
	
	// all the keys should standard and complaint for localization
	
	public static final String NO_DATA_MSG = "No Data";
	public static final String NO_DATA_KEY = "External data not found";
	
	public static final String UNAUTHORIZED_EMPLOYEE_TENANT_MSG = "The Given Employee is Unauthorized for this tenant";
	public static final String UNAUTHORIZED_EMPLOYEE_TENANT_KEY = "Unauthorized Employee";
	
	public static final String INVALID_DEPARTMENT_TENANT_MSG = "The Given Department is Invalid for this tenant";
	public static final String INVALID_DEPARTMENT_TENANT_KEY = "Invalid Department";
	
	public static final String INVALID_TENANT_ID_MDMS_SERVICE_CODE_KEY = "EG_PGR_MDMS_SERVICE_CODES";
	public static final String INVALID_TENANT_ID_MDMS_SERVICE_CODE_MSG = "No serviceDefs data found for this tenant";
	
	public static final String UPDATE_ERROR_KEY = "EG_PGR_INVALID_ACTION_UPDATE"; 
	public static final String UPDATE_FEEDBACK_ERROR_MSG = "Feedback and Rating cannot be updated for current action -"; 

	public static final String UPDATE_FEEDBACK_ERROR_MSG_NO_ACTION = "Feedback and Rating can be updated only for action -close"; 
	public static final String UPDATE_FEEDBACK_ERROR_KEY = "EG_PGR_UPDATE_RATING_FEEDBACK_NOT_APPLICABLE";
	
	public static final String UNEQUAL_REQUEST_SIZE_KEY = "EG_PGR_REQUEST_UNEQUAL_SIZES";
	public static final String UNEQUAL_REQUEST_SIZE_MSG = "Services and ActionInfo must be of same size";
	
	
	public static final String CREATE_ADDRESS_COMBO_ERROR_KEY = "EG_PGR_CREATE_ADDRESS_ERROR";
	public static final String CREATE_ADDRESS_COMBO_ERROR_MSG = "Any one of the combinations of (address or addressId or lat/long) must be provided in the Grievance";
	
	public static final String ASSIGNEE_MISSING_FOR_ACTION_ASSIGN_REASSIGN_KEY = "EG_PGR_UPDATE_ASSIGN_REASSIGN";
	public static final String ASSIGNEE_MISSING_FOR_ACTION_ASSIGN_REASSIGN_MSG = "The assignees are missing or are invalid for the services with ids : ";
	
	public static final String UNAUTHORIZED_USER_MSG = "This User is not authorized to access this information";
	public static final String UNAUTHORIZED_USER_KEY = "EG_PGR_INVALID_USER";
	
	public static final String MISSING_USERTYPE_CODE = "EG_PGR_REQUESTINFO_USERTYPE_MISSING";
	public static final String MISSING_USERTYPE_MSG = "Unauthenticated user, user type is missing in the request.";
	
	public static final String MISSING_ROLE_USERID_CODE = "EG_PGR_USER_DATA_MISSING";
	public static final String MISSING_ROLE_USERID_MSG = "Unauthenticated user. The combination Id, Roles and Tenant is invalid .";
	
	public static final String MISSING_USERINFO_CODE = "EG_PGR_USERINFO_MISSING";
	public static final String MISSING_USERINFO_MSG = "Unauthenticated user, userInfo missing in the request.";
	
	public static final String INVALID_ROLE_CODE = "EG_PGR_INVALID_ROLE";
	public static final String INVALID_ROLE_MSG = "Inavlid role: ";
	
	public static final String INVALID_START_END_DATE_CODE = "EG_PGR_INVALID_START_END_DATE";
	public static final String INVALID_START_END_DATE_MSG = "startDate or endDate cannot be greater than currentDate";
	
	public static final String INVALID_START_DATE_CODE = "EG_PGR_INVALID_START_DATE";
	public static final String INVALID_START_DATE_MSG = "startDate cannot be greater than endDate";
	
	public static final String INVALID_PARTIAL_SERVICEREQUESTID_CODE = "EG_PGR_INVALID_PARTIAL_SERVICEREQUESTID";
	public static final String INVALID_PARTIAL_SERVICEREQUESTID_MSG = "Search on partial serviceRequestId is allowed on atleast last 6 digits of the id. Entered value is less than 6 characters in length.";
	
	public static final String INVALID_SERVICEREQUESTID_CODE = "EG_PGR_INVALID_SERVICEREQUESTID";
	public static final String INVALID_SERVICEREQUESTID_MSG = "Request object does not exist for the given ids: ";
	
	public static final String INVALID_SERVICECODE_CODE = "EG_PGR_INVALID_SERVICECODE";
	public static final String INVALID_SERVICECODE_MSG = "Following Service codes are invalid: ";
	
	public static final String INVALID_ACTION_ON_STATUS_CODE = "EG_PGR_INVALID_ACTION_ON_STATUS";
	public static final String INVALID_ACTION_ON_STATUS_MSG = "Action being performed: $action, is invalid on the current status: $status";
	
	public static final String INVALID_ACTION_FOR_ROLE_CODE = "EG_PGR_INVALID_ACTION_FOR_ROLE";
	public static final String INVALID_ACTION_FOR_ROLE_MSG = "Action being performed: $action, is not allowed for a user with role: $role";
	
	public static final String INVALID_ACTION_FOR_DGRO_CODE = "EG_PGR_INVALID_ACTION_FOR_DGRO";
	public static final String INVALID_ACTION_FOR_DGRO_MSG = "The DGRO trying to update this complaint belongs to other department, hence access restricted.";
	
	public static final String INVALID_ACTION_FOR_GRO_CODE = "EG_PGR_INVALID_ACTION_FOR_GRO";
	public static final String INVALID_ACTION_FOR_GRO_MSG = "The GRO/DGRO trying to update this complaint belongs to different tenant(city), hence access restricted.";
	
	public static final String INVALID_REQUESTS_ON_TENANT_CODE = "EG_PGR_INVALID_REQUESTS_ON_TENANT";
	public static final String INVALID_REQUESTS_ON_TENANT_MSG = "All the complaints being filed/updated must belong to the same tenantId.";
	
	public static final String INACTIVE_COMPLAINTS_FOR_UPDATE_CODE = "EG_PGR_INACTIVE_COMPLAINTS_FOR_UPDATE";
	public static final String INACTIVE_COMPLAINTS_FOR_UPDATE_MSG = "All the complaints being updated should be active complaints";
	
	public static final String INVALID_ADDRESS_DETAIL_CODE = "EG_PGR_INVALID_ADDRESS_DETAIL_CODE";
	public static final String INVALID_ADDRESS_DETAIL_MSG = "service.addressDetail cannot be null";
	
	public static final String INVALID_MOHALLA_CITY_CODE = "EG_PGR_INVALID_MOHALLA_CITY_CODE";
	public static final String INVALID_MOHALLA_CITY_MSG = "service.addressDetail.mohalla & service.addressDetail.city  cannot be null";
	
	public static final String INVALID_ACTION_REOPEN_EXPIRED_CODE = "EG_PGR_INVALID_ACTION_REOPEN_EXPIRED_CODE";
	public static final String INVALID_ACTION_REOPEN_EXPIRED_MSG = "Complaint has to be reopened only within $days days of resolution. This complaint is past that range.";
}
