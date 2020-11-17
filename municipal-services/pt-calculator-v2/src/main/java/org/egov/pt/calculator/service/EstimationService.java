package org.egov.pt.calculator.service;

import static org.egov.pt.calculator.util.CalculatorConstants.BATHROOM_AREA_MULTIPLIER;
import static org.egov.pt.calculator.util.CalculatorConstants.BILLING_SLAB_MATCH_ERROR_CODE;
import static org.egov.pt.calculator.util.CalculatorConstants.BILLING_SLAB_MATCH_ERROR_MESSAGE;
import static org.egov.pt.calculator.util.CalculatorConstants.BILLING_SLAB_MATCH_ERROR_PROPERTY_MESSAGE;
import static org.egov.pt.calculator.util.CalculatorConstants.BUILTUP;
import static org.egov.pt.calculator.util.CalculatorConstants.COMMON_AREA_MULTIPLIER;
import static org.egov.pt.calculator.util.CalculatorConstants.COVERED_AREA_MULTIPLIER;
import static org.egov.pt.calculator.util.CalculatorConstants.DEPRECIATION_APPRECIATION;
import static org.egov.pt.calculator.util.CalculatorConstants.FINANCIALYEAR_MASTER_KEY;
import static org.egov.pt.calculator.util.CalculatorConstants.FINANCIAL_YEAR_ENDING_DATE;
import static org.egov.pt.calculator.util.CalculatorConstants.FINANCIAL_YEAR_STARTING_DATE;
import static org.egov.pt.calculator.util.CalculatorConstants.GARAGE_AREA_MULTIPLIER;
import static org.egov.pt.calculator.util.CalculatorConstants.HUNDRED;
import static org.egov.pt.calculator.util.CalculatorConstants.NONRESIDENTIAL;
import static org.egov.pt.calculator.util.CalculatorConstants.ONE_TIME_PENALTY_JSON_STRING;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ADHOC_PENALTY;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ADHOC_REBATE;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ESTIMATE_BILLINGSLABS_UNMATCH_VACANCT;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ESTIMATE_BILLINGSLABS_UNMATCH_VACANT_MSG;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_LATE_ASSESSMENT_PENALTY;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_TAX;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_TYPE_VACANT_LAND;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_USAGE_EXEMPTION;
import static org.egov.pt.calculator.util.CalculatorConstants.REBATE_MASTER;
import static org.egov.pt.calculator.util.CalculatorConstants.RENTED;
import static org.egov.pt.calculator.util.CalculatorConstants.RESIDENTIAL;
import static org.egov.pt.calculator.util.CalculatorConstants.ROAD_TYPE_JSON_STRING;
import static org.egov.pt.calculator.util.CalculatorConstants.ROOMS_AREA_MULTIPLIER;
import static org.egov.pt.calculator.util.CalculatorConstants.TAXHEADMASTER_MASTER_KEY;
import static org.egov.pt.calculator.util.CalculatorConstants.TAX_RATE;
import static org.egov.pt.calculator.util.CalculatorConstants.USAGE_SUB_MINOR_MASTER;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ROUNDOFF;
import static org.egov.pt.calculator.util.CalculatorConstants.MIXED;
import static org.egov.pt.calculator.util.CalculatorConstants.GROUND_FLOOR_NUMBER;

