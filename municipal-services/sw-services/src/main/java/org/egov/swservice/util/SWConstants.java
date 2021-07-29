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
	
	public static final String SUBMIT_APPLICATION_STATUS_CODE = "SUBMIT_APPLICATION_PENDING_FOR_APPROVAL";

	public static final String APPROVE_CONNECTION_STATUS_CODE = "APPROVE_CONNECTION_APPROVED";

	public static final List<String> NOTIFICATION_ENABLE_FOR_STATUS = Collections
			.unmodifiableList(Arrays.asList(INITIATE_INITIATED, REJECT_REJECTED,
					SEND_BACK_TO_CITIZEN_PENDING_FOR_CITIZEN_ACTION, SEND_BACK_FOR_DO_PENDING_FOR_DOCUMENT_VERIFICATION,
					SEND_BACK_PENDING_FOR_FIELD_INSPECTION, VERIFY_AND_FORWORD_PENDING_FOR_FIELD_INSPECTION,
					VERIFY_AND_FORWARD_PENDING_APPROVAL_FOR_CONNECTION, APPROVE_FOR_CONNECTION_PENDING_FOR_PAYMENT,
					PAY_PENDING_FOR_CONNECTION_ACTIVATION, ACTIVATE_CONNECTION_CONNECTION_ACTIVATED,
					EDIT_PENDING_FOR_DOCUMENT_VERIFICATION, EDIT_PENDING_FOR_FIELD_INSPECTION,
					SUBMIT_APPLICATION_STATUS_CODE, APPROVE_CONNECTION_STATUS_CODE));

	public static final String USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";

	public static final String USREVENTS_EVENT_NAME = "SEWERAGE CONNECTION";

	public static final String USREVENTS_EVENT_POSTEDBY = "SYSTEM-SW";

	public static final String VARIABLE_WFDOCUMENTS = "documents";

	public static final String VARIABLE_PLUMBER = "plumberInfo";

	public static final List<String> FIELDS_TO_IGNORE = Collections
			.unmodifiableList(Arrays.asList(VARIABLE_WFDOCUMENTS, VARIABLE_PLUMBER));

	public static final String APPROVE_CONNECTION_CONST = "APPROVE_FOR_CONNECTION";

	public static final String SC_ROADTYPE_MASTER = "RoadType";
	
	public static final String PROPERTY_OWNERTYPE = "OwnerType";

	public static final String PROPERTY_MASTER_MODULE = "PropertyTax";

	public static final String SW_TAX_MODULE = "sw-services-calculation";

	public static final String SW_EDIT_SMS = "SW_EDIT_SMS_MESSAGE";

	public static final String SW_EDIT_IN_APP = "SW_EDIT_IN_APP_MESSAGE";

	public static final String DEFAULT_OBJECT_EDIT_SMS_MSG = "Dear <Owner Name>, Your Application <Application number>  for a New <Service> Connection has been edited. For more details, please log in to <mseva URL> or download <mseva app link>.";

	public static final String DEFAULT_OBJECT_EDIT_APP_MSG = "Dear <Owner Name>, Your Application <Application number>  for a New <Service> Connection has been edited. Click here for more details <View History Link>.";

	public static final String SW_MODIFY_SMS = "SW_MODIFY_SMS_MESSAGE";

	public static final String SW_MODIFY_IN_APP = "SW_MODIFY_IN_APP_MESSAGE";

	public static final String DEFAULT_OBJECT_MODIFY_SMS_MSG = "Dear <Owner Name>, Your Application <Application number>  for a New <Service> Connection has been edited. For more details, please log in to <mseva URL> or download <mseva app link>.";

	public static final String DEFAULT_OBJECT_MODIFY_APP_MSG = "Dear <Owner Name>, Your Application <Application number>  for a New <Service> Connection has been edited. Click here for more details <View History Link>.";
	
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
	
	public static final List<String> EDIT_NOTIFICATION_STATE = Collections.unmodifiableList(Arrays.asList(ACTION_INITIATE, SUBMIT_APPLICATION_CONST, ACTION_PAY));

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

	public static final String APPROVE_CONNECTION = "APPROVE_CONNECTION";

	public static final String NEW_SEWERAGE_CONNECTION ="NEW_SEWERAGE_CONNECTION";
	public static final String MODIFY_SEWERAGE_CONNECTION = "MODIFY_SEWERAGE_CONNECTION";
	
	public static final String SEWERAGE_SERVICE_BUSINESS_ID = "SW";

	public static final String PAYMENT_NOTIFICATION_APP = "SW_PAYMENT_NOTIFICATION_APP";

	public static final String PAYMENT_NOTIFICATION_SMS = "SW_PAYMENT_NOTIFICATION_SMS";

	public static final String NEW_SEWERAGE_APP_STATUS ="NEW_SEWERAGE_APPLICATION";

	public static final String MODIFIED_FINAL_STATE = "APPROVED";

	public static final List<String> FINAL_CONNECTION_STATES = Collections
			.unmodifiableList(Arrays.asList(MODIFIED_FINAL_STATE, STATUS_APPROVED));

	public static final String SEARCH_TYPE_CONNECTION = "CONNECTION";

}
