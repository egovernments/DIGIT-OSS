package org.egov.demand.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Constants {
	
	public static final String DB_TYPE_JSONB = "jsonb";

	public static final String MODULE_NAME = "BillingService";
	
	public static final String MDMS_CODE_FILTER = "$.*.code";
	public static final String TAXPERIOD_CODE_FILTER = null;
	
	public static final String URL_PARAMS_FOR_SERVICE_BASED_DEMAND_APIS = "?tenantId={tenantId}&consumerCodes={consumerCodes}";
	public static final String TENANTID_REPLACE_TEXT = "{tenantId}";
	public static final String CONSUMERCODES_REPLACE_TEXT = "{consumerCodes}";
	
	public static final String TAXPERIOD_PATH_CODE = "$.MdmsRes.BillingService.TaxPeriod";
	public static final String TAXHEADMASTER_PATH_CODE = "$.MdmsRes.BillingService.TaxHeadMaster";
	public static final String BUSINESSSERVICE_PATH_CODE = "$.MdmsRes.BillingService.BusinessService.*.code";
	public static final String BUSINESSSERVICE_MODULE_PATH = "$.MdmsRes.BillingService.BusinessService";
	
	
	public static final String TAXPERIOD_MASTERNAME = "TaxPeriod";
	public static final String TAXHEAD_MASTERNAME = "TaxHeadMaster";
	public static final String BUSINESSSERVICE_MASTERNAME = "BusinessService";
	
	public static final List<String> MDMS_MASTER_NAMES = Collections
			.unmodifiableList(Arrays.asList(TAXHEAD_MASTERNAME, TAXPERIOD_MASTERNAME, BUSINESSSERVICE_MASTERNAME));
	
    public static final String INVALID_TENANT_ID_MDMS_KEY = "INVALID TENANTID";
    public static final String INVALID_TENANT_ID_MDMS_MSG = "No data found for this tenentID";
    
    
    /* 
     * ERROR CONSTANTS 
     */
    
    public static final String EG_BS_JSON_EXCEPTION_KEY = "EG_BS_JSON_EXCEPTION";
    public static final String EG_BS_JSON_EXCEPTION_MSG = "Exception occured while parsing additional details";
    
    public static final String EG_BS_BILL_NO_DEMANDS_FOUND_KEY = "EG_BS_BILL_NO_DEMANDS_FOUND";
    public static final String EG_BS_BILL_NO_DEMANDS_FOUND_MSG = "No Demands Found for the given bill generate criteria";
    
    
	public static final String INVALID_BUSINESS_FOR_TAXPERIOD_KEY = "EG_BS_TAXPERIODS_BUINESSSERVICE";
	public static final String INVALID_BUSINESS_FOR_TAXPERIOD_MSG = "No Tax Periods Found for the given BusinessServices value of {resplaceValues}";
	public static final String INVALID_BUSINESS_FOR_TAXPERIOD_REPLACE_TEXT = "{resplaceValues}";

	public static final String TAXPERIOD_NOT_FOUND_KEY = "EG_BS_TAXPERIODS_DEMAND";
	public static final String TAXPERIOD_NOT_FOUND_MSG = "No Tax Periods Found for the given demand with fromDate : {fromDate} and toDate : {toDate}";
	public static final String TAXPERIOD_NOT_FOUND_FROMDATE = "{fromDate}";
	public static final String TAXPERIOD_NOT_FOUND_TODATE = "{toDate}";

	public static final String BUSINESSSERVICE_NOT_FOUND_KEY = "EG_BS_BUSINESSSERVICE_NOTFOUND";
	public static final String BUSINESSSERVICE_NOT_FOUND_MSG = "No Business Service masters found for give codes {resplaceValues}";
	public static final String BUSINESSSERVICE_NOT_FOUND_REPLACETEXT = "{resplaceValues}";

	public static final String TAXHEADS_NOT_FOUND_KEY = "EG_BS_TAXHEADS_NOTFOUND";
	public static final String TAXHEADS_NOT_FOUND_MSG = "No TaxHead masters found for give codes {resplaceValues}";
	public static final String TAXHEADS_NOT_FOUND_REPLACETEXT = "{resplaceValues}";
	
	public static final String USER_UUID_NOT_FOUND_KEY = "EG_BS_USER_UUID_NOTFOUND";
	public static final String USER_UUID_NOT_FOUND_MSG = "No users found for following uuids  {resplaceValues}";
	public static final String USER_UUID_NOT_FOUND_REPLACETEXT = "{resplaceValues}";
	
	public static final String EMPLOYEE_UUID_FOUND_KEY = "EG_BS_EMPLOYEE_UUID_NOTALLOWED";
	public static final String EMPLOYEE_UUID_FOUND_MSG = "Employees cannot own a demand in system. The following uuids belonging to employees are rejected : {resplaceValues}";

	public static final String INVALID_DEMAND_DETAIL_KEY = "EG_DEMAND_DEATIL_INVALID";
	public static final String INVALID_DEMAND_DETAIL_MSG = "Invalid demand details found with following Values : {resplaceValues}";
	public static final String INVALID_DEMAND_DETAIL_REPLACETEXT = "{resplaceValues}";
	
	public static final String INVALID_DEMAND_DETAIL_ERROR_MSG = "collection amount : {collection}, cannot not be greater than taxAmount or Negative in case of positive tax : {tax}";
	public static final String INVALID_DEMAND_DETAIL_COLLECTION_TEXT = "{collection}";
	public static final String INVALID_DEMAND_DETAIL_TAX_TEXT = "{tax}";
	
	public static final String INVALID_NEGATIVE_DEMAND_DETAIL_ERROR_MSG = "collection amount : {collection}, should be equal to 'ZERO' or tax amount : {tax} in case of negative Tax";
	
	public static final String DEMAND_NOT_FOUND_KEY = "EG_BS_DEMANDS_NOT_FOUND";
	public static final String DEMAND_NOT_FOUND_MSG = "No Demands not found in db for following ids : {resplaceValues}";
	public static final String DEMAND_NOT_FOUND_REPLACETEXT = "{resplaceValues}";
	
	public static final String DEMAND_DETAIL_NOT_FOUND_KEY = "EG_BS_DEMAND_DETAIL_NOTFOUND";
	public static final String DEMAND_DETAIL_NOT_FOUND_MSG = "No Demand details found for the given ids :  {resplaceValues}";
	public static final String DEMAND_DETAIL_NOT_FOUND_REPLACETEXT = "{resplaceValues}";
	
	public static final String CONSUMER_CODE_DUPLICATE_KEY = "EG_BS_DUPLICATE_CONSUMERCODE";
	public static final String CONSUMER_CODE_DUPLICATE_MSG = "Demand already exists in the same period with the same businessService for the given consumercodes : {consumercodes}";
	public static final String CONSUMER_CODE_DUPLICATE_CONSUMERCODE_TEXT = "{consumercodes}";

	public static final String BILL_GEN_MANDATORY_FIELDS_MISSING_KEY = "BILL_GEN_MANDATORY_FIELDS_MISSING";
	public static final String BILL_GEN_MANDATORY_FIELDS_MISSING_MSG = "Valid search criteria fields missing, please give some valid criteria like mobileNumber/email OR 'businessService & consumerCode' OR demandId";
	
	
	public static final String DEMAND_WITH_NO_ID_KEY = "EG_BS_DEMANDS_UNDIDENTIFIABLE";
	public static final String DEMAND_WITH_NO_ID_MSG = "Demands, must contain ids in the update payload";

	public static final String URL_NOT_CONFIGURED_FOR_DEMAND_UPDATE_KEY = "URL_NOT_CONFIGURED_FOR_DEMAND_UPDATE";
	public static final String URL_NOT_CONFIGURED_FOR_DEMAND_UPDATE_MSG = " No URL found for demand update with business code : {businesscode}, Bill will be generated without demand update";
	public static final String URL_NOT_CONFIGURED_REPLACE_TEXT = "{businesscode}";
	/*
	 * Mdms master data 
	 */

	public static final String TAXHEADMASTER_SERVICE_FILTER = "$.[?(@.service== \"{}\")]";
	public static final String TAXHEADMASTER_EXPRESSION = "$.MdmsRes.BillingService.TaxHeadMaster[?(EXPRESSION)]";
	public static final String TAXHEADMASTER_CATEGORY_FILTER = "@.category == \"VAL\"";
	public static final String TAXHEADMASTER_NAME_FILTER = "@.name== \"VAL\"";
	public static final String TAXHEADMASTER_ISDEBIT_FILTER = "@.isDebit== \"VAL\"";
	public static final String TAXHEADMASTER_ISACTUALAMOUNT_FILTER = "@.isActualDemand== \"VAL\"";
	public static final String TAXHEADMASTER_IDS_FILTER = "@.id in [VAL]";
	public static final String TAXHEADMASTER_CODES_FILTER = "@.code in [VAL]";
	public static final String MDMS_NO_FILTER_TAXHEADMASTER = "$.MdmsRes.BillingService.TaxHeadMaster.*";
	


	public static final String TAXPERIOD_EXPRESSION = "$.MdmsRes.BillingService.TaxPeriod[?(EXPRESSION)]";
	public static final String TAXPERIOD_PERIODCYCLE_FILTER = "@.periodCycle == \"VAL\"";
	public static final String TAXPERIOD_CODE_SEARCH_FILTER = "@.code== \"VAL\"";
	public static final String TAXPERIOD_FROMDATE_FILTER = "@.fromDate >= VAL ";
	public static final String TAXPERIOD_TODATE_FILTER = "@.toDate <= VAL";
	public static final String TAXPERIOD_DATE_FILTER = "@.date == VAL";
	public static final String TAXPERIOD_IDS_FILTER = "@.id in [VAL]";
	public static final String TAXPERIOD_SERVICES_FILTER = "@.service in [VAL]";
	public static final String MDMS_NO_FILTER_TAXPERIOD = "$.MdmsRes.BillingService.TaxPeriod.*";
	
	public static final String BUSINESSSERVICE_EXPRESSION = "$.MdmsRes.BillingService.BusinessService[?(EXPRESSION)]";
	public static final String BUSINESSSERVICE_IDS_FILTER = "@.id in [VAL]";
	public static final String BUSINESSSERVICE_SERVICES_FILTER = "@.code in [VAL]";
	public static final String MDMS_NO_FILTER_BUSINESSSERVICE = "$.MdmsRes.BillingService.BusinessService.*";

	public static final String ADVANCE_TAXHEAD_JSONPATH_CODE = "$.MdmsRes.BillingService.TaxHeadMaster[?(@.category=='ADVANCE_COLLECTION' && @.service==\"{}\")].code";
	public static final String ADVANCE_BUSINESSSERVICE_JSONPATH_CODE = "$.MdmsRes.BillingService.BusinessService[?(@.code==\"{}\")].isAdvanceAllowed";

	public static final String RECEIPTNUMBER_KEY = "receiptNumber";
	public static final String PAYMENT_ID_KEY = "paymentId";

	public static final String EMPLOYEE_TYPE_CODE = "EMPLOYEE";
	
	
	/*
	 * Amendment Constants
	 */
	
	public static final String AMENDMENT_STRING_CONSTANT = "AMENDMENT";
	
	public static final String NOTETYPE_REPLACE_STRING = "NOTETYPE";

	public static final String CONSUMERCODE_REPLACE_STRING = "CONSUMERCODE";
	
	public static final String CREDIT_NOTE_VALUE = "CN";
	
	public static final String DEBIT_NOTE_VALUE = "DN";
	

	private Constants() {}
	
	public static final String BUSINESS_SERVICE_URL_PARAMETER = "businessService=";

	public static final String URL_PARAM_SEPERATOR = "&";
	
	public static final String RESPONSEINFO_STRING = "ResponseInfo";
	
	public static final String MESSAGE_STRING = "Message";
	
	public static final String SUCCESS_CANCEL_BILL_MSG = "Successfully cancelled {count} Active bills for given consumer codes";
	
	public static final String FAILURE_CANCEL_BILL_MSG = "No Active bills found for cancellation for the given criteria";
	
	public static final String PAID_CANCEL_BILL_MSG = "You cannot cancel the bill in the workflow";
	
	public static final String COUNT_REPLACE_CANCEL_BILL_MSG = "{count}";
	
	// Bill cancel 
	
	public static final String CANCELLATION_REASON_MSG= "reasonMessage";
	
	public static final String CANCELLATION_REASON_CODE= "reason";
	
	public static final String CANCELL_REASON_MSG_NOT_FOUND = "EG_BS_CANCELL_REASON_MSG_NOT";
	public static final String CANCELL_REASON_MSG_NOT_FOUND_MSG = "Cancell Reason message with key " + "'" + CANCELLATION_REASON_MSG + "'" + " is madnatory Text field in additionalDetails of Bill cancell Request";
	public static final String CANCELL_REASON_MSG_EMPTY_MSG = "Cancell Reason message cannot be empty";
	
	public static final String CANCELL_REASON_CODE_NOT_FOUND = "EG_BS_CANCELL_REASON_CODE_NOT";
	public static final String CANCELL_REASON_CODE_NOT_FOUND_MSG = "Cancellation Reason with key " + "'" + CANCELLATION_REASON_CODE + "'" + " is a madnatory Text field in additionalDetails of Bill cancell Request";
	public static final String CANCELL_REASON_CODE_EMPTY_MSG = "Cancell Reason code cannot be empty";
}