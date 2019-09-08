package org.egov.pt.calculator.util;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.pt.calculator.service.ReceiptService;
import org.egov.pt.calculator.web.models.Assessment;
import org.egov.pt.calculator.web.models.DemandDetailAndCollection;
import org.egov.pt.calculator.web.models.GetBillCriteria;
import org.egov.pt.calculator.web.models.collections.Receipt;
import org.egov.pt.calculator.web.models.demand.BillAccountDetail;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.demand.DemandDetail;
import org.egov.pt.calculator.web.models.property.AuditDetails;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;
import org.springframework.util.CollectionUtils;

import static org.egov.pt.calculator.util.CalculatorConstants.ALLOWED_RECEIPT_STATUS;
import static org.egov.pt.calculator.util.CalculatorConstants.SERVICE_FIELD_VALUE_PT;
import static org.egov.pt.calculator.util.CalculatorConstants.STATUS_FIELD_FOR_SEARCH_URL;

@Component
@Getter
public class CalculatorUtils {

	@Autowired
	private Configurations configurations;

	@Autowired
	private ReceiptService rcptService;

	@Value("${customization.allowdepreciationonnoreceipts:false}")
	Boolean allowDepreciationsOnNoReceipts;


	private Map<String, Integer> taxHeadApportionPriorityMap;

	public Map<String, Integer> getTaxHeadApportionPriorityMap() {

		if (null == taxHeadApportionPriorityMap) {
			Map<String, Integer> map = new HashMap<>();
			map.put(CalculatorConstants.PT_TAX, 3);
			map.put(CalculatorConstants.PT_TIME_PENALTY, 1);
			map.put(CalculatorConstants.PT_FIRE_CESS, 2);
			map.put(CalculatorConstants.PT_TIME_INTEREST, 0);
			map.put(CalculatorConstants.MAX_PRIORITY_VALUE, 100);
		}
		return taxHeadApportionPriorityMap;
	}

