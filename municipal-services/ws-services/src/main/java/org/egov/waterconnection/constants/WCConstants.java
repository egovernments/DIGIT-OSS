package org.egov.waterconnection.constants;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class WCConstants {

	private WCConstants() {

	}
	
	public static final String JSONPATH_ROOT = "$.MdmsRes.ws-services-masters";
	
	public static final String TAX_JSONPATH_ROOT = "$.MdmsRes.ws-services-calculation";
	
	public static final String JSONPATH_CODE_CONNECTION_CATEGORY = "connectionCategory.code";
	
	public static final String JSONPATH_CODE_CONNECTION_TYPE = "connectionType.code";
	
	public static final String JSONPATH_CODE_WATER_SOURCE= "waterSource.code";

	public static final String MDMS_WC_MOD_NAME = "ws-services-masters";
	
	public static final String WS_TAX_MODULE = "ws-services-calculation";

	public static final String MDMS_WC_Connection_Category = "connectionCategory";

	public static final String MDMS_WC_Connection_Type = "connectionType";

	public static final String MDMS_WC_Water_Source = "waterSource";

	public static final String INVALID_CONNECTION_CATEGORY = "Invalid Connection Category";

	public static final String INVALID_CONNECTION_TYPE = "Invalid Connection Type";
	
	public static final String METERED_CONNECTION = "Metered";
	
	  // WS actions

    public static final String ACTION_INITIATE = "INITIATE";

    public static final String ACTION_APPLY  = "APPLY";

    public static final String ACTIVATE_CONNECTION  = "ACTIVATE_CONNECTION";

    public static final String ACTION_REJECT  = "REJECT";

    public static final String ACTION_CANCEL  = "CANCEL";

    public static final String ACTION_PAY  = "PAY";



    public static final String STATUS_INITIATED = "INITIATED";

    public static final String STATUS_APPLIED  = "APPLIED";

    public static final String STATUS_APPROVED  = "CONNECTION_ACTIVATED";

    public static final String STATUS_REJECTED  = "REJECTED";

    public static final String STATUS_FIELDINSPECTION  = "FIELDINSPECTION";

    public static final String STATUS_CANCELLED  = "CANCELLED";

    public static final String STATUS_PAID  = "PAID";
    
    public static final String NOTIFICATION_LOCALE = "en_IN";

	public static final String MODULE = "rainmaker-ws";

	public static final String SMS_RECIEVER_MASTER = "SMSReceiver";
	
	public static final String SERVICE_FIELD_VALUE_WS = "WS";
	
	public static final String SERVICE_FIELD_VALUE_NOTIFICATION = "Water";
	
	
	//Application Status For Notification
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
	
	public static final String APPROVE_CONNECTION_CONST = "APPROVE_FOR_CONNECTION";
	
	public static final String ACTIVATE_CONNECTION_CONST = "ACTIVATE_CONNECTION";
	
	
	public static final List<String> NOTIFICATION_ENABLE_FOR_STATUS = Collections
			.unmodifiableList(Arrays.asList(INITIATE_INITIATED, REJECT_REJECTED,
					SEND_BACK_TO_CITIZEN_PENDING_FOR_CITIZEN_ACTION, SEND_BACK_FOR_DO_PENDING_FOR_DOCUMENT_VERIFICATION,
					SEND_BACK_PENDING_FOR_FIELD_INSPECTION, VERIFY_AND_FORWORD_PENDING_FOR_FIELD_INSPECTION,
					VERIFY_AND_FORWARD_PENDING_APPROVAL_FOR_CONNECTION, APPROVE_FOR_CONNECTION_PENDING_FOR_PAYMENT,
					PAY_PENDING_FOR_CONNECTION_ACTIVATION, ACTIVATE_CONNECTION_CONNECTION_ACTIVATED,
					EDIT_PENDING_FOR_DOCUMENT_VERIFICATION, EDIT_PENDING_FOR_FIELD_INSPECTION));
	
	public static final String  USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
	
	public static final String  USREVENTS_EVENT_NAME = "WATER CONNECTION";
	
	public static final String  USREVENTS_EVENT_POSTEDBY = "SYSTEM-WS";
	
	public static final String VARIABLE_WFDOCUMENTS = "documents";

    public static final String VARIABLE_PLUMBER = "plumberInfo";
    
    public static final String WC_ROADTYPE_MASTER = "RoadType";
	
	public static final List<String> FIELDS_TO_CHECK = Collections
			.unmodifiableList(Arrays.asList("rainWaterHarvesting", "waterSource", "meterId", "meterInstallationDate",
					"proposedPipeSize", "proposedTaps", "pipeSize", "noOfTaps", "oldConnectionNo", "roadType",
					"roadCuttingArea", "connectionExecutionDate", "connectionCategory", "connectionType",
					"documentType", "fileStoreId", "licenseNo"));

	public static final String WS_EDIT_SMS = "WS_EDIT_SMS_MESSAGE";
	
	public static final String WS_EDIT_IN_APP = "WS_EDIT_IN_APP_MESSAGE";
	
    public static final String DEFAULT_OBJECT_MODIFIED_SMS_MSG = "Dear <Owner Name>, Your Application <Application number>  for a New <Service> Connection has been edited. For more details, please log in to <mseva URL> or download <mseva app link>.";

    public static final String DEFAULT_OBJECT_MODIFIED_APP_MSG = "Dear <Owner Name>, Your Application <Application number>  for a New <Service> Connection has been edited. Click here for more details <View History Link>.";
   
    public static final String IDGEN_ERROR_CONST = "IDGEN ERROR";
    
    public static final String ADHOC_PENALTY = "adhocPenalty";
    
    public static final String ADHOC_REBATE = "adhocRebate";

	public static final String ADHOC_PENALTY_REASON = "adhocPenaltyReason";

	public static final String ADHOC_PENALTY_COMMENT = "adhocPenaltyComment";

	public static final String ADHOC_REBATE_REASON = "adhocRebateReason";

	public static final String ADHOC_REBATE_COMMENT = "adhocRebateComment";
	
	public static final String INITIAL_METER_READING_CONST = "initialMeterReading";
	
	public static final String SUBMIT_APPLICATION_CONST = "SUBMIT_APPLICATION";
	
	public static final String DETAILS_PROVIDED_BY = "detailsProvidedBy";
	
	public static final String APP_CREATED_DATE = "appCreatedDate";
	
	public static final String ESTIMATION_FILESTORE_ID = "estimationFileStoreId";
	
	public static final String SANCTION_LETTER_FILESTORE_ID = "sanctionFileStoreId";
	
	public static final String ESTIMATION_DATE_CONST = "estimationLetterDate";
	
	public static final List<String> ADDITIONAL_OBJ_CONSTANT = Collections
			.unmodifiableList(Arrays.asList(ADHOC_PENALTY, ADHOC_REBATE, ADHOC_PENALTY_REASON, ADHOC_PENALTY_COMMENT,
					ADHOC_REBATE_REASON, ADHOC_REBATE_COMMENT, INITIAL_METER_READING_CONST, DETAILS_PROVIDED_BY,
					APP_CREATED_DATE, ESTIMATION_FILESTORE_ID, SANCTION_LETTER_FILESTORE_ID, ESTIMATION_DATE_CONST));

	public static final List<String> EDIT_NOTIFICATION_STATE = Collections.unmodifiableList(Arrays.asList(ACTION_INITIATE, SUBMIT_APPLICATION_CONST, ACTION_PAY));
	
	public static final List<String> IGNORE_CLASS_ADDED = Collections.unmodifiableList(Arrays.asList("PlumberInfo"));
	
	public static final String SELF = "SELF";
	
	public static final String PDF_APPLICATION_KEY = "ws-applicationwater";
	
	public static final String PDF_ESTIMATION_KEY = "ws-estimationnotice";
	
	public static final String PDF_SANCTION_KEY = "ws-sanctionletter";
	
	public static final String PENDING_FOR_CONNECTION_ACTIVATION = "PENDING_FOR_CONNECTION_ACTIVATION";
	
	public static final long DAYS_CONST= 86400000l;
	
	public static final String BILLING_PERIOD = "billingPeriod";
	
	public static final String JSONPATH_ROOT_FOR_BILLING = "$.MdmsRes.ws-services-masters.billingPeriod";
	
	public static final String  BILLING_PERIOD_MASTER = "Billing_Period_Master";
	
	public static final String QUARTERLY_BILLING_CONST = "quarterly";

	public static final String MONTHLY_BILLING_CONST = "monthly";

	public static final String BILLING_CYCLE_STRING = "billingCycle";
	
}