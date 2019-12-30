package org.egov.pt.calculator.service;

import java.math.BigDecimal;
import java.text.MessageFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.validator.CalculationValidator;
import org.egov.pt.calculator.web.models.*;
import org.egov.pt.calculator.web.models.BillingSlabSearchCriteria;
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
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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
	CalculationValidator calcValidator;

	@Autowired
	private RestTemplate restTemplate;

	/**
	 * Calculates tax and creates demand for the given assessment number
	 * 
	 * @param calculationReq The calculation request object containing the
	 *                       calculation criteria
	 * @return Map of assessment number to Calculation
	 */
	public Map<String, Calculation> calculateAndCreateDemand(CalculationReq calculationReq) {
		// assessmentService.enrichAssessment(calculationReq);
		Map<String, Calculation> res = demandService.generateDemands(calculationReq);
		return res;
	}

	/**
	 * Generates a map with assessment-number of property as key and estimation
	 * map(taxhead code as key, amount to be paid as value) as value will be called
	 * by calculate api
	 *
	 * @param request incoming calculation request containing the criteria.
	 * @return Map<String, Calculation> key of assessment number and value of
	 *         calculation object.
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
			Calculation calculation = getCalculation(requestInfo, criteria, masterMap);
			calculation.setServiceNumber(property.getPropertyId());
			calculationPropertyMap.put(assessmentNumber, calculation);
		}
		return calculationPropertyMap;
	}

	/**
	 * Method to estimate the tax to be paid for given property will be called by
	 * estimate api
	 *
	 * @param request incoming calculation request containing the criteria.
	 * @return CalculationRes calculation object containing all the tax for the
	 *         given criteria.
	 */
	public CalculationRes getTaxCalculation(CalculationReq request) {

		CalculationCriteria criteria = request.getCalculationCriteria().get(0);
		Property property = criteria.getProperty();
		PropertyDetail detail = property.getPropertyDetails().get(0);
		calcValidator.validatePropertyForCalculation(detail);
		Map<String, Object> masterMap = mDataService.getMasterMap(request);
		return new CalculationRes(new ResponseInfo(),
				Collections.singletonList(getCalculation(request.getRequestInfo(), criteria, masterMap)));
	}

	/**
	 * Generates a List of Tax head estimates with tax head code, tax head category
	 * and the amount to be collected for the key.
	 *
	 * @param criteria    criteria based on which calculation will be done.
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

		TaxHeadEstimate ptTaxHead = getPropertyTaxhead(criteria, filteredBillingSlabs, timeBasedExemptionMasterMap,
				exemption);

		List<TaxHeadEstimate> estimates = new ArrayList<TaxHeadEstimate>();
		estimates.add(ptTaxHead);
		estimates.add(getLateAssessmentPenaltyTaxhead(property));
		estimates.add(getAdHocPenaltyTaxhead(property));
		estimates.add(getUsageExemptionTaxhead(exemption));
		log.info("estimates", estimates);
		Map<String, List> estimatesAndBillingSlabs = new HashMap<>();
		estimatesAndBillingSlabs.put("estimates", estimates);
		estimatesAndBillingSlabs.put("billingSlabIds",
				filteredBillingSlabs.stream().map(slab -> slab.getId()).collect(Collectors.toList()));

		return estimatesAndBillingSlabs;
	}

	private TaxHeadEstimate getUsageExemptionTaxhead(BigDecimal exemption) {

		return TaxHeadEstimate.builder().taxHeadCode(PT_USAGE_EXEMPTION).estimateAmount(exemption).build();
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

	private TaxHeadEstimate getPropertyTaxhead(CalculationCriteria criteria, List<BillingSlab> filteredBillingSlabs,
			Map<String, JSONArray> masterMap, BigDecimal exemption) {

		Property property = criteria.getProperty();
		Long fromDate = criteria.getFromDate();
		Long toDate = criteria.getToDate();
		List<BillingSlab> usedSlabs = new ArrayList<BillingSlab>();
		List<Unit> units = property.getPropertyDetails().get(0).getUnits();
		PropertyDetail propertyDetail = property.getPropertyDetails().get(0);
		BigDecimal monthMultiplier = BigDecimal.valueOf(12);
		// only one billing slab
		// vacant Land AV = Carpet Area * residential unit rate * multiplier
		// factor *12
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
						// 26-12 TODO: add todate and fromdat instead of
						// assessment year.
						BigDecimal appreciationDepreciation = getAppreciationDepreciation(masterMap, unit, fromDate,
								toDate);
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

	private BigDecimal getAppreciationDepreciation(Map<String, JSONArray> masterMap, Unit unit, long fromDate,
			long toDate) {

		List<Object> depreciationAppreciation = masterMap.get(DEPRECIATION_APPRECIATION);
		LocalDate assessmentYear = LocalDate.ofEpochDay(fromDate);
		LocalDate constructionYear = LocalDate.ofEpochDay(unit.getAdditionalDetails().getConstructionDate());
		int age = assessmentYear.getYear() - constructionYear.getYear();

		for (Object val : depreciationAppreciation) {
			JSONObject deprAppr = (JSONObject) val;
			JSONObject ageOfBuilding;
			try {
				ageOfBuilding = (JSONObject) deprAppr.get("ageOfBuilding");

				if (((int) ageOfBuilding.get("yearFrom")) <= age && ((int) ageOfBuilding.get("yearTo")) >= age) {
					return BigDecimal.valueOf(Long.valueOf((int) deprAppr.get("depreciationAppreciation")));
				}
			} catch (JSONException e) {
				log.error("Error while retriving Depreciation Appreciation", e);
			}

		}

		return null;

	}

	private BigDecimal getMultipleFactor(Map<String, JSONArray> masterMap, Unit unit) {
		List<Object> taxRates = masterMap.get(USAGE_SUB_MINOR_MASTER);

		for (Object val : taxRates) {
			LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) val;
			if (((String) map.get("code")).equals(unit.getUsageCategorySubMinor())) {
				return BigDecimal.valueOf(Long.valueOf((int) map.get("ARVFactor")));
			}

		}

		return null;
	}

	private BigDecimal getExemptionRate(Map<String, JSONArray> masterMap, Unit unit) {
		List<Object> taxRates = masterMap.get(USAGE_SUB_MINOR_MASTER);

		for (Object val : taxRates) {
			LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) val;
			if (((String) map.get("code")).equals(unit.getUsageCategorySubMinor())) {
				LinkedHashMap<String, Object> exemption = (LinkedHashMap<String, Object>) map.get("exemption");
				return BigDecimal.valueOf(Long.valueOf((int) exemption.get("rate")));
			}

		}

		return null;
	}

	private BigDecimal getTaxRate(Map<String, JSONArray> masterMap, Unit unit) {
		List<Object> taxRates = masterMap.get(TAX_RATE);

		String matchString = unit.getUsageCategoryMajor().equalsIgnoreCase("RESIDENTIAL") ? "General Tax (Residential)"
				: "General Tax (Non-residential)";

		for (Object val : taxRates) {
			LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) val;
			if (((String) map.get("taxhead")).equalsIgnoreCase(matchString)) {
				return BigDecimal.valueOf(Long.valueOf((int) map.get("rate")));
			}
		}

		return null;
	}

	private BigDecimal getRebateRate(Map<String, JSONArray> masterMap) {
		List<Object> rebateRates = masterMap.get(REBATE_MASTER);

		for (Object val : rebateRates) {
			LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) val;
			if (((LocalDate) map.get("startingDay")).isBefore(LocalDate.now())
					&& ((LocalDate) map.get("endingDay")).isAfter(LocalDate.now())) {
				return BigDecimal.valueOf(Long.valueOf((int) map.get("rate")));
			}
		}

		return null;
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
		Map<String, Category> taxHeadCategoryMap = ((List<TaxHeadMaster>) masterMap.get(TAXHEADMASTER_MASTER_KEY))
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

		BigDecimal totalAmount = taxAmt.add(penalty).subtract(rebate);
		// false in the argument represents that the demand shouldn't be updated from this call
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

	public Map<String, Calculation> mutationCalculator(List<MutationCalculationCriteria> criteria,
			RequestInfo requestInfo) {
		Map<String, Calculation> feeStructure = new HashMap<>();
		for (MutationCalculationCriteria mutation : criteria) {
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
		for (String key : feeStructure.keySet()) {
			List<DemandDetail> details = new ArrayList<>();
			Calculation calculation = feeStructure.get(key);
			DemandDetail detail = DemandDetail.builder().collectionAmount(null).demandId(null).id(null)
					.taxAmount(calculation.getTaxAmount()).auditDetails(null)
					.taxHeadMasterCode(configs.getPtMutationFeeTaxHead()).tenantId(calculation.getTenantId()).build();
			details.add(detail);
			if (null != calculation.getPenalty() && BigDecimal.ZERO != calculation.getPenalty()) {
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(null).demandId(null).id(null)
						.taxAmount(calculation.getPenalty()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationPenaltyTaxHead()).tenantId(calculation.getTenantId())
						.build();
				details.add(demandDetail);
			}
			if (null != feeStructure.get(key).getRebate() && BigDecimal.ZERO != feeStructure.get(key).getRebate()) {
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(null).demandId(null).id(null)
						.taxAmount(calculation.getRebate()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationRebateTaxHead())
						.tenantId(feeStructure.get(key).getTenantId()).build();
				details.add(demandDetail);
			}
			if (null != feeStructure.get(key).getExemption()
					&& BigDecimal.ZERO != feeStructure.get(key).getExemption()) {
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(null).demandId(null).id(null)
						.taxAmount(calculation.getExemption()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationExemptionTaxHead())
						.tenantId(feeStructure.get(key).getTenantId()).build();
				details.add(demandDetail);
			}

			Demand demand = Demand.builder().auditDetails(null).additionalDetails(null)
					.businessService(configs.getPtMutationBusinessCode()).consumerCode(key).consumerType("")
					.demandDetails(details).id("").minimumAmountPayable(configs.getPtMutationMinPayable()).payer(null)
					.status(null).taxPeriodFrom(null).taxPeriodTo(null).tenantId(feeStructure.get(key).getTenantId())
					.build();
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