	/**
	 * Prepares and returns Mdms search request with financial master criteria
	 *
	 * @param requestInfo
	 * @param assesmentYear
	 * @return
	 */
	public MdmsCriteriaReq getFinancialYearRequest(RequestInfo requestInfo, String assesmentYear, String tenantId) {

		MasterDetail mstrDetail = MasterDetail.builder().name(CalculatorConstants.FINANCIAL_YEAR_MASTER)
				.filter("[?(@." + CalculatorConstants.FINANCIAL_YEAR_RANGE_FEILD_NAME + " IN [" + assesmentYear + "])]")
				.build();
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(CalculatorConstants.FINANCIAL_MODULE)
				.masterDetails(Arrays.asList(mstrDetail)).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(moduleDetail)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	/**
	 * Prepares and returns Mdms search request with financial master criteria
	 *
	 * @param requestInfo
	 * @param assesmentYears
	 * @return
	 */
	public MdmsCriteriaReq getFinancialYearRequest(RequestInfo requestInfo, Set<String> assesmentYears, String tenantId) {

		String assessmentYearStr = StringUtils.join(assesmentYears,",");
		MasterDetail mstrDetail = MasterDetail.builder().name(CalculatorConstants.FINANCIAL_YEAR_MASTER)
				.filter("[?(@." + CalculatorConstants.FINANCIAL_YEAR_RANGE_FEILD_NAME + " IN [" + assessmentYearStr + "]" +
						" && @.module== '"+SERVICE_FIELD_VALUE_PT+"')]")
				.build();
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(CalculatorConstants.FINANCIAL_MODULE)
				.masterDetails(Arrays.asList(mstrDetail)).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(moduleDetail)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	/**
	 * Methods provides all the usage category master for property tax module
	 */
	public MdmsCriteriaReq getPropertyModuleRequest(RequestInfo requestInfo, String tenantId) {

		List<MasterDetail> details = new ArrayList<>();

		details.add(MasterDetail.builder().name(CalculatorConstants.USAGE_MAJOR_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.USAGE_MINOR_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.USAGE_SUB_MINOR_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.USAGE_DETAIL_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.OWNER_TYPE_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.REBATE_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.PENANLTY_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.FIRE_CESS_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.CANCER_CESS_MASTER).build());
		details.add(MasterDetail.builder().name(CalculatorConstants.INTEREST_MASTER).build());
		ModuleDetail mdDtl = ModuleDetail.builder().masterDetails(details)
				.moduleName(CalculatorConstants.PROPERTY_TAX_MODULE).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(mdDtl)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	/**
	 * Returns the url for mdms search endpoint
	 *
	 * @return
	 */
	public StringBuilder getMdmsSearchUrl() {
		return new StringBuilder().append(configurations.getMdmsHost()).append(configurations.getMdmsEndpoint());
	}

	/**
	 * Returns the tax head search Url with tenantId and PropertyTax service name
	 * parameters
	 *
	 * @param tenantId
	 * @return
	 */
	public StringBuilder getTaxHeadSearchUrl(String tenantId) {

		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getTaxheadsSearchEndpoint()).append(CalculatorConstants.URL_PARAMS_SEPARATER)
				.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(CalculatorConstants.SEPARATER).append(CalculatorConstants.SERVICE_FIELD_FOR_SEARCH_URL)
				.append(CalculatorConstants.SERVICE_FIELD_VALUE_PT);
	}

	/**
	 * Returns the tax head search Url with tenantId and PropertyTax service name
	 * parameters
	 *
	 * @param tenantId
	 * @return
	 */
	public StringBuilder getTaxPeriodSearchUrl(String tenantId) {

		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getTaxPeriodSearchEndpoint()).append(CalculatorConstants.URL_PARAMS_SEPARATER)
				.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(CalculatorConstants.SEPARATER).append(CalculatorConstants.SERVICE_FIELD_FOR_SEARCH_URL)
				.append(CalculatorConstants.SERVICE_FIELD_VALUE_PT);
	}

	/**
	 * Returns the Receipt search Url with tenantId and cosumerCode service name
	 * parameters
	 *
	 * @param tenantId
	 * @return
	 */
	public StringBuilder getReceiptSearchUrl(String tenantId, List<String> consumerCodes) {

		return new StringBuilder().append(configurations.getCollectionServiceHost())
				.append(configurations.getReceiptSearchEndpoint()).append(CalculatorConstants.URL_PARAMS_SEPARATER)
				.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(CalculatorConstants.SEPARATER).append(CalculatorConstants.CONSUMER_CODE_SEARCH_FIELD_NAME)
				.append(consumerCodes.toString().replace("[", "").replace("]", ""))
				.append(CalculatorConstants.SEPARATER).append(STATUS_FIELD_FOR_SEARCH_URL)
				.append(ALLOWED_RECEIPT_STATUS);
	}

	/**
	 * method to create demandsearch url with demand criteria
	 *
	 * @param getBillCriteria
	 * @return
	 */
	public StringBuilder getDemandSearchUrl(GetBillCriteria getBillCriteria) {

		if(CollectionUtils.isEmpty(getBillCriteria.getConsumerCodes()))
			return new StringBuilder().append(configurations.getBillingServiceHost())
					.append(configurations.getDemandSearchEndPoint()).append(CalculatorConstants.URL_PARAMS_SEPARATER)
					.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(getBillCriteria.getTenantId())
					.append(CalculatorConstants.SEPARATER)
					.append(CalculatorConstants.CONSUMER_CODE_SEARCH_FIELD_NAME).append(getBillCriteria.getPropertyId()+ CalculatorConstants.PT_CONSUMER_CODE_SEPARATOR +getBillCriteria.getAssessmentNumber());

		else return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getDemandSearchEndPoint()).append(CalculatorConstants.URL_PARAMS_SEPARATER)
				.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(getBillCriteria.getTenantId())
				.append(CalculatorConstants.SEPARATER)
				.append(CalculatorConstants.CONSUMER_CODE_SEARCH_FIELD_NAME).append(StringUtils.join(getBillCriteria.getConsumerCodes(),","));


	}

