package org.egov.pt.calculator.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.util.PBFirecessUtils;
import org.egov.pt.calculator.validator.CalculationValidator;
import org.egov.pt.calculator.web.models.*;
import org.egov.pt.calculator.web.models.BillingSlabSearchCriteria;
import org.egov.pt.calculator.web.models.collections.Payment;
import org.egov.pt.calculator.web.models.demand.*;
import org.egov.pt.calculator.web.models.Calculation;
import org.egov.pt.calculator.web.models.CalculationCriteria;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.CalculationRes;
import org.egov.pt.calculator.web.models.TaxHeadEstimate;
import org.egov.pt.calculator.web.models.demand.Category;
import org.egov.pt.calculator.web.models.demand.TaxHeadMaster;
import org.egov.pt.calculator.web.models.property.*;
import org.egov.pt.calculator.web.models.propertyV2.AssessmentResponseV2;
import org.egov.pt.calculator.web.models.propertyV2.PropertyV2;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

import static org.egov.pt.calculator.util.CalculatorConstants.*;

@Service
@Slf4j
public class EstimationService {

	@Autowired
	private BillingSlabService billingSlabService;

	@Autowired
	private MutationBillingSlabService mutationService;

	@Autowired
	private PayService payService;

	/*@Autowired
	private ReceiptService rcptService;*/

	@Autowired
	private Configurations configs;

	@Autowired
	private MasterDataService mDataService;

	@Autowired
	private DemandService demandService;

	@Autowired
	private PBFirecessUtils firecessUtils;

	@Autowired
	CalculationValidator calcValidator;

	@Autowired
    private EnrichmentService enrichmentService;

	@Autowired
	private AssessmentService assessmentService;

	@Autowired
	private CalculatorUtils utils;
	
	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private Repository repository;

	@Autowired
	private ObjectMapper mapper;



	@Value("${customization.pbfirecesslogic:false}")
	Boolean usePBFirecessLogic;



	/**
	 * Calculates tax and creates demand for the given assessment number
	 * @param calculationReq The calculation request object containing the calculation criteria
	 * @return Map of assessment number to Calculation
	 */
	public Map<String, Calculation> calculateAndCreateDemand(CalculationReq calculationReq){
	//	assessmentService.enrichAssessment(calculationReq);
		Map<String,Calculation> res = demandService.generateDemands(calculationReq);
		return res;
	}

	/**
	 * Generates a map with assessment-number of property as key and estimation
	 * map(taxhead code as key, amount to be paid as value) as value
	 * will be called by calculate api
	 *
	 * @param request incoming calculation request containing the criteria.
	 * @return Map<String, Calculation> key of assessment number and value of calculation object.
	 */
	public Map<String, Calculation> getEstimationPropertyMap(CalculationReq request,Map<String,Object> masterMap) {

		RequestInfo requestInfo = request.getRequestInfo();
		List<CalculationCriteria> criteriaList = request.getCalculationCriteria();
		Map<String, Calculation> calculationPropertyMap = new HashMap<>();
		for (CalculationCriteria criteria : criteriaList) {
			Property property = criteria.getProperty();
			PropertyDetail detail = property.getPropertyDetails().get(0);
			calcValidator.validatePropertyForCalculation(detail);
			String assessmentNumber = detail.getAssessmentNumber();
			Calculation calculation = getCalculation(requestInfo, criteria,masterMap);
			calculation.setServiceNumber(property.getPropertyId());
			calculationPropertyMap.put(assessmentNumber, calculation);
		}
		return calculationPropertyMap;
	}

	/**
	 * Method to estimate the tax to be paid for given property
	 * will be called by estimate api
	 *
	 * @param request incoming calculation request containing the criteria.
	 * @return CalculationRes calculation object containing all the tax for the given criteria.
	 */
    public CalculationRes getTaxCalculation(CalculationReq request) {

        CalculationCriteria criteria = request.getCalculationCriteria().get(0);
        Property property = criteria.getProperty();
        PropertyDetail detail = property.getPropertyDetails().get(0);
        calcValidator.validatePropertyForCalculation(detail);
        Map<String,Object> masterMap = mDataService.getMasterMap(request);
        return new CalculationRes(new ResponseInfo(), Collections.singletonList(getCalculation(request.getRequestInfo(), criteria, masterMap)));
    }

	/**
	 * Generates a List of Tax head estimates with tax head code,
	 * tax head category and the amount to be collected for the key.
     *
     * @param criteria criteria based on which calculation will be done.
     * @param requestInfo request info from incoming request.
	 * @return Map<String, Double>
	 */
	private Map<String,List> getEstimationMap(CalculationCriteria criteria, RequestInfo requestInfo, Map<String, Object> masterMap) {

		BigDecimal taxAmt = BigDecimal.ZERO;
		BigDecimal usageExemption = BigDecimal.ZERO;
		Property property = criteria.getProperty();
		PropertyDetail detail = property.getPropertyDetails().get(0);
		String assessmentYear = detail.getFinancialYear();
		String tenantId = property.getTenantId();

		if(criteria.getFromDate()==null || criteria.getToDate()==null)
            enrichmentService.enrichDemandPeriod(criteria,assessmentYear,masterMap);

        List<BillingSlab> filteredBillingSlabs = getSlabsFiltered(property, requestInfo);

		Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap = new HashMap<>();
		Map<String, JSONArray> timeBasedExemptionMasterMap = new HashMap<>();
		mDataService.setPropertyMasterValues(requestInfo, tenantId, propertyBasedExemptionMasterMap,
				timeBasedExemptionMasterMap);

		List<String> billingSlabIds = new LinkedList<>();

		/*
		 * by default land should get only one slab from database per tenantId
		 */
		if (PT_TYPE_VACANT_LAND.equalsIgnoreCase(detail.getPropertyType()) && filteredBillingSlabs.size() != 1)
			throw new CustomException(PT_ESTIMATE_BILLINGSLABS_UNMATCH_VACANCT,PT_ESTIMATE_BILLINGSLABS_UNMATCH_VACANT_MSG
					.replace("{count}",String.valueOf(filteredBillingSlabs.size())));

		else if (PT_TYPE_VACANT_LAND.equalsIgnoreCase(detail.getPropertyType())) {
			taxAmt = taxAmt.add(BigDecimal.valueOf(filteredBillingSlabs.get(0).getUnitRate() * detail.getLandArea()));
		} else {

			double unBuiltRate = 0.0;
			int groundUnitsCount = 0;
			Double groundUnitsArea = 0.0;
			int i = 0;

			for (Unit unit : detail.getUnits()) {

				BillingSlab slab = getSlabForCalc(filteredBillingSlabs, unit);
				BigDecimal currentUnitTax = getTaxForUnit(slab, unit);
				billingSlabIds.add(slab.getId()+"|"+i);

				/*
				 * counting the number of units & total area in ground floor for unbuilt area
				 * tax calculation
				 */
				if (unit.getFloorNo().equalsIgnoreCase("0")) {
					groundUnitsCount += 1;
					groundUnitsArea += unit.getUnitArea();
					if (null != slab.getUnBuiltUnitRate())
						unBuiltRate += slab.getUnBuiltUnitRate();
				}
				taxAmt = taxAmt.add(currentUnitTax);
				usageExemption = usageExemption
						.add(getExemption(unit, currentUnitTax, assessmentYear, propertyBasedExemptionMasterMap));
				i++;
			}
			/*
			 * making call to get unbuilt area tax estimate
			 */
			taxAmt = taxAmt.add(getUnBuiltRate(detail, unBuiltRate, groundUnitsCount, groundUnitsArea));

			/*
			 * special case to handle property with one unit
			 */
			if (detail.getUnits().size() == 1)
				usageExemption = getExemption(detail.getUnits().get(0), taxAmt, assessmentYear,
						propertyBasedExemptionMasterMap);
		}

		List<TaxHeadEstimate> taxHeadEstimates =  getEstimatesForTax(requestInfo,taxAmt, usageExemption, property, propertyBasedExemptionMasterMap,
				timeBasedExemptionMasterMap,masterMap);


		Map<String,List> estimatesAndBillingSlabs = new HashMap<>();
		estimatesAndBillingSlabs.put("estimates",taxHeadEstimates);
		estimatesAndBillingSlabs.put("billingSlabIds",billingSlabIds);

		return estimatesAndBillingSlabs;

	}

