package org.egov.pt.calculator.util;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.egov.pt.calculator.web.models.demand.Category;
import org.egov.pt.calculator.web.models.demand.DemandStatus;

public class CalculatorConstants {

	private CalculatorConstants() {

	}
	
	/*
	 * property type constants
	 */
	
	public static final String PT_TYPE_VACANT_LAND = "VACANT"; 
	
	/*
	 * tax head codes constants
	 */
	public static final String MAX_PRIORITY_VALUE = "MAX_PRIORITY_VALUE";

	public static final String PT_TAX = "PT_TAX";

	public static final String PT_UNIT_USAGE_EXEMPTION = "PT_UNIT_USAGE_EXEMPTION";

	public static final String PT_OWNER_EXEMPTION = "PT_OWNER_EXEMPTION";

	public static final String PT_TIME_REBATE = "PT_TIME_REBATE";

	public static final String PT_TIME_PENALTY = "PT_TIME_PENALTY";

	public static final String PT_TIME_INTEREST = "PT_TIME_INTEREST";

	public static final String PT_ADVANCE_CARRYFORWARD = "PT_ADVANCE_CARRYFORWARD";

	public static final String PT_FIRE_CESS = "PT_FIRE_CESS";

	public static final String PT_CANCER_CESS = "PT_CANCER_CESS";

	public static final String PT_ADHOC_PENALTY = "PT_ADHOC_PENALTY";

	public static final String PT_ADHOC_REBATE = "PT_ADHOC_REBATE";

//	public static final String PT_DECIMAL_CEILING_CREDIT = "PT_DECIMAL_CEILING_CREDIT";
	
//	public static final String PT_DECIMAL_CEILING_DEBIT = "PT_DECIMAL_CEILING_DEBIT";

	public static final String PT_ROUNDOFF = "PT_ROUNDOFF";

	public static final String ADHOC_PENALTY_KEY = "adhocPenalty";

	public static final String ADHOC_PENALTY_REASON_KEY = "adhocPenaltyReason";

	public static final String ADHOC_REBATE_KEY = "adhocExemption";

	public static final String ADHOC_REBATE_REASON_KEY = "adhocExemptionReason";
	
	public static final String ALLOWED_RECEIPT_STATUS = "APPROVED,REMITTED";

	public static final List<String> TAXES_TO_BE_CONSIDERD_WHEN_CALUCLATING_REBATE_AND_PENALTY = Collections.unmodifiableList(Arrays
			.asList(PT_TAX));
	
	public static final List<String> TAXES_TO_BE_SUBTRACTED_WHEN_CALCULATING_REBATE_AND_PENALTY = Collections.unmodifiableList(Arrays
			.asList(PT_OWNER_EXEMPTION, PT_UNIT_USAGE_EXEMPTION ));

	public static final List<String> TAXES_TO_BE_CONSIDERD = Collections.unmodifiableList(Arrays
			.asList(PT_TAX,PT_OWNER_EXEMPTION, PT_UNIT_USAGE_EXEMPTION ));
	/*
	 * these lists has to be updated with every new additional taxes which will be applied on the principle tax(PT_TAX)  
	 */
	public static final List<String> ADDITIONAL_TAXES = Collections.unmodifiableList(Arrays
			.asList(PT_FIRE_CESS, PT_ADHOC_PENALTY, PT_CANCER_CESS));
					
	public static final List<String> ADDITIONAL_DEBITS = Collections.unmodifiableList(Arrays
							.asList( PT_ADHOC_REBATE));					

	/*
	 * Mdms constants
	 */

	/*
	 * Master names
	 */

	public static final String USAGE_MAJOR_MASTER = "UsageCategoryMajor";

	public static final String USAGE_MINOR_MASTER = "UsageCategoryMinor";

	public static final String USAGE_SUB_MINOR_MASTER = "UsageCategorySubMinor";

	public static final String USAGE_DETAIL_MASTER = "UsageCategoryDetail";

	public static final String FINANCIAL_YEAR_MASTER = "FinancialYear";

	public static final String OWNER_TYPE_MASTER = "OwnerType";

	public static final String REBATE_MASTER = "Rebate";

