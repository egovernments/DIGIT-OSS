package org.egov.pt.calculator.service;

import java.math.BigDecimal;
import java.text.MessageFormat;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
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
	private PayService payService;

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
	private CalculatorUtils utils;
	
	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private PaymentService paymentService;

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
	public Map<String, Calculation> getEstimationPropertyMap(CalculationReq request, Map<String, Object> masterMap) {

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
	private Map<String, List> getEstimationMap(CalculationCriteria criteria, RequestInfo requestInfo,
			Map<String, Object> masterMap) {

		BigDecimal exemption = BigDecimal.ZERO;
		Property property = criteria.getProperty();
		List<BillingSlab> filteredBillingSlabs = getSlabsFiltered(property, requestInfo);
		Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap = new HashMap<>();
		Map<String, JSONArray> timeBasedExemptionMasterMap = new HashMap<>();
		mDataService.setPropertyMasterValues(requestInfo, criteria.getTenantId(), propertyBasedExemptionMasterMap,
				timeBasedExemptionMasterMap);

		if (CollectionUtils.isEmpty(filteredBillingSlabs)) {
			throw new CustomException(BILLING_SLAB_MATCH_ERROR_CODE, BILLING_SLAB_MATCH_ERROR_PROPERTY_MESSAGE);
		}

		TaxHeadEstimate ptTaxHead = getPropertyTaxhead(property, filteredBillingSlabs, masterMap, exemption);

		List<TaxHeadEstimate> estimates = new ArrayList<TaxHeadEstimate>();
		estimates.add(ptTaxHead);
		estimates.add(getLatePenaltyTaxhead(ptTaxHead.getEstimateAmount(), masterMap));//, criteria.getAssessmentYear()));
		estimates.add(getLateAssessmentPenaltyTaxhead(property));
		estimates.add(getAdHocPenaltyTaxhead(property));
		//TODO decide on how to get check user is paying in full
		estimates.add(getRebateTaxhead(ptTaxHead.getEstimateAmount(), masterMap, true));
		estimates.add(getAdHocRebateTaxhead(property));
		estimates.add(getUsageExemptionTaxhead(exemption));

		log.info("estimates", estimates);
		Map<String, List> estimatesAndBillingSlabs = new HashMap<>();
		estimatesAndBillingSlabs.put("estimates", estimates);
		estimatesAndBillingSlabs.put("billingSlabIds",
				filteredBillingSlabs.stream().map(slab -> slab.getId()).collect(Collectors.toList()));

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
		return BigDecimal.ONE;
        // BigDecimal unBuiltAmt = BigDecimal.ZERO;
        // if (0.0 < unBuiltRate && null != detail.getLandArea() && groundUnitsCount > 0) {

        //     double diffArea = null != detail.getBuildUpArea() ? detail.getLandArea().subtract(detail.getBuildUpArea())
        //             : detail.getLandArea() - groundUnitsArea;
        //     // ignoring if land Area is lesser than buildUpArea/groundUnitsAreaSum in estimate instead of throwing error
        //     // since property service validates the same for calculation
        //     diffArea = diffArea < 0.0 ? 0.0 : diffArea;
        //     unBuiltAmt = unBuiltAmt.add(BigDecimal.valueOf((unBuiltRate / groundUnitsCount) * (diffArea)));
        // }
		// 	return unBuiltAmt;
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

			BigDecimal multiplier = BigDecimal.ZERO;
			// if (null != slab.getArvPercent())
			// 	multiplier = BigDecimal.valueOf(slab.getArvPercent() / 100);
			// else
			// 	multiplier = BigDecimal.valueOf(configs.getArvPercent() / 100);
			currentUnitTax = unit.getArv().multiply(multiplier);
		} else {
			currentUnitTax = unit.getUnitArea().multiply(BigDecimal.valueOf(slab.getUnitRate()));
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
	 */
	private List<TaxHeadEstimate> getEstimatesForTax(RequestInfo requestInfo,BigDecimal taxAmt, BigDecimal usageExemption, Property property,
			Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap,
			Map<String, JSONArray> timeBasedExemeptionMasterMap,Map<String, Object> masterMap) {


		BigDecimal payableTax = taxAmt;
		List<TaxHeadEstimate> estimates = new ArrayList<>();

		PropertyDetail detail = property.getPropertyDetails().get(0);
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
		// Map<String, BigDecimal> rebatePenaltyMap = payService.applyPenaltyRebateAndInterest(payableTax, BigDecimal.ZERO,
		// 		 assessmentYear, timeBasedExemeptionMasterMap,payments,taxPeriod);


		// if (null != rebatePenaltyMap) {

		// 	BigDecimal rebate = rebatePenaltyMap.get(PT_TIME_REBATE);
		// 	BigDecimal penalty = rebatePenaltyMap.get(PT_TIME_PENALTY);
		// 	BigDecimal interest = rebatePenaltyMap.get(PT_TIME_INTEREST);
		// 	estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_TIME_REBATE).estimateAmount(rebate).build());
		// 	estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_TIME_PENALTY).estimateAmount(penalty).build());
		// 	estimates.add(TaxHeadEstimate.builder().taxHeadCode(PT_TIME_INTEREST).estimateAmount(interest).build());
		// 	payableTax = payableTax.add(rebate).add(penalty).add(interest);
		// }

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


	private TaxHeadEstimate getRebateTaxhead(BigDecimal propertyTax, Map<String, Object> masterMap,
			boolean payingFull) {

		BigDecimal rebate = BigDecimal.ZERO;
		BigDecimal rebateRate = getRebateRate(masterMap);

		if (payingFull) {
			rebate = propertyTax.multiply(rebateRate).divide(HUNDRED);
		}

		return TaxHeadEstimate.builder().taxHeadCode(PT_TIME_REBATE).estimateAmount(rebate).build();

	}

	private TaxHeadEstimate getUsageExemptionTaxhead(BigDecimal exemption) {

		return TaxHeadEstimate.builder().taxHeadCode(PT_USAGE_EXEMPTION).estimateAmount(exemption).build();
	}

	private TaxHeadEstimate getAdHocRebateTaxhead(Property property) {
		Map details = (Map) property.getPropertyDetails().get(0).getAdditionalDetails();
		BigDecimal amount = BigDecimal.valueOf((double) details.get(AD_HOC_REBATE_JSON_STRING));
		return TaxHeadEstimate.builder().taxHeadCode(PT_ADHOC_REBATE).estimateAmount(amount).build();

	}

	/**
	 *  calclate penalty based on current date, assessment year, penalty rates
	 * 
	 * @param bigDecimal
	 * @param masterMap
	 * @return
	 */
	private TaxHeadEstimate getLatePenaltyTaxhead(BigDecimal propertyTax, Map<String, Object> masterMap){
			//String assessmentYear) {

		BigDecimal penalty = BigDecimal.ZERO;
		BigDecimal penaltyRate = getPenaltyRate(masterMap);
		// 26-12 TODO: add todate and fromdat instead of assessment year.
		int fromYear = Year.now().getValue()+1; //Integer.parseInt(assessmentYear.split("-")[0]) + 1;
		int toYear = Year.now().getValue();
		int years = fromYear - toYear;

		penalty = propertyTax.multiply(penaltyRate).divide(HUNDRED).multiply(BigDecimal.valueOf(years));

		return TaxHeadEstimate.builder().taxHeadCode(PT_TIME_PENALTY).estimateAmount(penalty).build();
	}

	/**
	 * 
	 * @param property
	 * @return
	 */
	private TaxHeadEstimate getAdHocPenaltyTaxhead(Property property) {
		return TaxHeadEstimate.builder().taxHeadCode(PT_ADHOC_PENALTY)
				.estimateAmount(property.getPropertyDetails().get(0).getAdhocPenalty()).build();
	}

	private TaxHeadEstimate getLateAssessmentPenaltyTaxhead(Property property) {
		Map details = (Map) property.getPropertyDetails().get(0).getAdditionalDetails();
		BigDecimal amount = BigDecimal.valueOf((double) details.get(ONE_TIME_PENALTY_JSON_STRING));
		return TaxHeadEstimate.builder().taxHeadCode(PT_LATE_ASSESSMENT_PENALTY).estimateAmount(amount).build();
	}



	private TaxHeadEstimate getPropertyTaxhead(Property property, List<BillingSlab> filteredBillingSlabs,
			Map<String, Object> masterMap, BigDecimal exemption) {

		List<BillingSlab> usedSlabs = new ArrayList<BillingSlab>();
		List<Unit> units = property.getPropertyDetails().get(0).getUnits();
		PropertyDetail propertyDetail = property.getPropertyDetails().get(0);
		BigDecimal monthMultiplier = BigDecimal.valueOf(12);
		// only one billing slab
		// vacant Land AV = Carpet Area * residential unit rate * multiplier factor *12
		if (propertyDetail.getPropertyType().equalsIgnoreCase(PT_TYPE_VACANT_LAND)) {
			if (filteredBillingSlabs.size() != 1) {
				throw new CustomException(PT_ESTIMATE_BILLINGSLABS_UNMATCH_VACANCT,
						MessageFormat.format(PT_ESTIMATE_BILLINGSLABS_UNMATCH_VACANT_MSG, filteredBillingSlabs.size()));
			}

			BigDecimal carpetArea = propertyDetail.getLandArea();
			BigDecimal unitRate = BigDecimal.valueOf(filteredBillingSlabs.get(0).getUnitRate());
			Unit unit = propertyDetail.getUnits().get(0);
			BigDecimal taxRate = getTaxRate(masterMap, unit);
			BigDecimal multipleFactor = getMultipleFactor(masterMap, unit);
			BigDecimal landAV = carpetArea.multiply(unitRate).multiply(multipleFactor).multiply(monthMultiplier);
			BigDecimal taxAmount = landAV.multiply(taxRate).divide(HUNDRED);

			return TaxHeadEstimate.builder().taxHeadCode(PT_TAX).estimateAmount(taxAmount).build();

		}

		// builtup AV = unitArea * unit rate * multiplier factor *12
		if (propertyDetail.getPropertyType().equalsIgnoreCase(BUILTUP)) {

			BigDecimal taxAmount = BigDecimal.ZERO;
			int unoccupiedLandCount = 0;
			BigDecimal unoccupiedLandTaxAmount = BigDecimal.ZERO;
			for (Unit unit : units) {
				BigDecimal unitTaxAmount = BigDecimal.ZERO;
				Optional<BillingSlab> billingSlab = filteredBillingSlabs.stream()
						.filter(slab -> slab.getConstructionType().equalsIgnoreCase(unit.getConstructionType()))
						.findFirst();
				if (billingSlab.isPresent()) {
					usedSlabs.add(billingSlab.get());
					if (unit.getUsageCategoryMajor().equals(NONRESIDENTIAL)) {
						BigDecimal carpetArea = unit.getUnitArea();
						BigDecimal unitRate = BigDecimal.valueOf(filteredBillingSlabs.get(0).getUnitRate());
						BigDecimal taxRate = getTaxRate(masterMap, unit);
						BigDecimal multipleFactor = getMultipleFactor(masterMap, unit);

						BigDecimal landAV = carpetArea.multiply(multipleFactor).multiply(monthMultiplier);
						unitTaxAmount = landAV.multiply(taxRate);

						if (unoccupiedLandCount == 0) {
							BigDecimal unoccupiedLandArea = propertyDetail.getLandArea();
							BigDecimal unoccupiedLandAV = unoccupiedLandArea.multiply(unitRate).multiply(multipleFactor)
									.multiply(monthMultiplier);
							unoccupiedLandTaxAmount = unoccupiedLandAV.multiply(taxRate);
							unoccupiedLandCount = unoccupiedLandCount + 1;
						}

					} else if (unit.getUsageCategoryMajor().equals(RESIDENTIAL)) {
						UnitAdditionalDetails unitAdtlDetails = unit.getAdditionalDetails();
						BigDecimal carpetArea = BigDecimal.ZERO;
						if (unitAdtlDetails.isInnerDimensionsKnown()) {
							BigDecimal bathroomArea = unitAdtlDetails.getBathroomArea()
									.multiply(BATHROOM_AREA_MULTIPLIER);
							BigDecimal commonArea = unitAdtlDetails.getCommonArea().multiply(COMMON_AREA_MULTIPLIER);
							BigDecimal garageArea = unitAdtlDetails.getGarageArea().multiply(GARAGE_AREA_MULTIPLIER);
							BigDecimal roomsArea = unitAdtlDetails.getRoomsArea().multiply(ROOMS_AREA_MULTIPLIER);
							carpetArea = bathroomArea.add(commonArea).add(garageArea).add(roomsArea);
						} else {
							carpetArea = unit.getUnitArea().multiply(COVERED_AREA_MULTIPLIER);
						}

						BigDecimal unitRate = BigDecimal.valueOf(filteredBillingSlabs.get(0).getUnitRate());
						BigDecimal taxRate = getTaxRate(masterMap, unit);
						BigDecimal exemptionRate = getExemptionRate(masterMap, unit);
						//26-12 TODO: add todate and fromdat instead of assessment year.
						BigDecimal appreciationDepreciation = getAppreciationDepreciation(masterMap, unit);
						BigDecimal appreDepreAmount = carpetArea.multiply(unitRate).multiply(appreciationDepreciation)
								.multiply(monthMultiplier);
						BigDecimal landAV = carpetArea.multiply(unitRate).multiply(appreciationDepreciation)
								.multiply(monthMultiplier);

						if (unit.getOccupancyType().equals(RENTED)) {
							landAV = landAV.add(appreDepreAmount);
						} else {
							landAV = landAV.subtract(appreDepreAmount);
						}

						unitTaxAmount = landAV.multiply(taxRate);
						exemption = exemption.add(unitTaxAmount.multiply(exemptionRate).divide(HUNDRED));
					}

				} else {
					throw new CustomException(BILLING_SLAB_MATCH_ERROR_CODE,
							MessageFormat.format(BILLING_SLAB_MATCH_ERROR_MESSAGE, unit.getConstructionType()));
				}

				taxAmount = taxAmount.add(unitTaxAmount).add(unoccupiedLandTaxAmount);
			}

			return TaxHeadEstimate.builder().taxHeadCode(PT_TAX).estimateAmount(taxAmount).build();

		}

		return null;
	}

	private BigDecimal getAppreciationDepreciation(Map<String, Object> masterMap, Unit unit) {
			//String assessmentYear) {
				return BigDecimal.ONE;
		// // TODO check below
		// int fromYear = Integer.parseInt(unit.getConstructionYear());
		// int toYear = Integer.parseInt(assessmentYear.split("-")[0]);
		// int age = toYear - fromYear;

		// List<DepreciationAppreciation> filtered = new ArrayList<>();
		// for (Object val : masterMap.get(DEPRECIATION_APPRECIATION)) {
		// 	DepreciationAppreciation castedVal = (DepreciationAppreciation) val;

		// 	if (castedVal.getAgeOfBuilding().getYearFrom() <= age
		// 			&& age <= castedVal.getAgeOfBuilding().getYearFrom()) {
		// 		filtered.add(castedVal);
		// 	}
		// }

		// if (filtered.size() == 1) {
		// 	return filtered.get(0).getDepreciationAppreciation();
		// }
		// return null;

	}


	private BigDecimal getMultipleFactor(Map<String, Object> masterMap, Unit unit) {
		return BigDecimal.ONE;
		// for (Object val : masterMap.get(USAGE_SUB_MINOR_MASTER)) {
		// 	if (castedVal.getCode().equalsIgnoreCase(unit.getUsageCategorySubMinor())) {
		// 		filtered.add(castedVal);
		// 	}
		// }

		// if (filtered.size() == 1) {
		// 	return filtered.get(0).getARVFactor();
		// }
		// return null;
	}

	private BigDecimal getExemptionRate(Map<String, Object> masterMap, Unit unit) {
		return BigDecimal.ONE;
		// List<UsageCategorySubMinor> filtered = new ArrayList<>();
		// for (Object val : masterMap.get(USAGE_SUB_MINOR_MASTER)) {
		// 	UsageCategorySubMinor castedVal = (UsageCategorySubMinor) val;

		// 	if (castedVal.getCode().equalsIgnoreCase(unit.getUsageCategorySubMinor())) {
		// 		filtered.add(castedVal);
		// 	}
		// }

		// if (filtered.size() == 1) {
		// 	return filtered.get(0).getExemption().getRate();
		// }
		// return null;
	}

	private BigDecimal getPenaltyRate(Map<String, Object> masterMap) {
		return BigDecimal.ONE;
		// for (Object val : masterMap.get(PENALTY_INTREST_RATE)) {
		// 	Rate castedVal = (Rate) val;
		// 	// TODO : todate not metioned discuss and update it.
		// 	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		// 	LocalDate startDate = LocalDate.parse(castedVal.getStartingDay(), formatter);
		// 	LocalDate currentDate = LocalDate.now();
		// 	if (startDate.isBefore(currentDate)) {
		// 		return castedVal.getRate();
		// 	}
		// }

		// return null;
	}

	private BigDecimal getTaxRate(Map<String, Object> masterMap, Unit unit) {
		return BigDecimal.ONE;
		// List<Rate> filtered = new ArrayList<>();

		// if (unit.getUsageCategoryMajor().equalsIgnoreCase("RESIDENTIAL")) {

		// 	for (Object val : masterMap.get(TAX_RATE)) {
		// 		Rate castedVal = (Rate) val;
		// 		// TODO check below
		// 		if (castedVal.getTaxhead().equalsIgnoreCase("General Tax (Residential)")) {
		// 			filtered.add(castedVal);
		// 		}
		// 	}

		// 	if (filtered.size() == 1) {
		// 		return filtered.get(0).getRate();
		// 	}
		// } else {
		// 	for (Object val : masterMap.get(TAX_RATE)) {
		// 		Rate castedVal = (Rate) val;
		// 		if (castedVal.getTaxhead().equalsIgnoreCase("General Tax (Non-residential)")) {
		// 			filtered.add(castedVal);
		// 		}
		// 	}

		// 	if (filtered.size() == 1) {
		// 		return filtered.get(0).getRate();
		// 	}
		// }
		// return null;
	}

	private BigDecimal getRebateRate(Map<String, Object> masterMap) {
		return BigDecimal.ONE;
		// for (Object val : masterMap.get(REBATE_MASTER)) {
		// 	Rate castedVal = (Rate) val;
		// 	// TODO : todate not metioned discuss and update it.
		// 	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		// 	LocalDate startDate = LocalDate.parse(castedVal.getStartingDay(), formatter);
		// 	LocalDate currentDate = LocalDate.now();
		// 	if (startDate.isBefore(currentDate)) {
		// 		return castedVal.getRate();
		// 	}
		// }

		// return null;
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
	private Calculation getCalculation(RequestInfo requestInfo, CalculationCriteria criteria,
			Map<String, Object> masterMap) {
		Map<String, List> estimatesAndBillingSlabs = getEstimationMap(criteria, requestInfo, masterMap);
		List<TaxHeadEstimate> estimates = estimatesAndBillingSlabs.get("estimates");
		List<String> billingSlabIds = estimatesAndBillingSlabs.get("billingSlabIds");

		Property property = criteria.getProperty();
		PropertyDetail detail = property.getPropertyDetails().get(0);
		String assessmentYear = detail.getFinancialYear();
		String assessmentNumber = null != detail.getAssessmentNumber() ? detail.getAssessmentNumber()
				: criteria.getAssessmentNumber();
		String tenantId = null != property.getTenantId() ? property.getTenantId() : criteria.getTenantId();

		Map<String, Map<String, Object>> financialYearMaster = (Map<String, Map<String, Object>>) masterMap
				.get(FINANCIALYEAR_MASTER_KEY);

		Map<String, Object> finYearMap = financialYearMaster.get(assessmentYear);
		Long fromDate = (Long) finYearMap.get(FINANCIAL_YEAR_STARTING_DATE);
		Long toDate = (Long) finYearMap.get(FINANCIAL_YEAR_ENDING_DATE);
		Map<String, Category> taxHeadCategoryMap = ((List<TaxHeadMaster>)masterMap.get(TAXHEADMASTER_MASTER_KEY))
				.stream().collect(Collectors.toMap(TaxHeadMaster::getCode, TaxHeadMaster::getCategory));

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
				if (estimate.getTaxHeadCode().equalsIgnoreCase(PT_TAX))
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
			if (decimalEstimate.getEstimateAmount().compareTo(BigDecimal.ZERO) >= 0)
				taxAmt = taxAmt.add(decimalEstimate.getEstimateAmount());
			else
				rebate = rebate.add(decimalEstimate.getEstimateAmount());
		}

		BigDecimal totalAmount = taxAmt.add(penalty).subtract(rebate).subtract(exemption);
		// false in the argument represents that the demand shouldn't be updated from
		// this call

		return Calculation.builder().totalAmount(totalAmount).taxAmount(taxAmt).penalty(penalty).exemption(exemption)
				.rebate(rebate).fromDate(fromDate).toDate(toDate).tenantId(tenantId).serviceNumber(assessmentNumber)
				.taxHeadEstimates(estimates).billingSlabIds(billingSlabIds).build();
	}

	/**
	 * method to do a first level filtering on the slabs based on the values present in Property detail
	 */
	private List<BillingSlab> getSlabsFiltered(Property property, RequestInfo requestInfo) {
		PropertyDetail detail = property.getPropertyDetails().get(0);
		String tenantId = property.getTenantId();
		LinkedHashMap additionalDetails = (LinkedHashMap) detail.getAdditionalDetails();
		String roadType = (String) additionalDetails.get(ROAD_TYPE_JSON_STRING);
		// TODO ward
		BillingSlabSearchCriteria slabSearchCriteria = BillingSlabSearchCriteria.builder().tenantId(tenantId).ward("")
				.propertyType(detail.getPropertyType()).roadType(roadType)
				.mohalla(property.getAddress().getLocality().getArea()).build();

		List<BillingSlab> billingSlabs = billingSlabService.searchBillingSlabs(requestInfo, slabSearchCriteria)
				.getBillingSlab();
		return billingSlabs;

	}

	/**
	 * Second level filtering to get the matching billing slab for the respective unit
	 * will return only one slab per unit.
	 *
	 * @param billingSlabs slabs filtered with property detail related values
	 * @param unit unit of the property for which the tax has be calculated
	 */
	// private BillingSlab getSlabForCalc(List<BillingSlab> billingSlabs, Unit unit) {

	// 	final String all = configs.getSlabValueAll();

	// 	List<BillingSlab> matchingList = new ArrayList<>();

	// 	for (BillingSlab billSlb : billingSlabs) {

	// 		Double floorNo = Double.parseDouble(unit.getFloorNo());

	// 		boolean isMajorMatching = billSlb.getUsageCategoryMajor().equalsIgnoreCase(unit.getUsageCategoryMajor())
	// 				|| (billSlb.getUsageCategoryMajor().equalsIgnoreCase(all));

	// 		boolean isMinorMatching = billSlb.getUsageCategoryMinor().equalsIgnoreCase(unit.getUsageCategoryMinor())
	// 				|| (billSlb.getUsageCategoryMinor().equalsIgnoreCase(all));

	// 		boolean isSubMinorMatching = billSlb.getUsageCategorySubMinor().equalsIgnoreCase(
	// 				unit.getUsageCategorySubMinor()) || (billSlb.getUsageCategorySubMinor().equalsIgnoreCase(all));

	// 		boolean isDetailsMatching = billSlb.getUsageCategoryDetail().equalsIgnoreCase(unit.getUsageCategoryDetail())
	// 				|| (billSlb.getUsageCategoryDetail().equalsIgnoreCase(all));

	// 		boolean isFloorMatching = billSlb.getFromFloor() <= floorNo && billSlb.getToFloor() >= floorNo;

	// 		boolean isOccupancyTypeMatching = billSlb.getOccupancyType().equalsIgnoreCase(unit.getOccupancyType())
	// 				|| (billSlb.getOccupancyType().equalsIgnoreCase(all));

	// 		if (isMajorMatching && isMinorMatching && isSubMinorMatching && isDetailsMatching && isFloorMatching
	// 				&& isOccupancyTypeMatching) {

	// 			matchingList.add(billSlb);
	// 			log.debug(" The Id of the matching slab : " + billSlb.getId());
	// 		}
	// 	}
	// 	if (matchingList.size() == 1)
	// 		return matchingList.get(0);
	// 	else if (matchingList.size() == 0)
	// 		return null;
	// 	else throw new CustomException(PT_ESTIMATE_BILLINGSLABS_UNMATCH, PT_ESTIMATE_BILLINGSLABS_UNMATCH_MSG
	// 				.replace(PT_ESTIMATE_BILLINGSLABS_UNMATCH_replace_id, matchingList.toString()) + unit);
	// }

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
	
	
	public Map<String, Calculation> mutationCalculator(List<MutationCalculationCriteria> criteria, RequestInfo requestInfo) {
		Map<String, Calculation> feeStructure = new HashMap<>();
		for(MutationCalculationCriteria mutation: criteria) {
			Calculation calculation = new Calculation();
			BigDecimal fee = getFeeFromSlabs(mutation, calculation);
			calculation.setTaxAmount(fee);
			postProcessTheFee(calculation);
			feeStructure.put(mutation.getMutationApplicationNo(), calculation);
			generateDemandsFroMutationFee(feeStructure, requestInfo);
		}
		
		return feeStructure;
	}
	
	private BigDecimal getFeeFromSlabs(MutationCalculationCriteria criteria, Calculation calculation) {
		List<String> slabIds = new ArrayList<>();
		calculation.setBillingSlabIds(slabIds); 
		return null;
	}
	
	private void postProcessTheFee(Calculation calculation) {
		calculation.setRebate(BigDecimal.ZERO);
		calculation.setExemption(BigDecimal.ZERO);
		calculation.setPenalty(BigDecimal.ZERO);
		
		BigDecimal totalAmount = calculation.getTaxAmount()
				.subtract(calculation.getRebate().add(calculation.getExemption())).add(calculation.getPenalty());
		calculation.setTotalAmount(totalAmount);
	}
	
	private void generateDemandsFroMutationFee(Map<String, Calculation> feeStructure, RequestInfo requestInfo) {
		List<Demand> demands = new ArrayList<>();
		for(String key: feeStructure.keySet()) {
			List<DemandDetail> details = new ArrayList<>();
			Calculation calculation = feeStructure.get(key);
			DemandDetail detail = DemandDetail.builder().collectionAmount(null).demandId(null).id(null).taxAmount(calculation.getTaxAmount()).auditDetails(null)
					.taxHeadMasterCode(configs.getPtMutationFeeTaxHead()).tenantId(calculation.getTenantId()).build();
			details.add(detail);
			if(null != calculation.getPenalty() && BigDecimal.ZERO != calculation.getPenalty()){
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(null).demandId(null).id(null).taxAmount(calculation.getPenalty()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationPenaltyTaxHead()).tenantId(calculation.getTenantId()).build();
				details.add(demandDetail);
			}
			if(null != feeStructure.get(key).getRebate() && BigDecimal.ZERO != feeStructure.get(key).getRebate()){
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(null).demandId(null).id(null).taxAmount(calculation.getRebate()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationRebateTaxHead()).tenantId(feeStructure.get(key).getTenantId()).build();
				details.add(demandDetail);
			}
			if(null != feeStructure.get(key).getExemption() && BigDecimal.ZERO != feeStructure.get(key).getExemption()){
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(null).demandId(null).id(null).taxAmount(calculation.getExemption()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationExemptionTaxHead()).tenantId(feeStructure.get(key).getTenantId()).build();
				details.add(demandDetail);
			}
			
			Demand demand = Demand.builder().auditDetails(null).additionalDetails(null).businessService(configs.getPtMutationBusinessCode())
					.consumerCode(key).consumerType("").demandDetails(details).id("").minimumAmountPayable(configs.getPtMutationMinPayable()).payer(null).status(null)
					.taxPeriodFrom(null).taxPeriodTo(null).tenantId(feeStructure.get(key).getTenantId()).build();
			demands.add(demand);
			
		}
		
		DemandRequest dmReq = DemandRequest.builder().demands(demands).requestInfo(requestInfo).build();
		String url = new StringBuilder().append(configs.getBillingServiceHost())
				.append(configs.getDemandCreateEndPoint()).toString();
		try {
			restTemplate.postForObject(url, dmReq, Map.class);
		} catch (Exception e) {
			log.error("Demand creation failed: ", e);
			throw new CustomException("DEMAND_CREATION_FAILED", "Demand creation failed!");
		}
		
		
		
	}
}