	/**
	 * Private method to calculate the un-built area tax estimate
	 *
	 * gives the subtraction of landArea and buildUpArea if both are present.
	 *
	 * on absence of landArea Zero will be given.
	 *
	 * on absence of buildUpArea sum of all unit areas of ground floor
	 *
	 * will be subtracted from the landArea.
	 *
	 * the un-Built UnitRate is the average of unBuilt rates from ground units.
	 *
	 * @param detail The property detail
	 * @param unBuiltRate The unit rate for the un-built area in the given property detail.
	 * @param groundUnitsCount The count of all ground floor units.
	 * @param groundUnitsArea Sum of ground floor units area
	 * @return calculated tax for un-built area in the property detail.
	 */
	private BigDecimal getUnBuiltRate(PropertyDetail detail, double unBuiltRate, int groundUnitsCount, Double groundUnitsArea) {

        BigDecimal unBuiltAmt = BigDecimal.ZERO;
        if (0.0 < unBuiltRate && null != detail.getLandArea() && groundUnitsCount > 0) {

            double diffArea = null != detail.getBuildUpArea() ? detail.getLandArea() - detail.getBuildUpArea()
                    : detail.getLandArea() - groundUnitsArea;
            // ignoring if land Area is lesser than buildUpArea/groundUnitsAreaSum in estimate instead of throwing error
            // since property service validates the same for calculation
            diffArea = diffArea < 0.0 ? 0.0 : diffArea;
            unBuiltAmt = unBuiltAmt.add(BigDecimal.valueOf((unBuiltRate / groundUnitsCount) * (diffArea)));
        }
			return unBuiltAmt;
    }

	/**
	 * Returns Tax amount value for the unit from the list of slabs passed
	 *
	 * The tax is dependent on the unit rate and unit area for all cases
	 *
	 * except for commercial units which is rented, for this a percent will
	 *
	 * be applied on the annual rent value from the slab.
	 *
	 * arvPercent is not provided in the slab, it will be picked from the config
	 *
	 * which is common for the slab.
	 *
	 * @param slab The single billing slab that has been filtered for this particular unit.
	 * @param unit the unit for which tax should be calculated.
	 * @return calculated tax amount for the incoming unit
	 */
	private BigDecimal getTaxForUnit(BillingSlab slab, Unit unit) {

		boolean isUnitCommercial = unit.getUsageCategoryMajor().equalsIgnoreCase(configs.getUsageMajorNonResidential());
		boolean isUnitRented = unit.getOccupancyType().equalsIgnoreCase(configs.getOccupancyTypeRented());
		BigDecimal currentUnitTax;

        if (null == slab) {
            String msg = BILLING_SLAB_MATCH_ERROR_MESSAGE
                    .replace(BILLING_SLAB_MATCH_AREA, unit.getUnitArea().toString())
                    .replace(BILLING_SLAB_MATCH_FLOOR, unit.getFloorNo())
                    .replace(BILLING_SLAB_MATCH_USAGE_DETAIL,
                     null != unit.getUsageCategoryDetail() ? unit.getUsageCategoryDetail() : "nill");
            throw new CustomException(BILLING_SLAB_MATCH_ERROR_CODE, msg);
        }

		if (isUnitCommercial && isUnitRented) {

			if (unit.getArv() == null)
                throw new CustomException(EG_PT_ESTIMATE_ARV_NULL, EG_PT_ESTIMATE_ARV_NULL_MSG);

			BigDecimal multiplier;
			if (null != slab.getArvPercent())
				multiplier = BigDecimal.valueOf(slab.getArvPercent() / 100);
			else
				multiplier = BigDecimal.valueOf(configs.getArvPercent() / 100);
			currentUnitTax = unit.getArv().multiply(multiplier);
		} else {
			currentUnitTax = BigDecimal.valueOf(unit.getUnitArea() * slab.getUnitRate());
		}
		return currentUnitTax;
	}