	public static final String PENANLTY_MASTER = "Penalty";

	public static final String FIRE_CESS_MASTER = "FireCess";

	public static final String CANCER_CESS_MASTER = "CancerCess";

	public static final String INTEREST_MASTER = "Interest";

	public static final List<String> PROPERTY_BASED_EXEMPTION_MASTERS = Collections.unmodifiableList(Arrays.asList(
			USAGE_MAJOR_MASTER, USAGE_MINOR_MASTER, USAGE_SUB_MINOR_MASTER, USAGE_DETAIL_MASTER, OWNER_TYPE_MASTER));
	
	public static final List<Category> DEBIT_CATEGORIES = Collections.unmodifiableList(Arrays.asList(Category.REBATE, Category.EXEMPTION));

	/*
	 * Module names
	 */

	public static final String FINANCIAL_MODULE = "egf-master";

	public static final String PROPERTY_TAX_MODULE = "PropertyTax";

	/*
	 * data field names
	 */

	public static final String EXEMPTION_FIELD_NAME = "exemption";

	public static final String MAX_AMOUNT_FIELD_NAME = "maxAmount";

	public static final String MIN_AMOUNT_FIELD_NAME = "minAmount";

	public static final String FLAT_AMOUNT_FIELD_NAME = "flatAmount";

	public static final String RATE_FIELD_NAME = "rate";

	public static final String CODE_FIELD_NAME = "code";

	public static final String FROMFY_FIELD_NAME = "fromFY";

	public static final String ENDING_DATE_APPLICABLES = "endingDay";

	public static final String STARTING_DATE_APPLICABLES = "startingDay";

    public static final String RECEIPT_START_DATE_PARAM = "fromDate=";

    public static final String RECEIPT_END_DATE_PARAM = "toDate=";

    public static final String DEMAND_START_DATE_PARAM = "periodFrom=";

    public static final String DEMAND_END_DATE_PARAM = "periodTo=";

	public static final String DEMAND_STATUS_PARAM = "status=";

	public static final String DEMAND_STATUS_ACTIVE = DemandStatus.ACTIVE.toString();

	public static final String OWNER_STATUS_ACTIVE = "ACTIVE";

	/*
	 * special characters
	 */

	public static final String UNDERSCORE = "_";
	
	public static final String PT_CONSUMER_CODE_SEPARATOR = ":";

	/*
	 * bigdecimal values
	 */

	public static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

	/*
	 * Field Name constants
	 */
	public static final String MDMS_RESPONSE = "MdmsRes";

	public static final String FINANCIAL_YEAR_RANGE_FEILD_NAME = "finYearRange";

	public static final String BILLING_SLAB_MASTER = "BillingSlab";

	public static final String BILLING_SLAB_MODULE = PROPERTY_TAX_MODULE;

	public static final String FINANCIAL_YEAR_STARTING_DATE = "startingDate";

	public static final String FINANCIAL_YEAR_ENDING_DATE = "endingDate";

	public static final String PROPERTY_TAX_SERVICE_CODE = "PT";

	public static final String TENANT_ID_FIELD_FOR_SEARCH_URL = "tenantId=";

	public static final String SERVICE_FIELD_FOR_SEARCH_URL = "service=";
	
	public static final String BUSINESSSERVICE_FIELD_FOR_SEARCH_URL = "businessService=";

	public static final String STATUS_FIELD_FOR_SEARCH_URL = "status=";

	public static final String SERVICE_FIELD_VALUE_PT = "PT";

	public static final String SERVICE_FIELD_VALUE_PT_MUTATION = "PT.MUTATION";

	public static final String URL_PARAMS_SEPARATER = "?";

	public static final String SEPARATER = "&";

	public static final String ASSESSMENTNUMBER_FIELD_SEARCH = "propertyDetailids=";

