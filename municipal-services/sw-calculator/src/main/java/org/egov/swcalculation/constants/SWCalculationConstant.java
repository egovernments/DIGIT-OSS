package org.egov.swcalculation.constants;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.egov.swcalculation.web.models.DemandStatus;

public class SWCalculationConstant {

	public static final String TAXPERIOD_MASTER_KEY = "TAXPERIOD";

	public static final String TAXHEADMASTER_MASTER_KEY = "SW_TAX";

	public static final String FINANCIALYEAR_MASTER_KEY = "2019-20";

	public static final String FINANCIAL_YEAR_STARTING_DATE = "startingDate";

	public static final String FINANCIAL_YEAR_ENDING_DATE = "endingDate";

	public static final String URL_PARAMS_SEPARATER = "?";

	public static final String MDMS_ROUNDOFF_TAXHEAD = "SW_Round_Off";

	public static final String TENANT_ID_FIELD_FOR_SEARCH_URL = "tenantId=";

	public static final String SEPARATER = "&";

	public static final String SERVICE_FIELD_FOR_SEARCH_URL = "service=";

	public static final String SERVICE_FIELD_VALUE_SW = "SW";

	public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear[?(@.code==\"{}\")]";

	public static final String EG_SW_FINANCIAL_MASTER_NOT_FOUND = "EG_SW_FINANCIAL_MASTER_NOT_FOUND";

	public static final String EG_SW_FINANCIAL_MASTER_NOT_FOUND_MSG = "No Financial Year data is available for the given year value of : ";

	public static final String FINANCIAL_YEAR_MASTER = "FinancialYear";

	public static final String FINANCIAL_YEAR_RANGE_FEILD_NAME = "finYearRange";

	public static final String FINANCIAL_MODULE = "egf-master";

	public static final String SW_TAX_MODULE = "sw-services-calculation";

	public static final String SW_REBATE_MASTER = "Rebate";

	public static final String SW_SEWERAGE_CESS_MASTER = "SewerageCess";

	public static final String SW_PENANLTY_MASTER = "Penalty";

	public static final String SW_INTEREST_MASTER = "Interest";

	public static final String SW_BILLING_SLAB_MASTER = "SCBillingSlab";

	public static final String EMPTY_DEMAND_ERROR_CODE = "EMPTY_DEMANDS";

	public static final String EMPTY_DEMAND_ERROR_MESSAGE = "No demands found for the given bill generate criteria";

	public static final String DEMAND_CANCELLED_STATUS = DemandStatus.CANCELLED.toString();

	public static final String CONSUMER_CODE_SEARCH_FIELD_NAME = "consumerCode=";

	public static final String SW_CONSUMER_CODE_SEPARATOR = ":";

	public static final String EG_SW_INVALID_DEMAND_ERROR = "EG_SW_INVALID_DEMAND_ERROR";
	public static final String EG_SW_INVALID_DEMAND_ERROR_MSG = " Bill cannot be generated for previous assessments in a year, please use the latest assesmment to pay";

	/**
	 * Time Taxes Config
	 */
	public static final String SW_TIME_REBATE = "SW_TIME_REBATE";

	public static final String SW_TIME_INTEREST = "SW_TIME_INTEREST";

	public static final String SW_TIME_PENALTY = "SW_TIME_PENALTY";

	public static final String SW_WATER_CESS = "SW_SEWERAGE_CESS";

	public static final String SW_CHARGE = "SW_CHARGE";

	/**
	 * data fields
	 */
	public static final String FROMFY_FIELD_NAME = "fromFY";

	public static final String ENDING_DATE_APPLICABLES = "endingDay";

	public static final String STARTING_DATE_APPLICABLES = "startingDay";

	public static final String MAX_AMOUNT_FIELD_NAME = "maxAmount";

	public static final String MIN_AMOUNT_FIELD_NAME = "minAmount";

	public static final String FLAT_AMOUNT_FIELD_NAME = "flatAmount";

	public static final String RATE_FIELD_NAME = "rate";

	/*
	 * bigdecimal values
	 */

	public static final BigDecimal HUNDRED = BigDecimal.valueOf(100);


	public static final String SW_Round_Off = "SW_Round_Off";
	
	public static final String SW_ONE_TIME_FEE_ROUND_OFF = "SW_FEE_ROUND_OFF";

	public static final String flatRateCalculationAttribute = "Flat";

	public static final String meteredConnectionType = "Metered";

	public static final String nonMeterdConnection = "Non Metered";

	public static final String noOfWaterClosets = "No. of water closets";

	public static final String noOfToilets = "No. of toilets";

	public static final List<String> TAX_APPLICABLE = Collections.unmodifiableList(Arrays.asList(SW_CHARGE));

	public static final String DAYA_APPLICABLE_NAME = "applicableAfterDays";

	public static final String Demand_End_Date_String = "demandEndDateMillis";

	public static final String Demand_Expiry_Date_String = "demandExpiryDate";

	public static final String JSONPATH_ROOT_FOR_BilingPeriod = "$.MdmsRes.sw-services-calculation.billingPeriod";

	public static final String BILLING_PERIOD = "billingPeriod";

	public static final String ConnectionType = "connectionType";

	public static final String SW_MODULE = "sw-services-calculation";

	public static final String Demand_Generate_Date_String = "demandGenerationDateMillis";

	public static final String Quaterly_Billing_Period = "quaterly";

	public static final String Monthly_Billing_Period = "monthly";

	public static final String BILLING_CYCLE_CONST = "billingCycle";

	public static final String MODULE = "rainmaker-ws";

	public static final String NOTIFICATION_LOCALE = "en_IN";

	public static final String SMS_RECEIVER_MASTER = "SMSReceiver";

	public static final String DEMAND_SUCCESS_MESSAGE = "SEWERAGE_CONNECTION_DEMAND_SUCCESSFUL_SMS_MESSAGE";

	public static final String DEMAND_FAILURE_MESSAGE = "SEWERAGE_CONNECTION_DEMAND_FAILURE_SMS_MESSAGE";

	public static final String SMS_RECIEVER_MASTER = "SMSReceiver";

	public static final String DEMAND_SUCCESS_MESSAGE_SMS = "SEWERAGE_CONNECTION_DEMAND_SUCCESSFUL_SMS_MESSAGE";

	public static final String DEMAND_FAILURE_MESSAGE_SMS = "SEWERAGE_CONNECTION_DEMAND_FAILURE_SMS_MESSAGE";

	public static final String DEMAND_SUCCESS_MESSAGE_EMAIL = "SEWERAGE_CONNECTION_DEMAND_SUCCESSFUL_EMAIL_MESSAGE";

	public static final String DEMAND_FAILURE_MESSAGE_EMAIL = "SEWERAGE_CONNECTION_DEMAND_FAILURE_EMAIL_MESSAGE";

	public static final String BILL_SUCCESS_MESSAGE_SMS = "SEWERAGE_CONNECTION_BILL_SUCCESSFUL_SMS_MESSAGE";

	public static final String BILL_FAILURE_MESSAGE_SMS = "SEWERAGE_CONNECTION_BILL_FAILURE_SMS_MESSAGE";

	public static final String BILL_SUCCESS_MESSAGE_EMAIL = "SEWERAGE_CONNECTION_BILL_SUCCESSFUL_EMAIL_MESSAGE";

	public static final String BILL_FAILURE_MESSAGE_EMAIL = "SEWERAGE_CONNECTION_BILL_FAILURE_EMAIL_MESSAGE";

	public static final String BILL_SUCCESS_MESSAGE = "SEWERAGE_CONNECTION_BILL_FAILURE_MESSAGE";;

	public static final String NOTIFICATION_INITIATED = "tl.en.counter.initiate";

	public static final String NOTIFICATION_APPLIED = "tl.en.counter.submit";

	public static final String NOTIFICATION_FIELD_INSPECTION = "tl.en.field.inspection";

	public static final String NOTIFICATION_PAYMENT_OWNER = "tl.en.counter.payment.successful.owner";

	public static final String NOTIFICATION_PAYMENT_PAYER = "tl.en.counter.payment.successful.payer";

	public static final String NOTIFICATION_PAID = "tl.en.counter.pending.approval";

	public static final String NOTIFICATION_APPROVED = "tl.en.counter.approved";

	public static final String NOTIFICATION_REJECTED = "tl.en.counter.rejected";

	public static final String NOTIFICATION_CANCELLED = "tl.en.counter.cancelled";

	public static final String NOTIFICATION_FIELD_CHANGED = "tl.en.edit.field.change";

	// ACTION_STATUS combinations for notification

	public static final String ACTION_STATUS_INITIATED = "INITIATE_INITIATED";

	public static final String ACTION_STATUS_APPLIED = "APPLY_APPLIED";

	public static final String ACTION_STATUS_APPROVED = "APPROVE_PENDINGPAYMENT";

	public static final String ACTION_STATUS_REJECTED = "REJECT_REJECTED";

	public static final String ACTION_STATUS_FIELDINSPECTION = "FORWARD_FIELDINSPECTION";

	public static final String ACTION_CANCEL_CANCELLED = "CANCEL_CANCELLED";

	public static final String ACTION_STATUS_PAID = "PAID";

	public static final String USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";

	public static final String USREVENTS_EVENT_NAME = "SEWERAGE BILL GENERATION";

	public static final String USREVENTS_EVENT_POSTEDBY = "SYSTEM-SW";
	
	public static final String SEWERAGE_CONNECTION_BILL_GENERATION_SMS_MESSAGE = "SEWERAGE_CONNECTION_BILL_GENERATION_SMS_MESSAGE";

	public static final String SEWERAGE_CONNECTION_BILL_GENERATION_APP_MESSAGE = "SEWERAGE_CONNECTION_BILL_GENERATION_APP_MESSAGE";
	
	public static final String BUSINESSSERVICE_FIELD_FOR_SEARCH_URL = "businessService=";
	
	public static final String SEWERAGE_TAX_SERVICE_CODE = "SW";
	
	public static final String  Billing_Period_Master = "Billing_Period_Master";
	
	public static final String Assesment_Year = "assessmentYear";
	
	public static final String SC_PLOTSLAB_MASTER = "PlotSizeSlab";

	public static final String SC_PROPERTYUSAGETYPE_MASTER = "PropertyUsageType";

	public static final String SC_FEESLAB_MASTER = "FeeSlab";

	public static final String SC_ROADTYPE_MASTER = "RoadType";

	/**
	 * Fee Estimation Configuration
	 */
	public static final String SW_FORM_FEE = "SW_FORM_FEE";

	public static final String SW_SCRUTINY_FEE = "SW_SCRUTINY_FEE";

	public static final String SW_ONE_TIME_FEE = "SW_ONE_TIME_FEE";

	public static final String SW_ROAD_CUTTING_CHARGE = "SW_ROAD_CUTTING_CHARGE";

	public static final String SW_METER_CHARGE = "SW_METER_CHARGE";

	public static final String SW_SECURITY_CHARGE = "SW_SECURITY_CHARGE";

	public static final String SW_OTHER_CHARGE = "SW_OTHER_CHARGE";

	public static final String SW_TAX_AND_CESS = "SW_TAX_AND_CESS";

	public static final String FORM_FEE_CONST = "formFee";

	public static final String SCRUTINY_FEE_CONST = "scrutinyFee";

	public static final String METER_COST_CONST = "meterCost";

	public static final String OTHER_CHARGE_CONST = "other";

	public static final String TAX_PERCENTAGE_CONST = "taxpercentage";
	
	public static final String ROAD_NAME_CONST = "name";

	public static final String UNIT_COST_CONST = "unitCost";
	
	public static final String ONE_TIME_FEE_SERVICE_FIELD = "SW.ONE_TIME_FEE";
	
	public static final Long expiryDateForOneTimeFee = 347126472000l;
	
	public static final String CALCULATION_ATTRIBUTE_CONST = "CalculationAttribute";
	
	public static final String ATTRIBUTE = "attribute";
	
	public static final String SW_ADHOC_PENALTY = "SW_ADHOC_PENALTY";

	public static final String SW_ADHOC_REBATE = "SW_ADHOC_REBATE";

	public static final String ADHOC_PENALTY = "adhocPenalty";

	public static final String ADHOC_REBATE = "adhocRebate";
	
	public static final Long APPLICATION_FEE_DEMAND_END_DATE = 157784760000l;
	
	public static final Long APPLICATION_FEE_DEMAND_EXP_DATE = 220898664000l;
	
	public static final String SW_TIME_ADHOC_PENALTY = "SW_TIME_ADHOC_PENALTY";

	public static final String SW_TIME_ADHOC_REBATE = "SW_TIME_ADHOC_REBATE";

	public static final String PROPERTY_JSONPATH_ROOT = "$.MdmsRes.PropertyTax";

	public static final String PROPERTY_MASTER_MODULE = "PropertyTax";

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
	
	public static final String PAYMENT_COMPLETED_SEARCH_FIELD_NAME = "isPaymentCompleted=";

	public static final String MDMS_CACHE_KEY = "WSMasterData";

	//Notification
	public static final String CHANNEL_NAME_SMS = "SMS";

	public static final String CHANNEL_NAME_EVENT = "EVENT";

	public static final String CHANNEL_NAME_EMAIL = "EMAIL";

	public static final String MODULECONSTANT = "module";

	public static final String ACTION = "action";

	public static final String CHANNEL_LIST = "channelList";

	public static final String CHANNEL = "Channel";

	// actions
	public static final String ACTION_FOR_DEMAND = "DEMAND";

	public static final String ACTION_FOR_BILL = "BILL";

	public static String Billing_Cycle_String = "billingCycle";
	
	public static final String MODIFIED_FINAL_STATE = "APPROVED";

	public static final String STATUS_APPROVED = "CONNECTION_ACTIVATED";

	public static final String PENDING_APPROVAL_FOR_DISCONNECTION = "PENDING_APPROVAL_FOR_DISCONNECTION";

	public static final String CONNECTION_INACTIVATED = "Inactive";

	public static final List<String> FINAL_CONNECTION_STATES = Collections
			.unmodifiableList(Arrays.asList(MODIFIED_FINAL_STATE, STATUS_APPROVED));

	public static final String BILL_KEY= "Bill";

	public static final String CONSUMER_CODE_KEY= "consumerCode";

	public static final String BILL_DETAILS_KEY= "billDetails";

	public static final String TO_PERIOD_KEY= "toPeriod";

	public static final String FROM_PERIOD_KEY= "fromPeriod";

	public static final String AMOUNT_KEY= "amount";

	public static final String NEW_SEWERAGE_CONNECTION = "NEW_SEWERAGE_CONNECTION";

	public static final String NEWSEWERAGE_BUSINESS_SERVICE = "NewSW1";

	public static final String MODIFY_BUSINESS_SERVICE = "ModifySWConnection";

	public static final String DISCONNECTION_BUSINESS_SERVICE = "DisconnectSWConnection";

	public static final String PENDING_FOR_DISCONNECTION_EXECUTION = "PENDING_FOR_DISCONNECTION_EXECUTION";

	public static final String DISCONNECTION_EXECUTED = "DISCONNECTION_EXECUTED";

}