	/**
	 * method to create demandsearch url with demand criteria
	 *
	 * @param assessment
	 * @return
	 */
	public StringBuilder getDemandSearchUrl(Assessment assessment) {

		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getDemandSearchEndPoint()).append(CalculatorConstants.URL_PARAMS_SEPARATER)
				.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(assessment.getTenantId())
				.append(CalculatorConstants.SEPARATER)
				.append(CalculatorConstants.CONSUMER_CODE_SEARCH_FIELD_NAME).append(assessment.getPropertyId()+ CalculatorConstants.PT_CONSUMER_CODE_SEPARATOR +assessment.getAssessmentNumber());
	}

	/**
	 * Returns the applicable total tax amount to be paid on a demand
	 *
	 * @param demand
	 * @return
	 */
	public BigDecimal getTaxAmtFromDemandForApplicablesGeneration(Demand demand) {
		BigDecimal taxAmt = BigDecimal.ZERO;
		for (DemandDetail detail : demand.getDemandDetails()) {
			if (CalculatorConstants.TAXES_TO_BE_CONSIDERD.contains(detail.getTaxHeadMasterCode()))
				taxAmt = taxAmt.add(detail.getTaxAmount());
		}
		return taxAmt;
	}

	/**
	 * Returns the total tax amount to be paid on a demand
	 *
	 * @param demand
	 * @return
	 */
	public BigDecimal getTaxAmtFromDemandForAdditonalTaxes(Demand demand) {
		BigDecimal taxAmt = BigDecimal.ZERO;
		for (DemandDetail detail : demand.getDemandDetails()) {
			if (CalculatorConstants.ADDITIONAL_TAXES
					.contains(detail.getTaxHeadMasterCode()))
				taxAmt = taxAmt.add(detail.getTaxAmount());
			else if (CalculatorConstants.ADDITIONAL_DEBITS
					.contains(detail.getTaxHeadMasterCode()))
				taxAmt = taxAmt.subtract(detail.getTaxAmount());
		}
		return taxAmt;
	}

	/**
	 * Returns url for demand update Api
	 *
	 * @return
	 */
	public StringBuilder getUpdateDemandUrl() {
		return new StringBuilder().append(configurations.getBillingServiceHost()).append(configurations.getDemandUpdateEndPoint());
	}

	/**
	 * Returns url for Bill Gen Api
	 *
	 * @param tenantId
	 * @param demandId
	 * @return
	 */
	public StringBuilder getBillGenUrl(String tenantId, String demandId, String consumerCode) {
		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getBillGenEndPoint()).append(CalculatorConstants.URL_PARAMS_SEPARATER)
				.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(CalculatorConstants.SEPARATER).append(CalculatorConstants.DEMAND_ID_SEARCH_FIELD_NAME)
				.append(demandId).append(CalculatorConstants.SEPARATER)
				.append(CalculatorConstants.BUSINESSSERVICE_FIELD_FOR_SEARCH_URL)
				.append(CalculatorConstants.PROPERTY_TAX_SERVICE_CODE).append(CalculatorConstants.SEPARATER)
				.append(CalculatorConstants.CONSUMER_CODE_SEARCH_FIELD_NAME).append(consumerCode);
	}

	/**
	 * Query to fetch assessments for the given criteria
	 *
	 * @param assessment
	 * @return
	 */
	public String getAssessmentQuery(Assessment assessment, List<Object> preparedStmtList) {

		StringBuilder query = new StringBuilder("SELECT * FROM eg_pt_assessment where tenantId=");

		preparedStmtList.add(assessment.getTenantId());

		if (assessment.getAssessmentNumber() != null) {
			query.append(" AND assessmentNumber=?");
			preparedStmtList.add(assessment.getAssessmentNumber());
		}

		if (assessment.getDemandId() != null) {
			query.append(" AND a1.demandId=?");
			preparedStmtList.add(assessment.getDemandId());
		}

		if (assessment.getPropertyId() != null) {
			query.append(" AND a1.propertyId=?");
			preparedStmtList.add(assessment.getPropertyId());
		}

		query.append(" ORDER BY createdtime");

		return query.toString();
	}

	/**
	 * Query to fetch latest assessment for the given criteria
	 *
	 * @param assessment
	 * @return
	 */
	 public String getMaxAssessmentQuery(Assessment assessment, List<Object> preparedStmtList) {

 		StringBuilder query = new StringBuilder("SELECT * FROM eg_pt_assessment a1 INNER JOIN "

 				+ "(select Max(createdtime) as maxtime, propertyid, assessmentyear from eg_pt_assessment WHERE Active = TRUE group by propertyid, assessmentyear) a2 "

 				+ "ON a1.createdtime=a2.maxtime and a1.propertyid=a2.propertyid where a1.tenantId=? ");

		preparedStmtList.add(assessment.getTenantId());

		if (assessment.getDemandId() != null) {
			query.append(" AND a1.demandId=?");
			preparedStmtList.add(assessment.getDemandId());
		}

		if (assessment.getPropertyId() != null) {
			query.append(" AND a1.propertyId=?");
			preparedStmtList.add(assessment.getPropertyId());
		}

		if(assessment.getAssessmentYear() != null) {
			query.append(" AND a1.assessmentyear=?");
			preparedStmtList.add(assessment.getAssessmentYear());
		}
		
		query.append(" AND a1.active IS TRUE");

		return query.toString();
	}

	/**
	 * Returns the insert query for assessment
	 * @return
	 */
	public String getAssessmentInsertQuery() {
		return CalculatorConstants.QUERY_ASSESSMENT_INSERT;
	}

	/**
	 * Adds up the collection amount from the given demand
	 * and the previous advance carry forward together as new advance carry forward
	 *
	 * @param demand
	 * @return carryForward
	 */
	public BigDecimal getTotalCollectedAmountAndPreviousCarryForward(Demand demand) {

		BigDecimal carryForward = BigDecimal.ZERO;
		for (DemandDetail detail : demand.getDemandDetails()) {

			carryForward = carryForward.add(detail.getCollectionAmount());
			if (detail.getTaxHeadMasterCode().equalsIgnoreCase(CalculatorConstants.PT_ADVANCE_CARRYFORWARD))
				carryForward = carryForward.add(detail.getTaxAmount());
		}
		return carryForward;
	}

	public AuditDetails getAuditDetails(String by, boolean isCreate) {
		Long time = new Date().getTime();

		if (isCreate)
			return AuditDetails.builder().createdBy(by).createdTime(time).lastModifiedBy(by).lastModifiedTime(time)
					.build();
		else
			return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
	}


	public DemandDetailAndCollection getLatestDemandDetailByTaxHead(String taxHeadCode, List<DemandDetail> demandDetails){
		List<DemandDetail> details = demandDetails.stream().filter(demandDetail -> demandDetail.getTaxHeadMasterCode().equalsIgnoreCase(taxHeadCode))
				.collect(Collectors.toList());
		if(CollectionUtils.isEmpty(details))
			return null;

		BigDecimal taxAmountForTaxHead = BigDecimal.ZERO;
		BigDecimal collectionAmountForTaxHead = BigDecimal.ZERO;
		DemandDetail latestDemandDetail = null;
		long maxCreatedTime = 0l;

		for(DemandDetail detail : details){
			taxAmountForTaxHead = taxAmountForTaxHead.add(detail.getTaxAmount());
			collectionAmountForTaxHead = collectionAmountForTaxHead.add(detail.getCollectionAmount());
			if(detail.getAuditDetails().getCreatedTime()>maxCreatedTime){
				maxCreatedTime = detail.getAuditDetails().getCreatedTime();
				latestDemandDetail = detail;
			}
		}

		return DemandDetailAndCollection.builder()
				.taxHeadCode(taxHeadCode)
				.latestDemandDetail(latestDemandDetail)
				.taxAmountForTaxHead(taxAmountForTaxHead)
				.collectionAmountForTaxHead(collectionAmountForTaxHead)
				.build();

		}


	/**
	 * Returns the applicable total tax amount to be paid after the receipt
	 *
	 * @param receipt
	 * @return
	 */
	public BigDecimal getTaxAmtFromReceiptForApplicablesGeneration(Receipt receipt) {
		BigDecimal taxAmt = BigDecimal.ZERO;
		BigDecimal amtPaid = BigDecimal.ZERO;
		List<BillAccountDetail> billAccountDetails = receipt.getBill().get(0).getBillDetails().get(0).getBillAccountDetails();
		for (BillAccountDetail detail : billAccountDetails) {
			if (CalculatorConstants.TAXES_TO_BE_CONSIDERD.contains(detail.getTaxHeadCode()))
			{
				taxAmt = taxAmt.add(detail.getAmount());
				amtPaid = amtPaid.add(detail.getAdjustedAmount());
			}
		}
		return taxAmt.subtract(amtPaid);
	}


	/**
	 * Returns the current end of the day epoch time for the given epoch time
	 * @param epoch The epoch time for which end of day time is required
	 * @return End of day epoch time for the given time
	 */
	public static Long getEODEpoch(Long epoch){
		LocalDate date =
				Instant.ofEpochMilli(epoch).atZone(ZoneId.of(ZoneId.SHORT_IDS.get("IST"))).toLocalDate();
		LocalDateTime endOfDay = LocalDateTime.of(date, LocalTime.MAX);
		Long eodEpoch = endOfDay.atZone(ZoneId.of(ZoneId.SHORT_IDS.get("IST"))).toInstant().toEpochMilli();
		return eodEpoch;
	}

	/**
	 * Check if Depreciation is allowed for this Property.
	 * In case there is no receipt the depreciation will be allowed
	 * @param assessmentYear The year for which existing receipts needs to be checked
	 * @param tenantId The tenantid of the property
	 * @param propertyId The property id
	 * @param requestInfoWrapper The incoming requestInfo
	 */

	public Boolean isAssessmentDepreciationAllowed(String assessmentYear, String tenantId, String propertyId,
					RequestInfoWrapper requestInfoWrapper) {
		boolean isDepreciationAllowed = false;
		if (allowDepreciationsOnNoReceipts) {
			List<Receipt> receipts = rcptService.getReceiptsFromPropertyAndFY(assessmentYear,tenantId, propertyId,
					requestInfoWrapper);

			if (receipts.size() == 0)
				isDepreciationAllowed = true;
		}

		return isDepreciationAllowed;
	}

}
