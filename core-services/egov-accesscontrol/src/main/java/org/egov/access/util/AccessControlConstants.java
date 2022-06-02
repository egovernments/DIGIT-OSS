package org.egov.access.util;

public class AccessControlConstants {

	public static final String INVALID_ACTION_REQUEST_MESSAGE = "Action is invalid";
	public static final String INVALID_ROLE_REQUEST_MESSAGE = "Role is invalid";
	public static final String INVALID_ROLE_ACTION_REQUEST_MESSAGE = "Role-Action is invalid";

	public static final String TENANTID_MANDATORY_CODE = "accesscontrol.0001";
	public static final String TENANTID_MANADATORY_FIELD_NAME = "tenantId";
	public static final String TENANTID_MANADATORY_ERROR_MESSAGE = "Tenant Id is required";

	public static final String ACTION_NAME_MANDATORY_CODE = "accesscontrol.0002";
	public static final String ACTION_NAME_MANADATORY_FIELD_NAME = "name";
	public static final String ACTION_NAME_MANADATORY_ERROR_MESSAGE = "Action Name is required";

	public static final String ACTION_NAME_DUPLICATE_CODE = "accesscontrol.0003";
	public static final String ACTION_NAME_DUPLICATEFIELD_NAME = "name";
	public static final String ACTION_NAME_DUPLICATE_ERROR_MESSAGE = "Action Name Already exist.";

	public static final String ACTION_NAME_INVALID_CODE = "accesscontrol.0004";
	public static final String ACTION_NAME_INVALID_FIELD_NAME = "name";
	public static final String ACTION_NAME_INVALID_ERROR_MESSAGE = "Action Name is required";

	public static final String ACTION_NAME_DOESNOT_EXIT_CODE = "accesscontrol.0005";
	public static final String ACTION_NAME_DOESNOT_EXIT_FIELD_NAME = "name";
	public static final String ACTION_NAME_DOESNOT_EXIT_ERROR_MESSAGE = "Action Name Does Not Exit";

	public static final String ACTION_URL_QUERYPARAMS_UNIQUE_CODE = "accesscontrol.0006";
	public static final String ACTION_URL_QUERYPARAMS_UNIQUE_ERROR_MESSAGE = "url and queryParams";
	public static final String ACTION_URL_QUERYPARAMS_UNIQUE_FIELD_NAME = "Action url And queryParams combination already Exist";

	public static final String ROLE_NAME_MANDATORY_CODE = "accesscontrol.0007";
	public static final String ROLE_NAME_MANADATORY_FIELD_NAME = "name";
	public static final String ROLE_NAME_MANADATORY_ERROR_MESSAGE = "Role Name is required";

	public static final String ROLE_NAME_DUPLICATE_CODE = "accesscontrol.0008";
	public static final String ROLE_NAME_DUPLICATEFIELD_NAME = "name";
	public static final String ROLE_NAME_DUPLICATE_ERROR_MESSAGE = "Role Name Already exist.";

	public static final String ROLE_NAME_DOES_NOT_EXIT_CODE = "accesscontrol.0009";
	public static final String ROLE_NAME_DOES_NOT_EXIT_FIELD_NAME = "name";
	public static final String ROLE_NAME_DOES_NOT_EXIT_ERROR_MESSAGE = "Role Name Does n't exist.";

	public static final String ROLE_CODE_MANDATORY_CODE = "accesscontrol.0010";
	public static final String ROLE_CODE_MANADATORY_FIELD_NAME = "code";
	public static final String ROLE_CODE_MANADATORY_ERROR_MESSAGE = "Role Code is required";

	public static final String ACTIONS_NAME_MANDATORY_CODE = "accesscontrol.0011";
	public static final String ACTIONS_NAME_MANDATORY_FIELD_NAME = "action";
	public static final String ACTIONS_NAME_MANDATORY_ERROR_MESSAGE = "Atleast One Action is Required ";

	public static final String ROLE_LENGHTH_MANDATORY_CODE = "accesscontrol.0012";
	public static final String ROLE_LENGTH_MANADATORY_FIELD_NAME = "role";
	public static final String ROLE_LENGTH_MANADATORY_ERROR_MESSAGE = "Atleast One Role is Required";

	public static final String ROLE_MANDATORY_CODE = "accesscontrol.0013";
	public static final String ROLE_MANADATORY_FIELD_NAME = "role";
	public static final String ROLE_MANADATORY_ERROR_MESSAGE = "Role is Required";

	public static final String ROLE_ACTIONS_UNIQUE_VALIDATION_CODE = "accesscontrol.0014";
	public static final String ROLE_ACTIONS_UNIQUE_VALIDATION_FIELD_NAME = "role-actions";
	public static final String ROLE_ACTIONS_UNIQUE_VALIDATION_ERROR_MESSAGE = "RoleCode And Tenant And ActionId Combination Already Exist.";

}