import java.math.BigDecimal;
import java.text.MessageFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.validator.CalculationValidator;
import org.egov.pt.calculator.web.models.BillingSlab;
import org.egov.pt.calculator.web.models.BillingSlabSearchCriteria;
import org.egov.pt.calculator.web.models.Calculation;
import org.egov.pt.calculator.web.models.CalculationCriteria;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.CalculationRes;
import org.egov.pt.calculator.web.models.TaxHeadEstimate;
import org.egov.pt.calculator.web.models.demand.Category;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.demand.DemandDetail;
import org.egov.pt.calculator.web.models.demand.DemandRequest;
import org.egov.pt.calculator.web.models.demand.DemandResponse;
import org.egov.pt.calculator.web.models.demand.TaxHeadMaster;
import org.egov.pt.calculator.web.models.demand.TaxPeriod;
import org.egov.pt.calculator.web.models.demand.TaxPeriodResponse;
import org.egov.pt.calculator.web.models.property.OwnerInfo;
import org.egov.pt.calculator.web.models.property.Property;
import org.egov.pt.calculator.web.models.property.PropertyDetail;
import org.egov.pt.calculator.web.models.property.PropertyDetail.SourceEnum;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.egov.pt.calculator.web.models.property.Unit;
import org.egov.pt.calculator.web.models.property.UnitAdditionalDetails;
import org.egov.pt.calculator.web.models.propertyV2.PropertyV2;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

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

	@Autowired
	private MDMSService mdmsService;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private Repository repository;

	@Autowired
	private CalculatorUtils utils;

	/**
	 * Calculates tax and creates demand for the given assessment number
	 * 
	 * @param calculationReq The calculation request object containing the
	 *                       calculation criteria
	 * @return Map of assessment number to Calculation
	 */
	public Map<String, Calculation> calculateAndCreateDemand(CalculationReq calculationReq, boolean generateDemand) {
		// assessmentService.enrichAssessment(calculationReq);
		// We are assuming all property details should be from same source in a property
		List<CalculationCriteria> criterias = calculationReq.getCalculationCriteria().stream()
				.filter(criteria -> !criteria.getProperty().getPropertyDetails().get(0).getSource()
						.equals(SourceEnum.LEGACY_RECORD))
				.collect(Collectors.toList());
		List<CalculationCriteria> calCriteria = calculationReq.getCalculationCriteria();
		calculationReq.setCalculationCriteria(criterias);
		// criterias
		if (!CollectionUtils.isEmpty(calculationReq.getCalculationCriteria())) {
			Map<String, Calculation> res = demandService.calculateAndGenerateDemands(calculationReq, generateDemand);
			return res;
		} else {
			Map<String, Calculation> estimateMap = new HashMap<String, Calculation>();
			// Sending empty Calculation for Legacy Records.
			calCriteria.stream().forEach(
					criteria -> criteria.getProperty().getPropertyDetails().forEach(propertyDetail -> estimateMap
							.put(propertyDetail.getAssessmentNumber(), Calculation.builder().build())));
			log.info("Sending empty response: {}", estimateMap.toString());
			return estimateMap;
		}
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
		estimates.add(getAdHocRebateTaxhead(property));
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
		BigDecimal tax = property.getPropertyDetails().get(0).getAdhocPenalty()==null ? 
				BigDecimal.ZERO : property.getPropertyDetails().get(0).getAdhocPenalty();
		return TaxHeadEstimate.builder().taxHeadCode(PT_ADHOC_PENALTY).estimateAmount(tax).build();
	}
	
	private TaxHeadEstimate getAdHocRebateTaxhead(Property property) {
		BigDecimal tax = property.getPropertyDetails().get(0).getAdhocExemption()==null ? 
				BigDecimal.ZERO : property.getPropertyDetails().get(0).getAdhocExemption();
		return TaxHeadEstimate.builder().taxHeadCode(PT_ADHOC_REBATE).estimateAmount(tax).build();
	}

	private TaxHeadEstimate getLateAssessmentPenaltyTaxhead(Property property) {
		Map details = (Map) property.getPropertyDetails().get(0).getAdditionalDetails();
		BigDecimal amount = details.get(ONE_TIME_PENALTY_JSON_STRING)==null ? BigDecimal.ZERO : BigDecimal.valueOf((double) details.get(ONE_TIME_PENALTY_JSON_STRING));
		return TaxHeadEstimate.builder().taxHeadCode(PT_LATE_ASSESSMENT_PENALTY).estimateAmount(amount).build();
	}

	private TaxHeadEstimate getPropertyTaxhead(CalculationCriteria criteria, List<BillingSlab> filteredBillingSlabs,
			Map<String, JSONArray> masterMap, BigDecimal exemption) {

		Property property = criteria.getProperty();
		List<BillingSlab> usedSlabs = new ArrayList<BillingSlab>();
		List<Unit> units = property.getPropertyDetails().get(0).getUnits();
		PropertyDetail propertyDetail = property.getPropertyDetails().get(0);
		String fromDate = propertyDetail.getFinancialYear();
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
			BigDecimal taxRate = getVacantTaxRate(masterMap, propertyDetail.getUsageCategoryMajor());
			BigDecimal multipleFactor = BigDecimal.ONE;
			BigDecimal landAV = carpetArea.multiply(unitRate).multiply(multipleFactor).multiply(monthMultiplier);
			BigDecimal taxAmount = landAV.multiply(taxRate).divide(HUNDRED).setScale(2, 2);
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
							BigDecimal totalBuiltupArea = units.stream()
									.filter(unitDetail -> GROUND_FLOOR_NUMBER.equals(unitDetail.getFloorNo()))
									.map(Unit::getUnitArea).reduce(BigDecimal.ZERO, BigDecimal::add);

							BigDecimal unoccupiedLandArea = propertyDetail.getLandArea().subtract(totalBuiltupArea);
							BigDecimal unoccupiedLandAV = unoccupiedLandArea.multiply(unitRate).multiply(multipleFactor)
									.multiply(monthMultiplier);
							unoccupiedLandTaxAmount = unoccupiedLandAV.multiply(taxRate);
							unoccupiedLandCount = unoccupiedLandCount + 1;
						}

					} else if (unit.getUsageCategoryMajor().equals(RESIDENTIAL)) {
						BigDecimal appreDepreAmount;
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
						if (MIXED.equalsIgnoreCase(propertyDetail.getUsageCategoryMajor())) {
							appreDepreAmount = BigDecimal.ZERO;
						} else {
							BigDecimal appreciationDepreciation = getAppreciationDepreciation(masterMap, unit,
									fromDate);
							appreDepreAmount = carpetArea.multiply(unitRate).multiply(appreciationDepreciation)
									.multiply(monthMultiplier).divide(HUNDRED);
						}
						BigDecimal landAV = carpetArea.multiply(unitRate).multiply(monthMultiplier);

						landAV = landAV.add(appreDepreAmount);
						unitTaxAmount = landAV.multiply(taxRate).divide(HUNDRED);
						//exemption = exemption.add(unitTaxAmount.multiply(exemptionRate).divide(HUNDRED));
					}

				} else {
					throw new CustomException(BILLING_SLAB_MATCH_ERROR_CODE,
							MessageFormat.format(BILLING_SLAB_MATCH_ERROR_MESSAGE, unit.getConstructionType()));
				}

				taxAmount = taxAmount.add(unitTaxAmount).add(unoccupiedLandTaxAmount).setScale(2, 2);
			}

			return TaxHeadEstimate.builder().taxHeadCode(PT_TAX).estimateAmount(taxAmount).build();

		}

		return null;
	}

	private BigDecimal getAppreciationDepreciation(Map<String, JSONArray> masterMap, Unit unit, String fromDate) {

		List<Object> depreciationAppreciation = masterMap.get(DEPRECIATION_APPRECIATION);
		int assessmentYear = Integer.parseInt(fromDate.split("-")[0]);
		LocalDate constructionYear = Instant.ofEpochMilli(unit.getAdditionalDetails().getConstructionDate())
				.atZone(ZoneId.systemDefault()).toLocalDate();
		int age = assessmentYear - constructionYear.getYear();

		for (Object val : depreciationAppreciation) {
			LinkedHashMap deprAppr = (LinkedHashMap)val;
			LinkedHashMap ageOfBuilding;
			try {
				if(unit.getOccupancyType().equalsIgnoreCase(deprAppr.get("occupancyType").toString())){
				ageOfBuilding = (LinkedHashMap) deprAppr.get("ageOfBuilding");

				if(ageOfBuilding.get("yearTo") == null){
					return BigDecimal.valueOf(Long.valueOf((int) deprAppr.get("depreciationAppreciation")));
				}

				if (((int) ageOfBuilding.get("yearFrom")) <= age && ((int) ageOfBuilding.get("yearTo")) >= age) {
					return BigDecimal.valueOf(Long.valueOf((int) deprAppr.get("depreciationAppreciation")));
				}
				}
			} catch (Exception e) {
				log.error("Error while retriving Depreciation Appreciation", e);
			}

		}

		return BigDecimal.ZERO;

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
	
	private BigDecimal getVacantTaxRate(Map<String, JSONArray> masterMap, String usageCategory) {
		List<Object> taxRates = masterMap.get(TAX_RATE);

		String matchString = usageCategory.equalsIgnoreCase("RESIDENTIAL") ? "General Tax (Residential)"
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
	 * All the credit taxHeads will be payable and all debit tax heads will be
	 * deducted.
	 *
	 * @param criteria    criteria based on which calculation will be done.
	 * @param requestInfo request info from incoming request.
	 * @return Calculation object constructed based on the resulting tax amount and
	 *         other applicables(rebate/penalty)
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
		BigDecimal roundOff = BigDecimal.ZERO;
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
			else if (decimalEstimate.getTaxHeadCode().equalsIgnoreCase(PT_ROUNDOFF)) {
				roundOff = roundOff.add(decimalEstimate.getEstimateAmount());
			} else
				rebate = rebate.add(decimalEstimate.getEstimateAmount());
		}

		BigDecimal totalAmount = taxAmt.add(penalty).subtract(rebate).add(roundOff);
		// false in the argument represents that the demand shouldn't be updated from
		// this call
		return Calculation.builder().totalAmount(totalAmount).taxAmount(taxAmt).penalty(penalty).exemption(exemption)
				.rebate(rebate).fromDate(fromDate).toDate(toDate).tenantId(tenantId).serviceNumber(assessmentNumber)
				.taxHeadEstimates(estimates).billingSlabIds(billingSlabIds).build();
	}

	/**
	 * method to do a first level filtering on the slabs based on the values present
	 * in Property detail
	 */
	private List<BillingSlab> getSlabsFiltered(Property property, RequestInfo requestInfo) {
		PropertyDetail detail = property.getPropertyDetails().get(0);
		String tenantId = property.getTenantId();
		LinkedHashMap additionalDetails = (LinkedHashMap) detail.getAdditionalDetails();
		String roadType = additionalDetails ==null ? "" : (String) additionalDetails.get(ROAD_TYPE_JSON_STRING);
		// TODO ward
		BillingSlabSearchCriteria slabSearchCriteria = BillingSlabSearchCriteria.builder().tenantId(tenantId).ward("")
				.propertyType(detail.getPropertyType()).roadType(roadType)
				.mohalla(property.getAddress().getLocality().getCode()).build();

		List<BillingSlab> billingSlabs = billingSlabService.searchBillingSlabs(requestInfo, slabSearchCriteria)
				.getBillingSlab();
		return billingSlabs;

	}

	public Map<String, Calculation> mutationCalculator(PropertyV2 property, RequestInfo requestInfo) {
		Map<String, Calculation> feeStructure = new HashMap<>();
		Map<String, Object> additionalDetails = mapper.convertValue(property.getAdditionalDetails(), Map.class);
		calcValidator.validatePropertyForMutationCalculation(additionalDetails);
		Calculation calculation = new Calculation();
		BigDecimal fee = BigDecimal.ZERO;
		Object mdmsData = mdmsService.mDMSCall(requestInfo, property.getTenantId());
		Map<String, List<Object>> attributeValues = mdmsService.getAttributeValues(mdmsData);
		List<Object> mutationFee = attributeValues.get("MutationFee");
		String usageCategory = property.getUsageCategory();
		String usage = "";
		if (usageCategory.contains(".")) {
			String[] usageSplit = usageCategory.split("\\.");
			usage = usageSplit[0];
		} else {
			usage = usageCategory;
		}

		Map<String, Object> applicableMasterData = getApplicableMasterData(mutationFee);
		LinkedHashMap<String, Object> feeMap = (LinkedHashMap<String, Object>) applicableMasterData;
		fee = BigDecimal.valueOf((Integer) feeMap.get(usage));
		calculation.setTenantId(property.getTenantId());

		setTaxperiodForCalculation(requestInfo, property.getTenantId(), calculation);
		calculation.setTaxAmount(fee);
		postProcessTheFee(requestInfo, property, calculation, additionalDetails);
		feeStructure.put(property.getAcknowldgementNumber(), calculation);
		searchDemand(requestInfo, property, calculation, feeStructure);

		return feeStructure;

	}

	private void setTaxperiodForCalculation(RequestInfo requestInfo, String tenantId, Calculation calculation) {
		List<TaxPeriod> taxPeriodList = getTaxPeriodList(requestInfo, tenantId);
		long currentTime = System.currentTimeMillis();
		for (TaxPeriod taxPeriod : taxPeriodList) {
			if (currentTime >= taxPeriod.getFromDate() && currentTime <= taxPeriod.getToDate()) {
				calculation.setFromDate(taxPeriod.getFromDate());
				calculation.setToDate(taxPeriod.getToDate());
			}
		}

	}

	/**
	 * Calculate the rebate and penalty for mutation
	 * 
	 * @param requestInfo
	 * @param property
	 * @param calculation
	 * @param additionalDetails
	 */
	private void postProcessTheFee(RequestInfo requestInfo, PropertyV2 property, Calculation calculation,
			Map<String, Object> additionalDetails) {
		/*
		 * Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap = new
		 * HashMap<>(); Map<String, JSONArray> timeBasedExemptionMasterMap = new
		 * HashMap<>(); mDataService.setPropertyMasterValues(requestInfo,
		 * property.getTenantId(), propertyBasedExemptionMasterMap,
		 * timeBasedExemptionMasterMap);
		 * 
		 * Long docDate =
		 * Long.valueOf(String.valueOf(additionalDetails.get(CalculatorConstants.
		 * DOCUMENT_DATE))); BigDecimal taxAmt = calculation.getTaxAmount();
		 */
		BigDecimal rebate = BigDecimal.ZERO;

		// rebate = getRebate(taxAmt,
		// timeBasedExemptionMasterMap.get(CalculatorConstants.REBATE_MASTER), docDate);

		BigDecimal penalty = BigDecimal.ZERO;

		/*
		 * if (rebate.equals(BigDecimal.ZERO)) { penalty = getPenalty(taxAmt,
		 * timeBasedExemptionMasterMap.get(CalculatorConstants.PENANLTY_MASTER),
		 * docDate); }
		 */

		calculation.setRebate(rebate.setScale(2, 2).negate());
		calculation.setPenalty(penalty.setScale(2, 2));
		calculation.setExemption(BigDecimal.ZERO);

		BigDecimal totalAmount = calculation.getTaxAmount().add(calculation.getRebate().add(calculation.getExemption()))
				.add(calculation.getPenalty());
		calculation.setTotalAmount(totalAmount);
	}

	/**
	 * Returns the Amount of rebate that has to be applied on the given tax amount
	 * for the given period
	 * 
	 * @param taxAmt
	 * @param rebateMasterList
	 * @param docDate
	 *
	 * @return
	 */

	public BigDecimal getRebate(BigDecimal taxAmt, JSONArray rebateMasterList, Long docDate) {

		BigDecimal rebateAmt = BigDecimal.ZERO;
		Map<String, Object> rebate = getApplicableMaster(rebateMasterList);

		if (null == rebate)
			return rebateAmt;
		Integer mutationPaymentPeriodInMonth = Integer
				.parseInt(String.valueOf(rebate.get(CalculatorConstants.MUTATION_PAYMENT_PERIOD_IN_MONTH)));
		Long deadlineDate = getDeadlineDate(docDate, mutationPaymentPeriodInMonth);

		if (deadlineDate > System.currentTimeMillis())
			rebateAmt = mDataService.calculateApplicables(taxAmt, rebate);
		return rebateAmt;
	}

	/**
	 * Returns the payment deadline date for the property mutation
	 *
	 * @param docdate
	 * @param mutationPaymentPeriodInMonth
	 *
	 * @return
	 */
	private Long getDeadlineDate(Long docdate, Integer mutationPaymentPeriodInMonth) {
		Long deadlineDate = null;
		Long timeStamp = docdate / 1000L;
		java.util.Date time = new java.util.Date((Long) timeStamp * 1000);
		Calendar cal = Calendar.getInstance();
		cal.setTime(time);
		Integer day = cal.get(Calendar.DAY_OF_MONTH);
		Integer month = cal.get(Calendar.MONTH);
		Integer year = cal.get(Calendar.YEAR);

		month = month + mutationPaymentPeriodInMonth;
		if (month > 12) {
			month = month - 12;
			year = year + 1;
		}
		cal.clear();
		cal.set(year, month, day);
		deadlineDate = cal.getTimeInMillis();
		return deadlineDate;
	}

	/**
	 * Returns the rebate/penalty object from mdms that has to be applied on the
	 * given tax amount for the given period
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
			if (!objMap.containsKey(CalculatorConstants.STARTING_DATE_APPLICABLES)) {
				dateFiledName = CalculatorConstants.ENDING_DATE_APPLICABLES;
			} else
				dateFiledName = CalculatorConstants.STARTING_DATE_APPLICABLES;

			String[] time = ((String) objMap.get(dateFiledName)).split("/");
			Calendar cal = Calendar.getInstance();
			Long startDate = setDateToCalendar(objFinYear, time, cal, 0);
			Long endDate = setDateToCalendar(objFinYear, time, cal, 1);
			if (System.currentTimeMillis() >= startDate && System.currentTimeMillis() <= endDate)
				objToBeReturned = objMap;

		}

		return objToBeReturned;
	}

	/**
	 * Sets the date in to calendar based on the month and date value present in the
	 * time array
	 * 
	 * @param assessmentYear
	 * @param time
	 * @param cal
	 * @return
	 */
	private Long setDateToCalendar(String assessmentYear, String[] time, Calendar cal, int flag) {

		cal.clear();
		Long date = null;
		Integer day = Integer.valueOf(time[0]);
		Integer month = Integer.valueOf(time[1]) - 1;
		Integer year = Integer.valueOf(assessmentYear);
		if (flag == 1)
			year = year + 1;
		cal.set(year, month, day);
		date = cal.getTimeInMillis();

		return date;
	}

	/**
	 * Returns the Amount of penalty that has to be applied on the given tax amount
	 * for the given period
	 *
	 * @param taxAmt
	 * @param penaltyMasterList
	 * @param docDate
	 * @return
	 */
	public BigDecimal getPenalty(BigDecimal taxAmt, JSONArray penaltyMasterList, Long docDate) {

		BigDecimal penaltyAmt = BigDecimal.ZERO;
		Map<String, Object> penalty = getApplicableMaster(penaltyMasterList);

		if (null == penalty)
			return penaltyAmt;
		Integer mutationPaymentPeriodInMonth = Integer
				.parseInt(String.valueOf(penalty.get(CalculatorConstants.MUTATION_PAYMENT_PERIOD_IN_MONTH)));
		Long deadlineDate = getDeadlineDate(docDate, mutationPaymentPeriodInMonth);

		if (deadlineDate < System.currentTimeMillis())
			penaltyAmt = mDataService.calculateApplicables(taxAmt, penalty);

		return penaltyAmt;
	}

	/**
	 * Fetch Tax Head Masters From billing service
	 * 
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
	 * Returns the tax head search Url with tenantId and PropertyTax service name
	 * parameters
	 *
	 * @param tenantId
	 * @return
	 */
	public StringBuilder getTaxPeriodSearchUrl(String tenantId) {

		return new StringBuilder().append(configs.getBillingServiceHost()).append(configs.getTaxPeriodSearchEndpoint())
				.append(CalculatorConstants.URL_PARAMS_SEPARATER)
				.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(CalculatorConstants.SEPARATER).append(CalculatorConstants.SERVICE_FIELD_FOR_SEARCH_URL)
				.append(CalculatorConstants.SERVICE_FIELD_VALUE_PT_MUTATION);
	}

	/**
	 * Search Demand for the property mutation based on acknowledgeNumber
	 * 
	 * @param requestInfo
	 * @param property
	 * @param calculation
	 * @param feeStructure
	 */
	private void searchDemand(RequestInfo requestInfo, PropertyV2 property, Calculation calculation,
			Map<String, Calculation> feeStructure) {
		String url = new StringBuilder().append(configs.getBillingServiceHost())
				.append(configs.getDemandSearchEndPoint()).append(CalculatorConstants.URL_PARAMS_SEPARATER)
				.append(CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(property.getTenantId())
				.append(CalculatorConstants.SEPARATER).append(CalculatorConstants.BUSINESSSERVICE_FIELD_FOR_SEARCH_URL)
				.append(configs.getPtMutationBusinessCode()).append(CalculatorConstants.SEPARATER)
				.append(CalculatorConstants.CONSUMER_CODE_SEARCH_FIELD_NAME).append(property.getAcknowldgementNumber())
				.toString();
		DemandResponse res = new DemandResponse();
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		res = restTemplate.postForObject(url, requestInfoWrapper, DemandResponse.class);
		if (CollectionUtils.isEmpty(res.getDemands()) || res.getDemands() == null)
			generateDemandsFroMutationFee(property, feeStructure, requestInfo);
		else
			updateDemand(property, requestInfo, res, calculation);

	}

	/**
	 * Generate Demand for the property mutation
	 * 
	 * @param feeStructure
	 * @param requestInfo
	 */
	private void generateDemandsFroMutationFee(PropertyV2 property, Map<String, Calculation> feeStructure,
			RequestInfo requestInfo) {
		List<Demand> demands = new ArrayList<>();
		for (String key : feeStructure.keySet()) {
			List<DemandDetail> details = new ArrayList<>();
			Calculation calculation = feeStructure.get(key);
			DemandDetail detail = DemandDetail.builder().collectionAmount(BigDecimal.ZERO).demandId(null).id(null)
					.taxAmount(calculation.getTaxAmount()).auditDetails(null)
					.taxHeadMasterCode(configs.getPtMutationFeeTaxHead()).tenantId(calculation.getTenantId()).build();
			details.add(detail);
			if (null != calculation.getPenalty()) {
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(BigDecimal.ZERO).demandId(null)
						.id(null).taxAmount(calculation.getPenalty()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationPenaltyTaxHead()).tenantId(calculation.getTenantId())
						.build();
				details.add(demandDetail);
			}
			if (null != feeStructure.get(key).getRebate()) {
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(BigDecimal.ZERO).demandId(null)
						.id(null).taxAmount(calculation.getRebate()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationRebateTaxHead()).tenantId(calculation.getTenantId())
						.build();
				details.add(demandDetail);
			}
			if (null != feeStructure.get(key).getExemption()
					&& BigDecimal.ZERO != feeStructure.get(key).getExemption()) {
				DemandDetail demandDetail = DemandDetail.builder().collectionAmount(BigDecimal.ZERO).demandId(null)
						.id(null).taxAmount(calculation.getExemption()).auditDetails(null)
						.taxHeadMasterCode(configs.getPtMutationExemptionTaxHead()).tenantId(calculation.getTenantId())
						.build();
				details.add(demandDetail);
			}
			OwnerInfo owner = getActiveOwner(property.getOwners());
			User payer = utils.getCommonContractUser(owner);

			Demand demand = Demand.builder().auditDetails(null).additionalDetails(null)
					.businessService(configs.getPtMutationBusinessCode()).consumerCode(key).consumerType(" ")
					.demandDetails(details).id(null).minimumAmountPayable(configs.getPtMutationMinPayable())
					.payer(payer).status(null).taxPeriodFrom(calculation.getFromDate())
					.taxPeriodTo(calculation.getToDate()).tenantId(calculation.getTenantId()).build();
			demands.add(demand);

		}

		DemandResponse res = new DemandResponse();

		DemandRequest dmReq = DemandRequest.builder().demands(demands).requestInfo(requestInfo).build();
		try {
			log.info("Request: " + mapper.writeValueAsString(dmReq));
		} catch (JsonProcessingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		String url = new StringBuilder().append(configs.getBillingServiceHost())
				.append(configs.getDemandCreateEndPoint()).toString();
		try {
			restTemplate.postForObject(url, dmReq, Map.class);
		} catch (Exception e) {
			log.error("Demand creation failed: ", e);
			throw new CustomException(CalculatorConstants.DEMAND_CREATE_FAILED,
					CalculatorConstants.DEMAND_CREATE_FAILED_MSG);

		}

	}

	private OwnerInfo getActiveOwner(List<OwnerInfo> ownerlist) {
		OwnerInfo ownerInfo = new OwnerInfo();
		String status;
		for (OwnerInfo owner : ownerlist) {
			status = String.valueOf(owner.getStatus());
			if (status.equals(CalculatorConstants.OWNER_STATUS_ACTIVE)) {
				ownerInfo = owner;
				return ownerInfo;
			}
		}
		return ownerInfo;
	}

	/**
	 * Update Demand for the property mutation
	 * 
	 * @param requestInfo
	 * @param response
	 * @param calculation
	 */
	private void updateDemand(PropertyV2 property, RequestInfo requestInfo, DemandResponse response,
			Calculation calculation) {
		List<Demand> demands = response.getDemands();
		User payer = null;
		for (int i = 0; i < demands.size(); i++) {
			demands.get(i).setTaxPeriodFrom(calculation.getFromDate());
			demands.get(i).setTaxPeriodTo(calculation.getToDate());
			if (demands.get(i).getPayer() == null) {
				OwnerInfo owner = getActiveOwner(property.getOwners());
				payer = utils.getCommonContractUser(owner);
				demands.get(i).setPayer(payer);
			}

			List<DemandDetail> demandDetails = demands.get(i).getDemandDetails();
			for (int j = 0; j < demandDetails.size(); j++) {
				if (demandDetails.get(j).getTaxHeadMasterCode() == configs.getPtMutationFeeTaxHead())
					demands.get(i).getDemandDetails().get(j).setTaxAmount(calculation.getTaxAmount());

				if (demandDetails.get(j).getTaxHeadMasterCode() == configs.getPtMutationPenaltyTaxHead())
					demands.get(i).getDemandDetails().get(j).setTaxAmount(calculation.getPenalty());

				if (demandDetails.get(j).getTaxHeadMasterCode() == configs.getPtMutationRebateTaxHead())
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
			throw new CustomException(CalculatorConstants.DEMAND_UPDATE_FAILED,
					CalculatorConstants.DEMAND_UPDATE_FAILED_MSG);
		}

	}

	public Map<String, Object> getApplicableMasterData(List<Object> masterList) {

		Map<String, Object> objToBeReturned = null;

		for (Object object : masterList) {

			Map<String, Object> objMap = (Map<String, Object>) object;
			Long startDate = ((Long) objMap.get(CalculatorConstants.STARTING_DATE_APPLICABLES));
			Long endDate = ((Long) objMap.get(CalculatorConstants.ENDING_DATE_APPLICABLES));

			if (System.currentTimeMillis() >= startDate && System.currentTimeMillis() <= endDate)
				objToBeReturned = objMap;
		}

		return objToBeReturned;
	}
}
