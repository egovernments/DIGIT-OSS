package org.egov.swservice.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SWConstants {

	private SWConstants() {

	}

	public static final String JSONPATH_ROOT = "$.MdmsRes.ws-services-masters";

	public static final String TAX_JSONPATH_ROOT = "$.MdmsRes.sw-services-calculation";
	
	public static final String PROPERTY_JSONPATH_ROOT = "$.MdmsRes.PropertyTax";

	public static final String JSONPATH_CODE_CONNECTION_TYPE = "connectionType.code";

	public static final String MDMS_SW_MOD_NAME = "ws-services-masters";

	public static final String MDMS_SW_CONNECTION_TYPE = "connectionType";

	public static final String INVALID_CONNECTION_TYPE = "Invalid Connection Type";


	public static final String ACTION_INITIATE = "INITIATE";

	public static final String ACTION_APPLY = "APPLY";

	public static final String ACTIVATE_CONNECTION = "ACTIVATE_CONNECTION";

	public static final String ACTION_REJECT = "REJECT";

	public static final String ACTION_CANCEL = "CANCEL";

	public static final String ACTION_PAY = "PAY";

	public static final String ACTION_ADHOC = "ADHOC";

	public static final String STATUS_INITIATED = "INITIATED";

	public static final String STATUS_APPLIED = "APPLIED";

	public static final String STATUS_APPROVED = "CONNECTION_ACTIVATED";

	public static final String STATUS_REJECTED = "REJECTED";

	public static final String STATUS_FIELDINSPECTION = "FIELDINSPECTION";

	public static final String STATUS_CANCELLED = "CANCELLED";

	public static final String STATUS_PAID = "PAID";

	public static final String NOTIFICATION_LOCALE = "en_IN";

	public static final String MODULE = "rainmaker-ws";

	public static final String SMS_RECIEVER_MASTER = "SMSReceiver";

	public static final String SERVICE_FIELD_VALUE_SW = "SW";

	// Application Status For Notification
	public static final String INITIATE_INITIATED = "SUBMIT_APPLICATION_PENDING_FOR_DOCUMENT_VERIFICATION";

	public static final String REJECT_REJECTED = "REJECT_REJECTED";

	public static final String SEND_BACK_TO_CITIZEN_PENDING_FOR_CITIZEN_ACTION = "SEND_BACK_TO_CITIZEN_PENDING_FOR_CITIZEN_ACTION";

	public static final String SEND_BACK_FOR_DO_PENDING_FOR_DOCUMENT_VERIFICATION = "SEND_BACK_FOR_DOCUMENT_VERIFICATION_PENDING_FOR_DOCUMENT_VERIFICATION";

	public static final String SEND_BACK_PENDING_FOR_FIELD_INSPECTION = "SEND_BACK_FOR_FIELD_INSPECTION_PENDING_FOR_FIELD_INSPECTION";

	public static final String VERIFY_AND_FORWORD_PENDING_FOR_FIELD_INSPECTION = "VERIFY_AND_FORWARD_PENDING_FOR_FIELD_INSPECTION";

	public static final String VERIFY_AND_FORWARD_PENDING_APPROVAL_FOR_CONNECTION = "VERIFY_AND_FORWARD_PENDING_APPROVAL_FOR_CONNECTION";

	public static final String APPROVE_FOR_CONNECTION_PENDING_FOR_PAYMENT = "APPROVE_FOR_CONNECTION_PENDING_FOR_PAYMENT";

	public static final String PAY_PENDING_FOR_CONNECTION_ACTIVATION = "PAY_PENDING_FOR_CONNECTION_ACTIVATION";

	public static final String ACTIVATE_CONNECTION_CONNECTION_ACTIVATED = "ACTIVATE_CONNECTION_CONNECTION_ACTIVATED";

	public static final String EDIT_PENDING_FOR_DOCUMENT_VERIFICATION = "EDIT_PENDING_FOR_DOCUMENT_VERIFICATION";

	public static final String EDIT_PENDING_FOR_FIELD_INSPECTION = "EDIT_PENDING_FOR_FIELD_INSPECTION";

	public static final String SW_DISCONNECT_EDIT_SMS = "WS_DISCONNECT_EDIT_SMS_MESSAGE";

	public static final String SW_DISCONNECT_EDIT_INAPP = "WS_DISCONNECT_EDIT_APP_MESSAGE";

	public static final String SUBMIT_APPLICATION_STATUS_CODE = "SUBMIT_APPLICATION_PENDING_FOR_APPROVAL";

	public static final String APPROVE_CONNECTION_STATUS_CODE = "APPROVE_CONNECTION_APPROVED";

	public static final String SUBMIT_APPLICATION_PENDING_FOR_DOCUMENT_VERIFICATION = "SUBMIT_APPLICATION_PENDING_FOR_DOCUMENT_VERIFICATION";

	public static final String VERIFY_AND_FORWARD_PENDING_APPROVAL_FOR_DISCONNECTION = "VERIFY_AND_FORWARD_PENDING_APPROVAL_FOR_DISCONNECTION";

	public static final String APPROVE_FOR_DISCONNECTION_PENDING_FOR_PAYMENT = "APPROVE_FOR_DISCONNECTION_PENDING_FOR_PAYMENT";

	public static final String APPROVE_FOR_DISCONNECTION_PENDING_FOR_DISCONNECTION_EXECUTION = "APPROVE_FOR_DISCONNECTION_PENDING_FOR_DISCONNECTION_EXECUTION";
	public static final String PAY_PENDING_FOR_DISCONNECTION_EXECUTION = "PAY_PENDING_FOR_DISCONNECTION_EXECUTION";

	public static final String EXECUTE_DISCONNECTION_DISCONNECTION_EXECUTED = "EXECUTE_DISCONNECTION_DISCONNECTION_EXECUTED";

	public static final String RESUBMIT_APPLICATION_PENDING_FOR_DOCUMENT_VERIFICATION ="RESUBMIT_APPLICATION_PENDING_FOR_DOCUMENT_VERIFICATION";

	public static final String RESUBMIT_APPLICATION_PENDING_APPROVAL_FOR_DISCONNECTION = "RESUBMIT_APPLICATION_PENDING_APPROVAL_FOR_DISCONNECTION";

	public static final String RESUBMIT_APPLICATION_PENDING_FOR_FIELD_INSPECTION = "RESUBMIT_APPLICATION_PENDING_FOR_FIELD_INSPECTION";

	public static final String SEND_BACK_TO_CITIZEN_AP_PENDING_FOR_CITIZEN_ACTION = "SEND_BACK_TO_CITIZEN_AP_PENDING_FOR_CITIZEN_ACTION";

	public static final String SEND_BACK_TO_CITIZEN_FI_PENDING_FOR_CITIZEN_ACTION = "SEND_BACK_TO_CITIZEN_FI_PENDING_FOR_CITIZEN_ACTION";

	public static final String SEND_BACK_FOR_DOCUMENT_VERIFICATION_PENDING_FOR_DOCUMENT_VERIFICATION = "SEND_BACK_FOR_DOCUMENT_VERIFICATION_PENDING_FOR_DOCUMENT_VERIFICATION";

	public static final String SEND_BACK_PENDING_FOR_COUNTER_EMPLOYEE_ACTION = "SEND_BACK_PENDING_FOR_COUNTER_EMPLOYEE_ACTION";


	public static final List<String> NOTIFICATION_ENABLE_FOR_STATUS = Collections
			.unmodifiableList(Arrays.asList(INITIATE_INITIATED, REJECT_REJECTED,
					SEND_BACK_TO_CITIZEN_PENDING_FOR_CITIZEN_ACTION, SEND_BACK_FOR_DO_PENDING_FOR_DOCUMENT_VERIFICATION,
					SEND_BACK_PENDING_FOR_FIELD_INSPECTION, VERIFY_AND_FORWORD_PENDING_FOR_FIELD_INSPECTION,
					VERIFY_AND_FORWARD_PENDING_APPROVAL_FOR_CONNECTION, APPROVE_FOR_CONNECTION_PENDING_FOR_PAYMENT,
					ACTIVATE_CONNECTION_CONNECTION_ACTIVATED,
					EDIT_PENDING_FOR_DOCUMENT_VERIFICATION, EDIT_PENDING_FOR_FIELD_INSPECTION,
					SUBMIT_APPLICATION_STATUS_CODE, APPROVE_CONNECTION_STATUS_CODE,VERIFY_AND_FORWARD_PENDING_APPROVAL_FOR_DISCONNECTION,
					APPROVE_FOR_DISCONNECTION_PENDING_FOR_PAYMENT,APPROVE_FOR_DISCONNECTION_PENDING_FOR_DISCONNECTION_EXECUTION,
					EXECUTE_DISCONNECTION_DISCONNECTION_EXECUTED,RESUBMIT_APPLICATION_PENDING_FOR_DOCUMENT_VERIFICATION,
					RESUBMIT_APPLICATION_PENDING_APPROVAL_FOR_DISCONNECTION,RESUBMIT_APPLICATION_PENDING_FOR_FIELD_INSPECTION,
					SEND_BACK_TO_CITIZEN_AP_PENDING_FOR_CITIZEN_ACTION,SEND_BACK_TO_CITIZEN_FI_PENDING_FOR_CITIZEN_ACTION,
					SEND_BACK_FOR_DOCUMENT_VERIFICATION_PENDING_FOR_DOCUMENT_VERIFICATION,SEND_BACK_PENDING_FOR_COUNTER_EMPLOYEE_ACTION));

	public static final List<String> CHANNEL_VALUES = Collections.unmodifiableList(Arrays.asList("CITIZEN", "CFC_COUNTER", "MIGRATION", "DATA_ENTRY", "SYSTEM"));


	public static final String USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";

	public static final String USREVENTS_EVENT_NAME = "SEWERAGE CONNECTION";

	public static final String USREVENTS_EVENT_POSTEDBY = "SYSTEM-SW";

	public static final String VARIABLE_WFDOCUMENTS = "documents";

	public static final String VARIABLE_PLUMBER = "plumberInfo";

	public static final String VARIABLE_ACTION = "action";

	public static final String VARIABLE_CREATEDBY = "createdBy";

	public static final String VARIABLE_LASTMODIFIEDBY = "lastModifiedBy";

	public static final String VARIABLE_CREATEDTIME = "createdTime";

	public static final String VARIABLE_LASTMODIFIEDTIME = "lastModifiedTime";

	public static final List<String> FIELDS_TO_IGNORE = Collections
			.unmodifiableList(Arrays.asList(VARIABLE_WFDOCUMENTS, VARIABLE_PLUMBER, VARIABLE_ACTION, VARIABLE_CREATEDBY,
					VARIABLE_LASTMODIFIEDBY, VARIABLE_CREATEDTIME, VARIABLE_LASTMODIFIEDTIME));

	public static final String APPROVE_CONNECTION_CONST = "APPROVE_FOR_CONNECTION";

	public static final String SC_ROADTYPE_MASTER = "RoadType";
	
	public static final String PROPERTY_OWNERTYPE = "OwnerType";

	public static final String PROPERTY_MASTER_MODULE = "PropertyTax";

	public static final String SW_TAX_MODULE = "sw-services-calculation";

	public static final String SW_EDIT_SMS = "SW_EDIT_SMS_MESSAGE";

	public static final String SW_EDIT_IN_APP = "SW_EDIT_IN_APP_MESSAGE";

	public static final String DEFAULT_OBJECT_EDIT_SMS_MSG = "Dear {Owner Name}, Your Application {Application number}  for a New {Service} Connection has been edited. For more details, please log in to {mseva URL} or download {mseva app link}.";

	public static final String DEFAULT_OBJECT_EDIT_APP_MSG = "Dear {Owner Name}, Your Application {Application number}  for a New {Service} Connection has been edited. Click here for more details {View History Link}.";

	public static final String SW_MODIFY_SMS = "SW_MODIFY_SMS_MESSAGE";

	public static final String SW_MODIFY_IN_APP = "SW_MODIFY_IN_APP_MESSAGE";

	public static final String DEFAULT_OBJECT_MODIFY_SMS_MSG = "Dear {Owner Name}, Your Application {Application number}  for a New {Service} Connection has been edited. For more details, please log in to {mseva URL} or download {mseva app link}.";

	public static final String DEFAULT_OBJECT_MODIFY_APP_MSG = "Dear {Owner Name}, Your Application {Application number}  for a New {Service} Connection has been edited. Click here for more details {View History Link}.";
	
	public static final String ADHOC_PENALTY = "adhocPenalty";

	public static final String ADHOC_REBATE = "adhocRebate";
	
	public static final String ADHOC_PENALTY_REASON = "adhocPenaltyReason";

	public static final String ADHOC_PENALTY_COMMENT = "adhocPenaltyComment";

	public static final String ADHOC_REBATE_REASON = "adhocRebateReason";

	public static final String ADHOC_REBATE_COMMENT = "adhocRebateComment";
	
	public static final String DETAILS_PROVIDED_BY = "detailsProvidedBy";
	
	public static final String APP_CREATED_DATE = "appCreatedDate";
	
	public static final String ESTIMATION_FILESTORE_ID = "estimationFileStoreId";

	public static final String SANCTION_LETTER_FILESTORE_ID = "sanctionFileStoreId";
	
	public static final String ESTIMATION_DATE_CONST = "estimationLetterDate";

	public static final String LOCALITY = "locality";

	public static final List<String> ADDITIONAL_OBJECT = Collections.unmodifiableList(Arrays.asList(ADHOC_PENALTY,
			ADHOC_REBATE, ADHOC_PENALTY_REASON, ADHOC_PENALTY_COMMENT, ADHOC_REBATE_REASON, ADHOC_REBATE_COMMENT,DETAILS_PROVIDED_BY,APP_CREATED_DATE, ESTIMATION_FILESTORE_ID, SANCTION_LETTER_FILESTORE_ID, ESTIMATION_DATE_CONST));
	
	public static final String ACTIVATE_CONNECTION_CONST = "ACTIVATE_CONNECTION";
	
	public static final String SERVICE_FIELD_VALUE_NOTIFICATION = "Sewerage";

	public static final List<String> FIELDS_TO_CHECK = Collections
			.unmodifiableList(Arrays.asList("proposedWaterClosets", "proposedToilets", "noOfWaterClosets",
					"noOfToilets", "oldConnectionNo", "roadType", "roadCuttingArea", "connectionExecutionDate",
					"connectionCategory", "connectionType", "documentType", "fileStoreId", "licenseNo"));

	public static final String SUBMIT_APPLICATION_CONST = "SUBMIT_APPLICATION";
	
	public static final List<String> IGNORE_CLASS_ADDED = Collections.unmodifiableList(Arrays.asList("PlumberInfo"));
	
	public static final String PENDING_FOR_CONNECTION_ACTIVATION = "PENDING_FOR_CONNECTION_ACTIVATION";
	
	public static final String SELF = "SELF";
	
	public static final String PDF_APPLICATION_KEY = "ws-applicationsewerage";

	public static final String PDF_ESTIMATION_KEY = "ws-estimationnotice";

	public static final String PDF_SANCTION_KEY = "ws-sanctionletter";
	
	public static final long DAYS_CONST= 86400000L;
	
	// Used to differentiate the type of request which is processing
	public static final int CREATE_APPLICATION = 0;

	public static final int UPDATE_APPLICATION = 1;

	public static final int MODIFY_CONNECTION = 2;
	
	public static final int DISCONNECT_CONNECTION =  3;

	public static final String APPROVE_CONNECTION = "APPROVE_CONNECTION";

	public static final String NEW_SEWERAGE_CONNECTION ="NEW_SEWERAGE_CONNECTION";
	public static final String MODIFY_SEWERAGE_CONNECTION = "MODIFY_SEWERAGE_CONNECTION";
	public static final String DISCONNECT_SEWERAGE_CONNECTION = "DISCONNECT_SEWERAGE_CONNECTION";
	
	public static final String SEWERAGE_SERVICE_BUSINESS_ID = "SW";

	public static final String SEWERAGE_SERVICE_ONE_TIME_FEE_BUSINESS_ID = "SW.ONE_TIME_FEE";

	public static final String PAYMENT_NOTIFICATION_APP = "SW_PAYMENT_NOTIFICATION_APP";

	public static final String PAYMENT_NOTIFICATION_SMS = "SW_PAYMENT_NOTIFICATION_SMS";
	public static final String PAYMENT_NOTIFICATION_EMAIL = "SW_PAYMENT_NOTIFICATION_EMAIL";

	public static final String NEW_SEWERAGE_APP_STATUS ="NEW_SEWERAGE_APPLICATION";

	public static final String MODIFIED_FINAL_STATE = "APPROVED";

	public static final String DISCONNECTION_FINAL_STATE = "DISCONNECTION_EXECUTED";

	public static final List<String> FINAL_CONNECTION_STATES = Collections
			.unmodifiableList(Arrays.asList(MODIFIED_FINAL_STATE, STATUS_APPROVED, DISCONNECTION_FINAL_STATE));

	public static final String SEARCH_TYPE_CONNECTION = "CONNECTION";

	public static final long INVALID_CONEECTION_EXECUTION_DATE = 0L;

	public static final String PENDING_APPROVAL_FOR_CONNECTION_CODE ="PENDING_APPROVAL_FOR_CONNECTION";

	//
	public static final String CHANNEL_NAME_SMS = "SMS";

	public static final String CHANNEL_NAME_EVENT = "EVENT";

	public static final String CHANNEL_NAME_EMAIL = "EMAIL";

	public static final String MODULECONSTANT = "module";

	public static final String ACTION = "action";

	public static final String CHANNEL_LIST = "channelList";

	public static final String CHANNEL = "Channel";
	
	public static final String ACTIVE = "ACTIVE";

	public static final String EXECUTE_DISCONNECTION = "EXECUTE_DISCONNECTION";

	public static final String APPROVE_DISCONNECTION_CONST = "APPROVE_FOR_DISCONNECTION";

	public static final String APPLICATION_DISCONNECTION_CODE = "DC";

	public static final String PENDING_FOR_PAYMENT_STATUS_CODE = "PENDING_FOR_PAYMENT";

	public static final String PENDING_FOR_DISCONNECTION_EXECUTION_STATUS_CODE= "PENDING_FOR_DISCONNECTION_EXECUTION";

	public static final String DOCUMENT_ACCESS_AUDIT_MSG = "The documents for sewerage connection application has been accessed";

	//Encryption-Decryption models
	public static final String WNS_ENCRYPTION_MODEL = "WnSConnection";

	public static final String WNS_OWNER_ENCRYPTION_MODEL = "WnSConnectionOwner";

	public static final String WNS_OWNER_PLAIN_DECRYPTION_MODEL = "WnSConnectionOwnerDecrypDisabled";

	public static final String WNS_PLUMBER_PLAIN_DECRYPTION_MODEL = "WnSConnectionPlumberDecrypDisabled";


	public static final String WNS_PLUMBER_ENCRYPTION_MODEL = "WnSConnectionPlumber";

	public static final String URL_PARAMS_SEPARATER = "?";

	public static final String TENANT_ID_FIELD_FOR_SEARCH_URL = "tenantId=";

	public static final String SEPARATER = "&";

	public static final String CONSUMER_CODE_SEARCH_FIELD_NAME = "consumerCode=";

	public static final String BUSINESSSERVICE_FIELD_FOR_SEARCH_URL = "businessService=";

	public static final String SEWERAGE_TAX_SERVICE_CODE = "SW";

	public static final String WORKFLOW_NODUE_COMMENT = "There is no amount to be paid, hence updating the workflow";

	public static final String WORKFLOW_NO_PAYMENT_CODE = "SW_NO_PAYMENT";

	public static final String COUNTER_EMPLOYEE_ROLE_NAME = "SW Counter Employee";

	public static final String COUNTER_EMPLOYEE_ROLE_CODE = "SW_CEMP";

	public static final List<String> EDIT_NOTIFICATION_STATE = Collections.unmodifiableList(Arrays.asList(ACTION_INITIATE, SUBMIT_APPLICATION_CONST, ACTION_PAY, EXECUTE_DISCONNECTION, ACTIVATE_CONNECTION, APPROVE_CONNECTION));

	public static final String CITIZEN_ROLE_CODE = "CITIZEN";

	public static final String APP_MESSAGE = "_APP_MESSAGE";

	public static final String SMS_MESSAGE = "_SMS_MESSAGE";

	public static final String EMAIL_MESSAGE = "_EMAIL_MESSAGE";

	public static final String TENANT_MASTER_MODULE = "tenant";

	public static final String TENANTS_MASTER_ROOT = "tenants";

	public static final String TENANTS_JSONPATH_ROOT = "$.MdmsRes.tenant.tenants";

}