	public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear[?(@.code==\"{}\")]";

	public static final String FINANCIALYEAR_MASTER_KEY = "FINANCIALYEAR";

	public static final String TAXPERIOD_MASTER_KEY = "TAXPERIOD";

	public static final String TAXHEADMASTER_MASTER_KEY = "TAXHEADMASTER";

	/*
	 * billing service field names
	 */

	public static final String CONSUMER_CODE_SEARCH_FIELD_NAME = "consumerCode=";

	public static final String CONSUMER_CODE_SEARCH_FIELD_NAME_PAYMENT = "consumerCodes=";


	public static final String DEMAND_ID_SEARCH_FIELD_NAME = "demandId=";
	
	public static final String DEMAND_CANCELLED_STATUS = DemandStatus.CANCELLED.toString();

	/*
	 * queries
	 */

	public static final String QUERY_ASSESSMENT_INSERT = "INSERT INTO eg_pt_assessment (uuid, assessmentnumber, assessmentyear, demandid,"

			+ " propertyid, tenantid, createdby, createdtime, lastmodifiedby, lastmodifiedtime)"

			+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

	/*
	 * exceptions
	 */
	public static final String CONNECT_EXCEPTION_KEY = "CONNECTION_FAILED";

	public static final String EG_PT_DEPRECIATING_ASSESSMENT_ERROR = "EG_PT_DEPRECIATING_ASSESSMENT_ERROR";
	public static final String EG_PT_DEPRECIATING_ASSESSMENT_ERROR_MSG = "Depreciating assessments are not allowed for the same assessment year,"
			+ "please kindly update the values for the following properties with assessmentNumbers : ";
	public static final String EG_PT_DEPRECIATING_ASSESSMENT_ERROR_MSG_ESTIMATE = "Depreciating assessments are not allowed for the same assessment year,"
			+ "please kindly update the values for the property ";

	public static final String EMPTY_DEMAND_ERROR_CODE = "EMPTY_DEMANDS";
	public static final String EMPTY_DEMAND_ERROR_MESSAGE = "No demands found for the given bill generate criteria";
	
	public static final String BILLING_SLAB_MATCH_ERROR_CODE = "NO_BILLING_SLAB_FOUND";
	public static final String BILLING_SLAB_MATCH_ERROR_MESSAGE = "No matching slabs has been found for unit on FloorNo : {floor} of Area : {area} with usageCategoryDetail : {usageDetail}";

	
	public static final String BILLING_SLAB_MATCH_FLOOR = "{floor}";
	public static final String BILLING_SLAB_MATCH_AREA = "{area}";
	public static final String BILLING_SLAB_MATCH_USAGE_DETAIL = "{usageDetail}";

	
	public static final String EG_PT_OWNER_TYPE_INVALID = "EG_PT_OWNER_TYPE_INVALID";
	public static final String EG_PT_OWNER_TYPE_INVALID_MESSAGE = "The given owner type value is invalid : ";

	
	public static final String PT_ADHOC_REBATE_INVALID_AMOUNT = "PT_ADHOC_REBATE_INVALID_AMOUNT";
	public static final String PT_ADHOC_REBATE_INVALID_AMOUNT_MSG = "Adhoc Exemption cannot be greater than the estimated tax for the given property please enter a value lesser than : ";

	
	public static final String PT_ESTIMATE_AREA_NULL = "PT_ESTIMATE_AREA_NULL";
	public static final String PT_ESTIMATE_AREA_NULL_MSG = "At least one area value either buildUpArea Or landArea should be provided";


	public static final String PT_ESTIMATE_GROUND_AREA_ZERO = "PT_ESTIMATE_GROUND_AREA_ZERO";
	public static final String PT_ESTIMATE_GROUND_AREA_ZERO_MSG = "Ground floor units must be present in the absence of proper buildup area";


	public static final String PT_ESTIMATE_VACANT_LAND_NULL = "PT_ESTIMATE_VACANT_LAND_AREA_NULL";
	public static final String PT_ESTIMATE_VACANT_LAND_NULL_MSG = "landArea is mandatory for vacant land";

	
	public static final String PT_ESTIMATE_BILLINGSLABS_UNMATCH_VACANCT = "PT_ESTIMATE_BILLINGSLABS_UNMATCH";
	public static final String PT_ESTIMATE_BILLINGSLABS_UNMATCH_VACANT_MSG = "Incorrect count of {count} billing slabs has been found for the given VACANT LAND property detail";

	public static final String PT_ESTIMATE_BILLINGSLABS_UNMATCH = "PT_ESTIMATE_BILLINGSLABS_UNMATCH";
	public static final String PT_ESTIMATE_BILLINGSLABS_UNMATCH_MSG = "more than one billing slab with ids : {ids} has been found for the given unit : ";
	public static final String PT_ESTIMATE_BILLINGSLABS_UNMATCH_replace_id = "{ids}";

	public static final String PT_ESTIMATE_NON_VACANT_LAND_UNITS = "PT_ESTIMATE_NON_VACANT_LAND_UNITS";
	public static final String PT_ESTIMATE_NON_VACANT_LAND_UNITS_MSG = "unit is mandatory for non vacant land properties";
	
	public static final String PT_GET_BILL_ARREAR_DEMAND = "PT_GET_BILL_ARREAR_DEMAND";
	public static final String PT_GET_BILL_ARREAR_DEMAND_MSG = "Partial Payment is not allowed for arrear payments, please make the complete payment";
	
	public static final String EG_PT_ESTIMATE_ARV_NULL = "EG_PT_ESTIMATE_ARV_NULL";
	public static final String EG_PT_ESTIMATE_ARV_NULL_MSG = "Arv field is required for Commercial plus Rented properties";

	public static final String EG_PT_FINANCIAL_MASTER_NOT_FOUND = "EG_PT_FINANCIAL_MASTER_NOT_FOUND";
	public static final String EG_PT_FINANCIAL_MASTER_NOT_FOUND_MSG = "No Financial Year data is available for the given year value of : ";
	
	public static final String EG_PT_INVALID_DEMAND_ERROR = "EG_PT_INVALID_DEMAND_ERROR";
	public static final String EG_PT_INVALID_DEMAND_ERROR_MSG = " Bill cannot be generated for previous assessments in a year, please use the latest assesmment to pay";

    public static final Long TIMEZONE_OFFSET = 19800000l;

    public static final String BILLINGSLAB_KEY = "calculationDescription";

	public static final String PT_MARKETVALUE_NULL = "PT_MARKETVALUE_NULL";
	public static final String PT_MARKETVALUE_NULL_MSG = "Market Value is not present in additional details or set as null or not in numeric format ";

	public static final String PT_DOCDATE_NULL = "PT_DOCDATE_NULL";
	public static final String PT_DOCDATE_NULL_MSG = "Document date is not present in additional details or set as null";

	public static final String PT_ADDITIONALNDETAILS_NULL = "PT_ADDITIONALNDETAILS_NULL";
	public static final String PT_ADDITIONALNDETAILS_NULL_MSG = "Additional Details should not be null. Please add field like marketValue, documentDate, adhocRebate and adhocPenalty with their proper value in additionalDetails object";

	public static final String DEMAND_UPDATE_FAILED = "DEMAND_UPDATE_FAILED";
	public static final String DEMAND_UPDATE_FAILED_MSG = "Demand Updation Failed";

	public static final String BILLING_SLAB_SEARCH_FAILED = "BILLING_SLAB_SEARCH_FAILED";
	public static final String BILLING_SLAB_SEARCH_FAILED_MSG = "Billing slab for the provided search criteria is not present. Please add the billing slab";

	public static final String DEMAND_CREATE_FAILED = "DEMAND_CREATE_FAILED";
	public static final String DEMAND_CREATE_FAILED_MSG = "Demand Creation Failed";

	public static final String MARKET_VALUE = "marketValue";
	public static final String DOCUMENT_DATE = "documentDate";
	public static final String NUMERIC_REGEX = "-?\\d+(\\.\\d+)?";
	public static final String ADHOC_REBATE = "adhocRebate";
	public static final String ADHOC_PENALTY = "adhocPenalty";

	public static final String MUTATION_PAYMENT_PERIOD_IN_MONTH = "mutationPaymentPeriodInMonth";

	public static final String TAX_PERIOD_SEARCH_FAILED = "EGPT_CALCULATOR_TAX_PERIOD_SEARCH_ERROR";
	public static final String TAX_PERIOD_SEARCH_FAILED_MSG = "Tax period for current financial year is not present. Please add the tax period details";
}