	/**
	 * Return an Estimate list containing all the required tax heads
	 * mapped with respective amt to be paid.
	 *
	 * @param taxAmt tax amount for which rebate & penalty will be applied
	 * @param usageExemption  total exemption value given for all unit usages
	 * @param property proeprty  object

	 * @param propertyBasedExemptionMasterMap property masters which contains exemption values associated with them
	 * @param timeBasedExemeptionMasterMap masters with period based exemption values
	 * @param masterMap
	 */
	private List<TaxHeadEstimate> getEstimatesForTax(RequestInfo requestInfo,BigDecimal taxAmt, BigDecimal usageExemption, Property property,
			Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap,
			Map<String, JSONArray> timeBasedExemeptionMasterMap,Map<String, Object> masterMap) {



		PropertyDetail detail = property.getPropertyDetails().get(0);
		BigDecimal payableTax = taxAmt;
		List<TaxHeadEstimate> estimates = new ArrayList<>();

		//PropertyDetail detail = property.getPropertyDetails().get(0);
		String assessmentYear = detail.getFinancialYear();
		// taxes
		estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_TAX).estimateAmount(taxAmt.setScale(2, 2)).build());

		// usage exemption
		 usageExemption = usageExemption.setScale(2, 2).negate();
		estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_UNIT_USAGE_EXEMPTION).estimateAmount(
		        usageExemption).build());
		payableTax = payableTax.add(usageExemption);

		// owner exemption
		BigDecimal userExemption = getExemption(detail.getOwners(), payableTax, assessmentYear,
				propertyBasedExemptionMasterMap).setScale(2, 2).negate();
		estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_OWNER_EXEMPTION).estimateAmount(userExemption).build());
		payableTax = payableTax.add(userExemption);

		// Fire cess
		List<Object> fireCessMasterList = timeBasedExemeptionMasterMap.get(CalculatorConstants.FIRE_CESS_MASTER);
		BigDecimal fireCess;

		if (usePBFirecessLogic) {
			fireCess = firecessUtils.getPBFireCess(payableTax, assessmentYear, fireCessMasterList, detail);
			estimates.add(
					TaxHeadEstimate.builder().taxHeadCode(PT_FIRE_CESS).estimateAmount(fireCess.setScale(2, 2)).build());
		} else {
			fireCess = mDataService.getCess(payableTax, assessmentYear, fireCessMasterList);
			estimates.add(
					TaxHeadEstimate.builder().taxHeadCode(PT_FIRE_CESS).estimateAmount(fireCess.setScale(2, 2)).build());

		}

		// Cancer cess
		List<Object> cancerCessMasterList = timeBasedExemeptionMasterMap.get(CalculatorConstants.CANCER_CESS_MASTER);
		BigDecimal cancerCess = mDataService.getCess(payableTax, assessmentYear, cancerCessMasterList);
		estimates.add(
				TaxHeadEstimate.builder().taxHeadCode(PT_CANCER_CESS).estimateAmount(cancerCess.setScale(2, 2)).build());

		Map<String, Map<String, Object>> financialYearMaster = (Map<String, Map<String, Object>>) masterMap.get(FINANCIALYEAR_MASTER_KEY);

		Map<String, Object> finYearMap = financialYearMaster.get(assessmentYear);
		Long fromDate = (Long) finYearMap.get(FINANCIAL_YEAR_STARTING_DATE);
		Long toDate = (Long) finYearMap.get(FINANCIAL_YEAR_ENDING_DATE);

		TaxPeriod taxPeriod = TaxPeriod.builder().fromDate(fromDate).toDate(toDate).build();


		List<Payment> payments = new LinkedList<>();

		if(!StringUtils.isEmpty(property.getPropertyId()) && !StringUtils.isEmpty(property.getTenantId())){
			payments = paymentService.getPaymentsFromProperty(property, RequestInfoWrapper.builder().requestInfo(requestInfo).build());
		}


		// get applicable rebate and penalty
		Map<String, BigDecimal> rebatePenaltyMap = payService.applyPenaltyRebateAndInterest(payableTax, BigDecimal.ZERO,
				 assessmentYear, timeBasedExemeptionMasterMap,payments,taxPeriod);

		if (null != rebatePenaltyMap) {

			BigDecimal rebate = rebatePenaltyMap.get(PT_TIME_REBATE);
			BigDecimal penalty = rebatePenaltyMap.get(PT_TIME_PENALTY);
			BigDecimal interest = rebatePenaltyMap.get(PT_TIME_INTEREST);
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_TIME_REBATE).estimateAmount(rebate).build());
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_TIME_PENALTY).estimateAmount(penalty).build());
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_TIME_INTEREST).estimateAmount(interest).build());
			payableTax = payableTax.add(rebate).add(penalty).add(interest);
		}

		// AdHoc Values (additional rebate or penalty manually entered by the employee)
		if (null != detail.getAdhocPenalty())
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_ADHOC_PENALTY)
					.estimateAmount(detail.getAdhocPenalty()).build());

		if (null != detail.getAdhocExemption() && detail.getAdhocExemption().compareTo(payableTax.add(fireCess)) <= 0) {
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_ADHOC_REBATE)
					.estimateAmount(detail.getAdhocExemption().negate()).build());
		}
		else if (null != detail.getAdhocExemption()) {
			throw new CustomException(PT_ADHOC_REBATE_INVALID_AMOUNT, PT_ADHOC_REBATE_INVALID_AMOUNT_MSG + taxAmt);
		}
		return estimates;
	}

	/**
	 * Prepares Calculation Response based on the provided TaxHeadEstimate List
	 *
	 * All the credit taxHeads will be payable and all debit tax heads will be deducted.
	 *
	 * @param criteria criteria based on which calculation will be done.
	 * @param requestInfo request info from incoming request.
	 * @return Calculation object constructed based on the resulting tax amount and other applicables(rebate/penalty)
	 */
    private Calculation getCalculation(RequestInfo requestInfo, CalculationCriteria criteria,Map<String,Object> masterMap) {

        Map<String,List> estimatesAndBillingSlabs = getEstimationMap(criteria, requestInfo,masterMap);

		List<TaxHeadEstimate> estimates = estimatesAndBillingSlabs.get("estimates");
		List<String> billingSlabIds = estimatesAndBillingSlabs.get("billingSlabIds");

        Property property = criteria.getProperty();
        PropertyDetail detail = property.getPropertyDetails().get(0);
        String assessmentYear = detail.getFinancialYear();
        String assessmentNumber = null != detail.getAssessmentNumber() ? detail.getAssessmentNumber() : criteria.getAssessmentNumber();
        String tenantId = null != property.getTenantId() ? property.getTenantId() : criteria.getTenantId();


		Map<String, Category> taxHeadCategoryMap = ((List<TaxHeadMaster>)masterMap.get(TAXHEADMASTER_MASTER_KEY)).stream()
				.collect(Collectors.toMap(TaxHeadMaster::getCode, TaxHeadMaster::getCategory));

		BigDecimal taxAmt = BigDecimal.ZERO;
		BigDecimal penalty = BigDecimal.ZERO;
		BigDecimal exemption = BigDecimal.ZERO;
		BigDecimal rebate = BigDecimal.ZERO;
		BigDecimal ptTax = BigDecimal.ZERO;

		for (TaxHeadEstimate estimate : estimates) {

			Category category = taxHeadCategoryMap.get(estimate.getTaxHeadCode());
			estimate.setCategory(category);

			switch (category) {

			case TAX:
				taxAmt = taxAmt.add(estimate.getEstimateAmount());
				if(estimate.getTaxHeadCode().equalsIgnoreCase(PT_TAX))
					ptTax = ptTax.add(estimate.getEstimateAmount());
				break;

			case PENALTY:
				penalty = penalty.add(estimate.getEstimateAmount());
				break;

			case REBATE:
				rebate = rebate.add(estimate.getEstimateAmount());
				break;

			case EXEMPTION:
				exemption = exemption.add(estimate.getEstimateAmount());
				break;

			default:
				taxAmt = taxAmt.add(estimate.getEstimateAmount());
				break;
			}
		}
		TaxHeadEstimate decimalEstimate = payService.roundOfDecimals(taxAmt.add(penalty), rebate.add(exemption));
        if (null != decimalEstimate) {
			decimalEstimate.setCategory(taxHeadCategoryMap.get(decimalEstimate.getTaxHeadCode()));
            estimates.add(decimalEstimate);
            if (decimalEstimate.getEstimateAmount().compareTo(BigDecimal.ZERO)>=0)
                taxAmt = taxAmt.add(decimalEstimate.getEstimateAmount());
            else
                rebate = rebate.add(decimalEstimate.getEstimateAmount());
        }

		BigDecimal totalAmount = taxAmt.add(penalty).add(rebate).add(exemption);
		// false in the argument represents that the demand shouldn't be updated from this call
		Demand oldDemand = utils.getLatestDemandForCurrentFinancialYear(requestInfo,criteria);
		BigDecimal collectedAmtForOldDemand = demandService.getCarryForwardAndCancelOldDemand(ptTax, criteria, requestInfo,oldDemand, false);

		if(collectedAmtForOldDemand.compareTo(BigDecimal.ZERO) > 0)
			estimates.add(TaxHeadEstimate.builder()
					.taxHeadCode(PT_ADVANCE_CARRYFORWARD)
					.estimateAmount(collectedAmtForOldDemand).build());
		else if(collectedAmtForOldDemand.compareTo(BigDecimal.ZERO) < 0)
			throw new CustomException(EG_PT_DEPRECIATING_ASSESSMENT_ERROR, EG_PT_DEPRECIATING_ASSESSMENT_ERROR_MSG_ESTIMATE);

		return Calculation.builder()
				.totalAmount(totalAmount.subtract(collectedAmtForOldDemand))
				.taxAmount(taxAmt)
				.penalty(penalty)
				.exemption(exemption)
				.rebate(rebate)
				.fromDate(criteria.getFromDate())
				.toDate(criteria.getToDate())
				.tenantId(tenantId)
				.serviceNumber(property.getPropertyId())
				.taxHeadEstimates(estimates)
				.billingSlabIds(billingSlabIds)
				.build();
	}

	/**
	 * method to do a first level filtering on the slabs based on the values present in Property detail
	 */
	private List<BillingSlab> getSlabsFiltered(Property property, RequestInfo requestInfo) {

		PropertyDetail detail = property.getPropertyDetails().get(0);
		String tenantId = property.getTenantId();
		BillingSlabSearchCriteria slabSearchCriteria = BillingSlabSearchCriteria.builder().tenantId(tenantId).build();
		List<BillingSlab> billingSlabs = billingSlabService.searchBillingSlabs(requestInfo, slabSearchCriteria)
				.getBillingSlab();

		log.debug(" the slabs count : " + billingSlabs.size());
		final String all = configs.getSlabValueAll();

		Double plotSize = null != detail.getLandArea() ? detail.getLandArea() : detail.getBuildUpArea();

		final String dtlPtType = detail.getPropertyType();
		final String dtlPtSubType = detail.getPropertySubType();
		final String dtlOwnerShipCat = detail.getOwnershipCategory();
		final String dtlSubOwnerShipCat = detail.getSubOwnershipCategory();
		final String dtlAreaType = property.getAddress().getLocality().getArea();
		final Boolean dtlIsMultiFloored = detail.getNoOfFloors() > 1;

		return billingSlabs.stream().filter(slab -> {

			Boolean slabMultiFloored = slab.getIsPropertyMultiFloored();
			String  slabAreaType = slab.getAreaType();
			String  slabPropertyType = slab.getPropertyType();
			String  slabPropertySubType = slab.getPropertySubType();
			String  slabOwnerShipCat = slab.getOwnerShipCategory();
			String  slabSubOwnerShipCat = slab.getSubOwnerShipCategory();
			Double  slabAreaFrom = slab.getFromPlotSize();
			Double  slabAreaTo = slab.getToPlotSize();

			boolean isPropertyMultiFloored = slabMultiFloored.equals(dtlIsMultiFloored);

			boolean isAreaMatching = slabAreaType.equalsIgnoreCase(dtlAreaType) || all.equalsIgnoreCase(slab.getAreaType());

			boolean isPtTypeMatching = slabPropertyType.equalsIgnoreCase(dtlPtType);

			boolean isPtSubTypeMatching = slabPropertySubType.equalsIgnoreCase(dtlPtSubType)
					|| all.equalsIgnoreCase(slabPropertySubType);

			boolean isOwnerShipMatching = slabOwnerShipCat.equalsIgnoreCase(dtlOwnerShipCat)
					|| all.equalsIgnoreCase(slabOwnerShipCat);

			boolean isSubOwnerShipMatching = slabSubOwnerShipCat.equalsIgnoreCase(dtlSubOwnerShipCat)
					|| all.equalsIgnoreCase(slabSubOwnerShipCat);

			boolean isPlotMatching = false;

			if (plotSize == 0.0)
				isPlotMatching = slabAreaFrom <= plotSize && slabAreaTo >= plotSize;
			else
				isPlotMatching = slabAreaFrom < plotSize && slabAreaTo >= plotSize;

			return isPtTypeMatching && isPtSubTypeMatching && isOwnerShipMatching && isSubOwnerShipMatching
					&& isPlotMatching && isAreaMatching && isPropertyMultiFloored;

		}).collect(Collectors.toList());
	}

	/**
	 * Second level filtering to get the matching billing slab for the respective unit
	 * will return only one slab per unit.
	 *
	 * @param billingSlabs slabs filtered with property detail related values
	 * @param unit unit of the property for which the tax has be calculated
	 */
	private BillingSlab getSlabForCalc(List<BillingSlab> billingSlabs, Unit unit) {

		final String all = configs.getSlabValueAll();

		List<BillingSlab> matchingList = new ArrayList<>();

		for (BillingSlab billSlb : billingSlabs) {

			Double floorNo = Double.parseDouble(unit.getFloorNo());

			boolean isMajorMatching = billSlb.getUsageCategoryMajor().equalsIgnoreCase(unit.getUsageCategoryMajor())
					|| (billSlb.getUsageCategoryMajor().equalsIgnoreCase(all));

			boolean isMinorMatching = billSlb.getUsageCategoryMinor().equalsIgnoreCase(unit.getUsageCategoryMinor())
					|| (billSlb.getUsageCategoryMinor().equalsIgnoreCase(all));

			boolean isSubMinorMatching = billSlb.getUsageCategorySubMinor().equalsIgnoreCase(
					unit.getUsageCategorySubMinor()) || (billSlb.getUsageCategorySubMinor().equalsIgnoreCase(all));

			boolean isDetailsMatching = billSlb.getUsageCategoryDetail().equalsIgnoreCase(unit.getUsageCategoryDetail())
					|| (billSlb.getUsageCategoryDetail().equalsIgnoreCase(all));

			boolean isFloorMatching = billSlb.getFromFloor() <= floorNo && billSlb.getToFloor() >= floorNo;

			boolean isOccupancyTypeMatching = billSlb.getOccupancyType().equalsIgnoreCase(unit.getOccupancyType())
					|| (billSlb.getOccupancyType().equalsIgnoreCase(all));

			if (isMajorMatching && isMinorMatching && isSubMinorMatching && isDetailsMatching && isFloorMatching
					&& isOccupancyTypeMatching) {

				matchingList.add(billSlb);
				log.debug(" The Id of the matching slab : " + billSlb.getId());
			}
		}
		if (matchingList.size() == 1)
			return matchingList.get(0);
		else if (matchingList.size() == 0)
			return null;
		else throw new CustomException(PT_ESTIMATE_BILLINGSLABS_UNMATCH, PT_ESTIMATE_BILLINGSLABS_UNMATCH_MSG
					.replace(PT_ESTIMATE_BILLINGSLABS_UNMATCH_replace_id, matchingList.toString()) + unit);
	}

	/**
	 * Usage based exemptions applied on unit.
	 *
	 * The exemption discount will be applied based on the exemption rate of the
	 * usage master types.
	 */
	private BigDecimal getExemption(Unit unit, BigDecimal currentUnitTax, String financialYear,
			Map<String, Map<String, List<Object>>> propertyMasterMap) {

		Map<String, Object> exemption = getExemptionFromUsage(unit, financialYear, propertyMasterMap);
		return mDataService.calculateApplicables(currentUnitTax, exemption);
	}

	/**
	 * Applies discount on Total tax amount OwnerType based on exemptions.
	 */
	private BigDecimal getExemption(Set<OwnerInfo> owners, BigDecimal taxAmt, String financialYear,
			Map<String, Map<String, List<Object>>> propertyMasterMap) {

		Map<String, List<Object>> ownerTypeMap = propertyMasterMap.get(OWNER_TYPE_MASTER);
		BigDecimal userExemption = BigDecimal.ZERO;
		final int userCount = owners.size();
		BigDecimal share = taxAmt.divide(BigDecimal.valueOf(userCount),2, 2);

		for (OwnerInfo owner : owners) {

			if (null == ownerTypeMap.get(owner.getOwnerType()))
				continue;

			Map<String, Object> applicableOwnerType = mDataService.getApplicableMaster(financialYear,
					ownerTypeMap.get(owner.getOwnerType()));

			if (null != applicableOwnerType) {

				BigDecimal currentExemption = mDataService.calculateApplicables(share,
						applicableOwnerType.get(EXEMPTION_FIELD_NAME));

				userExemption = userExemption.add(currentExemption);
			}
		}
		return userExemption;
	}

	/**
	 * Returns the appropriate exemption object from the usage masters
	 *
	 * Search happens from child (usageCategoryDetail) to parent
	 * (usageCategoryMajor)
	 *
	 * if any appropriate match is found in getApplicableMasterFromList, then the
	 * exemption object from that master will be returned
	 *
	 * if no match found(for all the four usages) then null will be returned
	 *
	 * @param unit unit for which usage exemption will be applied
	 * @param financialYear year for which calculation is being done
	 */
	@SuppressWarnings("unchecked")
	private Map<String, Object> getExemptionFromUsage(Unit unit, String financialYear,
			Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap) {

		Map<String, List<Object>> usageDetails = propertyBasedExemptionMasterMap.get(USAGE_DETAIL_MASTER);
		Map<String, List<Object>> usageSubMinors = propertyBasedExemptionMasterMap.get(USAGE_SUB_MINOR_MASTER);
		Map<String, List<Object>> usageMinors = propertyBasedExemptionMasterMap.get(USAGE_MINOR_MASTER);
		Map<String, List<Object>> usageMajors = propertyBasedExemptionMasterMap.get(USAGE_MAJOR_MASTER);

		Map<String, Object> applicableUsageMasterExemption = null;

		if (null != usageDetails.get(unit.getUsageCategoryDetail()))
			applicableUsageMasterExemption = mDataService.getApplicableMaster(financialYear,
					usageDetails.get(unit.getUsageCategoryDetail()));

		if (isExemptionNull(applicableUsageMasterExemption)
				&& null != usageSubMinors.get(unit.getUsageCategorySubMinor()))
			applicableUsageMasterExemption = mDataService.getApplicableMaster(financialYear,
					usageSubMinors.get(unit.getUsageCategorySubMinor()));

		if (isExemptionNull(applicableUsageMasterExemption) && null != usageMinors.get(unit.getUsageCategoryMinor()))
			applicableUsageMasterExemption = mDataService.getApplicableMaster(financialYear,
					usageMinors.get(unit.getUsageCategoryMinor()));

		if (isExemptionNull(applicableUsageMasterExemption) && null != usageMajors.get(unit.getUsageCategoryMajor()))
			applicableUsageMasterExemption = mDataService.getApplicableMaster(financialYear,
					usageMajors.get(unit.getUsageCategoryMajor()));

		if (null != applicableUsageMasterExemption)
			applicableUsageMasterExemption = (Map<String, Object>) applicableUsageMasterExemption.get(EXEMPTION_FIELD_NAME);

		return applicableUsageMasterExemption;
	}

	private boolean isExemptionNull(Map<String, Object> applicableUsageMasterExemption) {

		return !(null != applicableUsageMasterExemption
				&& null != applicableUsageMasterExemption.get(EXEMPTION_FIELD_NAME));
	}
	
	
	public Map<String, Calculation> mutationCalculator(PropertyV2 property, RequestInfo requestInfo) {
		Map<String, Calculation> feeStructure = new HashMap<>();
		Map<String,Object> additionalDetails = mapper.convertValue(property.getAdditionalDetails(),Map.class);
		calcValidator.validatePropertyForMutationCalculation(additionalDetails);
		Calculation calculation = new Calculation();
		calculation.setTenantId(property.getTenantId());
		setTaxperiodForCalculation(requestInfo,property.getTenantId(),calculation);
		BigDecimal fee = getFeeFromSlabs(property, calculation, requestInfo,additionalDetails);
		calculation.setTaxAmount(fee);
		postProcessTheFee(requestInfo,property,calculation,additionalDetails);
		feeStructure.put(property.getAcknowldgementNumber(), calculation);
		searchDemand(requestInfo,property,calculation,feeStructure);

		return feeStructure;
	}

	private void setTaxperiodForCalculation(RequestInfo requestInfo, String tenantId,Calculation calculation){
		List<TaxPeriod> taxPeriodList = getTaxPeriodList(requestInfo,tenantId);
		long currentTime = System.currentTimeMillis();
		for(TaxPeriod taxPeriod : taxPeriodList ){
			if(currentTime >= taxPeriod.getFromDate() && currentTime <=taxPeriod.getToDate()){
				calculation.setFromDate(taxPeriod.getFromDate());
				calculation.setToDate(taxPeriod.getToDate());
			}
		}
		if(calculation.getFromDate() == null || calculation.getToDate() == null)
			throw new CustomException(TAX_PERIOD_SEARCH_FAILED, TAX_PERIOD_SEARCH_FAILED_MSG);

	}

	/**
	 * Fetch Tax Head Masters From billing service
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public List<TaxPeriod> getTaxPeriodList(RequestInfo requestInfo, String tenantId) {

		StringBuilder uri = getTaxPeriodSearchUrl(tenantId);
		TaxPeriodResponse res = mapper.convertValue(
				repository.fetchResult(uri, RequestInfoWrapper.builder().requestInfo(requestInfo).build()),
				TaxPeriodResponse.class);
		return res.getTaxPeriods();
	}

	/**
	 * Fetch Billing Slab for mutation and calculate the mutation fees
	 * @param property
	 * @param calculation
	 * @param requestInfo
	 * @param additionalDetails
	 * @return
	 */
	private BigDecimal getFeeFromSlabs(PropertyV2 property, Calculation calculation, RequestInfo requestInfo,Map<String,Object> additionalDetails) {
		List<String> slabIds = new ArrayList<>();
		BigDecimal fees=null;

		MutationBillingSlabSearchCriteria billingSlabSearchCriteria = new MutationBillingSlabSearchCriteria();
		Double marketValue =Double.parseDouble(String.valueOf(additionalDetails.get(MARKET_VALUE)));
		enrichBillingsalbSearchCriteria(billingSlabSearchCriteria,property,marketValue);
		MutationBillingSlabRes billingSlabRes = mutationService.searchBillingSlabs(requestInfo, billingSlabSearchCriteria);
		if (CollectionUtils.isEmpty(billingSlabRes.getBillingSlab()) || billingSlabRes.getBillingSlab() == null){
			throw new CustomException(BILLING_SLAB_SEARCH_FAILED,BILLING_SLAB_SEARCH_FAILED_MSG);
		}

		if(billingSlabRes.getBillingSlab().get(0).getType().equals(MutationBillingSlab.TypeEnum.FLAT)){
			fees = BigDecimal.valueOf(billingSlabRes.getBillingSlab().get(0).getFixedAmount());
		}
		if(billingSlabRes.getBillingSlab().get(0).getType().equals(MutationBillingSlab.TypeEnum.RATE)){
			BigDecimal rate = BigDecimal.valueOf(billingSlabRes.getBillingSlab().get(0).getRate());
			BigDecimal marketValuefess = BigDecimal.valueOf(billingSlabSearchCriteria.getMarketValue());
			fees= marketValuefess.multiply(rate.divide(CalculatorConstants.HUNDRED));
		}
		slabIds.add(billingSlabRes.getBillingSlab().get(0).getId());
		calculation.setBillingSlabIds(slabIds);


		if(additionalDetails.get(ADHOC_REBATE) != null) {
			int adhocRebate = (int) additionalDetails.get(ADHOC_REBATE);
			fees = fees.subtract(BigDecimal.valueOf(adhocRebate));
		}
		if(additionalDetails.get(ADHOC_PENALTY) != null) {
			int adhocPenalty = (int) additionalDetails.get(ADHOC_PENALTY);
			fees = fees.add(BigDecimal.valueOf(adhocPenalty));
		}
		return fees;
	}

	/**
	 * Calculate the rebate and penalty for mutation
	 * @param requestInfo
	 * @param property
	 * @param calculation
	 * @param additionalDetails
	 */
	private void postProcessTheFee(RequestInfo requestInfo,PropertyV2 property, Calculation calculation,Map<String,Object> additionalDetails) {
		Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap = new HashMap<>();
		Map<String, JSONArray> timeBasedExemptionMasterMap = new HashMap<>();
		mDataService.setPropertyMasterValues(requestInfo, property.getTenantId(), propertyBasedExemptionMasterMap,
				timeBasedExemptionMasterMap);

		Long docDate =  Long.valueOf(String.valueOf(additionalDetails.get(DOCUMENT_DATE)));
		BigDecimal taxAmt = calculation.getTaxAmount();
		BigDecimal rebate = getRebate(taxAmt, timeBasedExemptionMasterMap.get(CalculatorConstants.REBATE_MASTER), docDate);
		BigDecimal penalty = BigDecimal.ZERO;
		if (rebate.equals(BigDecimal.ZERO)) {
			penalty = getPenalty(taxAmt,timeBasedExemptionMasterMap.get(CalculatorConstants.PENANLTY_MASTER),docDate);
		}

		calculation.setRebate(rebate.setScale(2, 2).negate());
		calculation.setPenalty(penalty.setScale(2, 2));
		calculation.setExemption(BigDecimal.ZERO);

		
		BigDecimal totalAmount = calculation.getTaxAmount()
				.add(calculation.getRebate().add(calculation.getExemption())).add(calculation.getPenalty());
		calculation.setTotalAmount(totalAmount);
	}


	/**
	 * Search Demand for the property mutation based on acknowledgeNumber
	 * @param requestInfo
	 * @param property
	 * @param calculation
	 * @param feeStructure
	 */
	private void searchDemand(RequestInfo requestInfo,PropertyV2 property,Calculation calculation,Map<String, Calculation> feeStructure){
		String url = new StringBuilder().append(configs.getBillingServiceHost())
				.append(configs.getDemandSearchEndPoint()).append(URL_PARAMS_SEPARATER)
				.append(TENANT_ID_FIELD_FOR_SEARCH_URL).append(property.getTenantId())
				.append(SEPARATER).append(BUSINESSSERVICE_FIELD_FOR_SEARCH_URL).append(configs.getPtMutationBusinessCode())
				.append(SEPARATER).append(CONSUMER_CODE_SEARCH_FIELD_NAME).append(property.getAcknowldgementNumber()).toString();
		DemandResponse res = new DemandResponse();
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		res = restTemplate.postForObject(url, requestInfoWrapper, DemandResponse.class);
		if(CollectionUtils.isEmpty(res.getDemands()) || res.getDemands() == null)
			generateDemandsFroMutationFee(property, feeStructure, requestInfo);
		else
			updateDemand(property,requestInfo,res,calculation);

	}

	/**
	 * Update Demand for the property mutation
	 * @param requestInfo
	 * @param response
	 * @param calculation
	 */
	private void updateDemand(PropertyV2 property,RequestInfo requestInfo,DemandResponse response,Calculation calculation){
		List<Demand> demands = response.getDemands();
		User payer=null;
		for(int i = 0; i < demands.size(); i++ ){
			demands.get(i).setTaxPeriodFrom(calculation.getFromDate());
			demands.get(i).setTaxPeriodTo(calculation.getToDate());
			if(demands.get(i).getPayer() == null){
				OwnerInfo owner = getActiveOwner(property.getOwners());
				payer = utils.getCommonContractUser(owner);
				demands.get(i).setPayer(payer);
			}

			List<DemandDetail> demandDetails = demands.get(i).getDemandDetails();
			for(int j =0;j<demandDetails.size();j++){
				if(demandDetails.get(j).getTaxHeadMasterCode() == configs.getPtMutationFeeTaxHead())
					demands.get(i).getDemandDetails().get(j).setTaxAmount(calculation.getTaxAmount());

				if(demandDetails.get(j).getTaxHeadMasterCode() == configs.getPtMutationPenaltyTaxHead())
					demands.get(i).getDemandDetails().get(j).setTaxAmount(calculation.getPenalty());

				if(demandDetails.get(j).getTaxHeadMasterCode() == configs.getPtMutationRebateTaxHead())
					demands.get(i).getDemandDetails().get(j).setTaxAmount(calculation.getRebate());
			}
		}
		DemandRequest dmReq = new DemandRequest();
		dmReq.setRequestInfo(requestInfo);
		dmReq.setDemands(demands);
		String url = new StringBuilder().append(configs.getBillingServiceHost())
				.append(configs.getDemandUpdateEndPoint()).toString();
		try {
			restTemplate.postForObject(url, dmReq, Map.class);
		} catch (Exception e) {
			log.error("Demand updation failed: ", e);
			throw new CustomException(DEMAND_UPDATE_FAILED, DEMAND_UPDATE_FAILED_MSG);
		}

	}

	/**
	 * Generate Demand for the property mutation
	 * @param feeStructure
	 * @param requestInfo
	 */
	private void generateDemandsFroMutationFee(PropertyV2 property, Map<String, Calculation> feeStructure, RequestInfo requestInfo) {
		List<Demand> demands = new ArrayList<>();
		for(String key: feeStructure.keySet()) {
			List<DemandDetail> details = new ArrayList<>();
			Calculation calculation = feeStructure.get(key);
			DemandDetail detail = DemandDetail.builder().collectionAmount(BigDecimal.ZERO).demandId(null).id(null).taxAmount(calculation.getTaxAmount()).auditDetails(null)
					.taxHeadMasterCode(configs.getPtMutationFeeTaxHead()).tenantId(calculation.getTenantId()).build();
			details.add(detail);
			if(null != calculation.getPenalty()){
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(BigDecimal.ZERO).demandId(null).id(null).taxAmount(calculation.getPenalty()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationPenaltyTaxHead()).tenantId(calculation.getTenantId()).build();
				details.add(demandDetail);
			}
			if(null != feeStructure.get(key).getRebate()){
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(BigDecimal.ZERO).demandId(null).id(null).taxAmount(calculation.getRebate()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationRebateTaxHead()).tenantId(calculation.getTenantId()).build();
				details.add(demandDetail);
			}
			if(null != feeStructure.get(key).getExemption() && BigDecimal.ZERO != feeStructure.get(key).getExemption()){
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(BigDecimal.ZERO).demandId(null).id(null).taxAmount(calculation.getExemption()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationExemptionTaxHead()).tenantId(calculation.getTenantId()).build();
				details.add(demandDetail);
			}
			OwnerInfo owner = getActiveOwner(property.getOwners());
			User payer = utils.getCommonContractUser(owner);

			Demand demand = Demand.builder().auditDetails(null).additionalDetails(null).businessService(configs.getPtMutationBusinessCode())
					.consumerCode(key).consumerType(" ").demandDetails(details).id(null).minimumAmountPayable(configs.getPtMutationMinPayable()).payer(payer).status(null)
					.taxPeriodFrom(calculation.getFromDate()).taxPeriodTo(calculation.getToDate()).tenantId(calculation.getTenantId()).build();
			demands.add(demand);
			
		}
		
		DemandRequest dmReq = DemandRequest.builder().demands(demands).requestInfo(requestInfo).build();
		DemandResponse res = new DemandResponse();
		String url = new StringBuilder().append(configs.getBillingServiceHost())
				.append(configs.getDemandCreateEndPoint()).toString();
		try {
			restTemplate.postForObject(url, dmReq, Map.class);
		} catch (Exception e) {
			log.error("Demand creation failed: ", e);
			throw new CustomException(DEMAND_CREATE_FAILED, DEMAND_CREATE_FAILED_MSG);

		}
		
		
		
	}

	/**
	 * Returns the tax head search Url with tenantId and PropertyTax service name
	 * parameters
	 *
	 * @param tenantId
	 * @return
	 */
	public StringBuilder getTaxPeriodSearchUrl(String tenantId) {

		return new StringBuilder().append(configs.getBillingServiceHost())
				.append(configs.getTaxPeriodSearchEndpoint()).append(URL_PARAMS_SEPARATER)
				.append(TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(SEPARATER).append(SERVICE_FIELD_FOR_SEARCH_URL)
				.append(SERVICE_FIELD_VALUE_PT_MUTATION);
	}

	/**
	 * Returns the Amount of rebate that has to be applied on the given tax amount for the given period
	 * @param taxAmt
	 * @param rebateMasterList
	 * @param docDate
	 *
	 * @return
	 */

	public BigDecimal getRebate(BigDecimal taxAmt, JSONArray rebateMasterList, Long docDate) {

		BigDecimal rebateAmt = BigDecimal.ZERO;
		Map<String, Object> rebate = getApplicableMaster(rebateMasterList);

		if (null == rebate) return rebateAmt;
		Integer mutationPaymentPeriodInMonth = Integer.parseInt(String.valueOf(rebate.get(MUTATION_PAYMENT_PERIOD_IN_MONTH)));
		Long deadlineDate = getDeadlineDate(docDate,mutationPaymentPeriodInMonth);

		if (deadlineDate > System.currentTimeMillis())
			rebateAmt = mDataService.calculateApplicables(taxAmt, rebate);
		return rebateAmt;
	}

	/**
	 * Returns the Amount of penalty that has to be applied on the given tax amount for the given period
	 *
	 * @param taxAmt
	 * @param penaltyMasterList
	 * @param docDate
	 * @return
	 */
	public BigDecimal getPenalty(BigDecimal taxAmt, JSONArray penaltyMasterList, Long docDate) {

		BigDecimal penaltyAmt = BigDecimal.ZERO;
		Map<String, Object> penalty = getApplicableMaster(penaltyMasterList);

		if (null == penalty) return penaltyAmt;
		Integer mutationPaymentPeriodInMonth = Integer.parseInt(String.valueOf(penalty.get(MUTATION_PAYMENT_PERIOD_IN_MONTH)));
		Long deadlineDate = getDeadlineDate(docDate,mutationPaymentPeriodInMonth);

		if (deadlineDate < System.currentTimeMillis())
			penaltyAmt = mDataService.calculateApplicables(taxAmt, penalty);

		return penaltyAmt;
	}
	/**
	 * Returns the rebate/penalty object from mdms that has to be applied on the given tax amount for the given period
	 *
	 * @param masterList
	 * @return
	 */

	public Map<String, Object> getApplicableMaster(List<Object> masterList) {

		Map<String, Object> objToBeReturned = null;

		for (Object object : masterList) {

			Map<String, Object> objMap = (Map<String, Object>) object;
			String objFinYear = ((String) objMap.get(CalculatorConstants.FROMFY_FIELD_NAME)).split("-")[0];
			String dateFiledName = null;
			if(!objMap.containsKey(CalculatorConstants.STARTING_DATE_APPLICABLES)){
				dateFiledName = CalculatorConstants.ENDING_DATE_APPLICABLES;
			}
			else
				dateFiledName = CalculatorConstants.STARTING_DATE_APPLICABLES;

			String[] time = ((String) objMap.get(dateFiledName)).split("/");
			Calendar cal = Calendar.getInstance();
			Long startDate = setDateToCalendar(objFinYear, time, cal,0);
			Long endDate = setDateToCalendar(objFinYear, time, cal,1);
			if(System.currentTimeMillis()>=startDate && System.currentTimeMillis()<=endDate )
				objToBeReturned = objMap;

		}

		return objToBeReturned;
	}

	/**
	 * Returns the payment deadline date for the property mutation
	 *
	 * @param docdate
	 * @param mutationPaymentPeriodInMonth
	 *
	 * @return
	 */
	private Long getDeadlineDate(Long docdate,Integer mutationPaymentPeriodInMonth){
		Long deadlineDate = null;
		Long timeStamp= docdate / 1000L;
		java.util.Date time=new java.util.Date((Long)timeStamp*1000);
		Calendar cal = Calendar.getInstance();
		cal.setTime(time);
		Integer day = cal.get(Calendar.DAY_OF_MONTH);
		Integer month = cal.get(Calendar.MONTH);
		Integer year = cal.get(Calendar.YEAR);

		month = month + mutationPaymentPeriodInMonth;
		if(month>12){
			month = month - 12;
			year = year + 1;
		}
		cal.clear();
		cal.set(year, month, day);
		deadlineDate = cal.getTimeInMillis();
		return  deadlineDate;
	}

	/**
	 * Sets the date in to calendar based on the month and date value present in the time array
	 *  @param assessmentYear
	 * @param time
	 * @param cal
	 * @return
	 */
	private Long setDateToCalendar(String assessmentYear, String[] time, Calendar cal,int flag) {

		cal.clear();
		Long date = null;
		Integer day = Integer.valueOf(time[0]);
		Integer month = Integer.valueOf(time[1])-1;
		Integer year = Integer.valueOf(assessmentYear);
		if(flag==1)
			year=year+1;
		cal.set(year, month, day);
		date = cal.getTimeInMillis();

		return date;
	}

	/**
	 * Sets the search criteria for mutation billing slab
	 *  @param billingSlabSearchCriteria
	 * @param property
	 * @param marketValue
	 * @return
	 */

	private void enrichBillingsalbSearchCriteria(MutationBillingSlabSearchCriteria billingSlabSearchCriteria, PropertyV2 property,Double marketValue ){

		billingSlabSearchCriteria.setTenantId(property.getTenantId());
		billingSlabSearchCriteria.setMarketValue(marketValue);

		String[] usageCategoryMasterData = property.getUsageCategory().split("\\.");
		String usageCategoryMajor = null,usageCategoryMinor = null;
		usageCategoryMajor = usageCategoryMasterData[0];
		if(usageCategoryMasterData.length > 1)
			usageCategoryMinor = usageCategoryMasterData[1];

		if(usageCategoryMajor != null)
			billingSlabSearchCriteria.setUsageCategoryMajor(usageCategoryMajor);
		if(usageCategoryMinor != null)
			billingSlabSearchCriteria.setUsageCategoryMinor(usageCategoryMinor);

		String[] propertyTypeCollection = property.getPropertyType().split("\\.");
		String propertyType = null,propertySubType = null;
		propertyType = propertyTypeCollection[0];
		if(propertyTypeCollection.length > 1)
			propertySubType = propertyTypeCollection[1];

		if(propertyType != null)
			billingSlabSearchCriteria.setPropertyType(propertyType);
		if(propertySubType != null)
			billingSlabSearchCriteria.setPropertySubType(propertySubType);

		String[] ownership = property.getOwnershipCategory().split("\\.");
		String ownershipCategory = null,subownershipCategory = null;
		ownershipCategory = ownership[0];
		if(ownership.length > 1)
			subownershipCategory = ownership[1];

		if(ownershipCategory != null)
			billingSlabSearchCriteria.setOwnerShipCategory(ownershipCategory);
		if(subownershipCategory != null)
			billingSlabSearchCriteria.setSubOwnerShipCategory(subownershipCategory);

	}

	private OwnerInfo getActiveOwner(List<OwnerInfo> ownerlist){
		OwnerInfo ownerInfo = new OwnerInfo();
		String status ;
		for(OwnerInfo owner : ownerlist){
			status = String.valueOf(owner.getStatus());
			if(status.equals(OWNER_STATUS_ACTIVE)){
				ownerInfo=owner;
				return ownerInfo;
			}
		}
		return ownerInfo;
	}


}
