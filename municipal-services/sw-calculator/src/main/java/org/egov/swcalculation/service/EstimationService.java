package org.egov.swcalculation.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swcalculation.constants.SWCalculationConstant;
import org.egov.swcalculation.web.models.*;
import org.egov.swcalculation.util.CalculatorUtils;
import org.egov.swcalculation.util.SWCalculationUtil;
import org.egov.swcalculation.util.SewerageCessUtil;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

@Service
@Slf4j
public class EstimationService {

	@Autowired
	private CalculatorUtils calculatorUtil;

	@Autowired
	private SewerageCessUtil sewerageCessUtil;

	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private SWCalculationUtil sWCalculationUtil;

	/**
	 * Generates a List of Tax head estimates with tax head code, tax head
	 * category and the amount to be collected for the key.
	 *
	 * @param criteria
	 *            criteria based on which calculation will be done.
	 * @param requestInfo
	 *            request info from incoming request.
	 * @return Map<String, Double>
	 */
	@SuppressWarnings("rawtypes")
	public Map<String, List> getEstimationMap(CalculationCriteria criteria, RequestInfo requestInfo,
			Map<String, Object> masterData) {
		if (StringUtils.isEmpty((criteria.getSewerageConnection()))
				&& !StringUtils.isEmpty(criteria.getConnectionNo())) {
			List<SewerageConnection> sewerageConnectionList = calculatorUtil.getSewerageConnection(requestInfo, criteria.getConnectionNo(),
					criteria.getTenantId());
			SewerageConnection sewerageConnection = calculatorUtil.getSewerageConnectionObject(sewerageConnectionList);
			criteria.setSewerageConnection(sewerageConnection);
		}
		if (criteria.getSewerageConnection() == null || StringUtils.isEmpty(criteria.getConnectionNo())) {
			StringBuilder builder = new StringBuilder();
			builder.append("Sewerage Connection are not present for ").append(StringUtils.isEmpty(criteria.getConnectionNo()) ? "" : criteria.getConnectionNo())
					.append(" connection no");
			throw new CustomException("INVALID_CONNECTION_ID", builder.toString());
		}
		Map<String, JSONArray> billingSlabMaster = new HashMap<>();
		Map<String, JSONArray> timeBasedExemptionMasterMap = new HashMap<>();
		ArrayList<String> billingSlabIds = new ArrayList<>();

		billingSlabMaster.put(SWCalculationConstant.SW_BILLING_SLAB_MASTER,
				(JSONArray) masterData.get(SWCalculationConstant.SW_BILLING_SLAB_MASTER));
		billingSlabMaster.put(SWCalculationConstant.CALCULATION_ATTRIBUTE_CONST,
				(JSONArray) masterData.get(SWCalculationConstant.CALCULATION_ATTRIBUTE_CONST));
		timeBasedExemptionMasterMap.put(SWCalculationConstant.SW_SEWERAGE_CESS_MASTER,
				(JSONArray) (masterData.getOrDefault(SWCalculationConstant.SW_SEWERAGE_CESS_MASTER, null)));
		BigDecimal sewerageCharge = getSewerageEstimationCharge(criteria.getSewerageConnection(), criteria,
				billingSlabMaster, billingSlabIds, requestInfo);
		List<TaxHeadEstimate> taxHeadEstimates = getEstimatesForTax(sewerageCharge, criteria.getSewerageConnection(),
				timeBasedExemptionMasterMap, RequestInfoWrapper.builder().requestInfo(requestInfo).build());

		Map<String, List> estimatesAndBillingSlabs = new HashMap<>();
		estimatesAndBillingSlabs.put("estimates", taxHeadEstimates);
		estimatesAndBillingSlabs.put("billingSlabIds", billingSlabIds);
		return estimatesAndBillingSlabs;
	}

	private List<TaxHeadEstimate> getEstimatesForTax(BigDecimal sewerageCharge, SewerageConnection connection,
			Map<String, JSONArray> timeBasedExemptionMasterMap, RequestInfoWrapper requestInfoWrapper) {

		List<TaxHeadEstimate> estimates = new ArrayList<>();
		// sewerage_charge
		estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_CHARGE)
				.estimateAmount(sewerageCharge.setScale(2, 2)).build());

		// sewerage cess
		if (timeBasedExemptionMasterMap.get(SWCalculationConstant.SW_SEWERAGE_CESS_MASTER) != null) {
			List<Object> sewerageCessMasterList = timeBasedExemptionMasterMap
					.get(SWCalculationConstant.SW_SEWERAGE_CESS_MASTER);
			BigDecimal sewerageCess = sewerageCessUtil.getSewerageCess(sewerageCharge, SWCalculationConstant.Assesment_Year, sewerageCessMasterList);
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_WATER_CESS)
					.estimateAmount(sewerageCess.setScale(2, 2)).build());
		}
		return estimates;
	}

	/**
	 * method to do a first level filtering on the slabs based on the values
	 * present in the Sewerage Details
	 */

	public BigDecimal getSewerageEstimationCharge(SewerageConnection sewerageConnection, CalculationCriteria criteria,
			Map<String, JSONArray> billingSlabMaster, ArrayList<String> billingSlabIds, RequestInfo requestInfo) {
		BigDecimal sewerageCharge = BigDecimal.ZERO;
		if (billingSlabMaster.get(SWCalculationConstant.SW_BILLING_SLAB_MASTER) == null)
			throw new CustomException("INVALID_BILLING_SLAB", "Billing Slab are Empty");
		List<BillingSlab> mappingBillingSlab;
		try {
			mappingBillingSlab = mapper.readValue(
					billingSlabMaster.get(SWCalculationConstant.SW_BILLING_SLAB_MASTER).toJSONString(),
					mapper.getTypeFactory().constructCollectionType(List.class, BillingSlab.class));
		} catch (IOException e) {
			throw new CustomException("PARSING_ERROR", " Billing Slab can not be parsed!");
		}
		JSONObject calculationAttributeMaster = new JSONObject();
		calculationAttributeMaster.put(SWCalculationConstant.CALCULATION_ATTRIBUTE_CONST,
				billingSlabMaster.get(SWCalculationConstant.CALCULATION_ATTRIBUTE_CONST));
		String calculationAttribute = getCalculationAttribute(calculationAttributeMaster,
				sewerageConnection.getConnectionType());
		List<BillingSlab> billingSlabs = getSlabsFiltered(sewerageConnection, mappingBillingSlab, calculationAttribute,
				requestInfo);

		if (billingSlabs == null || billingSlabs.isEmpty())
			throw new CustomException("INVALID_BILLING_SLAB", "Billing Slab are Empty");
		if (billingSlabs.size() > 1)
			throw new CustomException("INVALID_BILLING_SLAB",
					"More than one billing slab found");
		// Add Billing Slab Ids
		billingSlabIds.add(billingSlabs.get(0).getId());

		// Sewerage Charge Calculation
		Double totalUnite = getCalculationUnit(sewerageConnection, calculationAttribute, criteria);
		if (totalUnite == 0.0)
			return sewerageCharge;
		BillingSlab billSlab = billingSlabs.get(0);
		if (isRangeCalculation(calculationAttribute)) {
			for (Slab slab : billSlab.getSlabs()) {
				if (totalUnite >= slab.getFrom() && totalUnite < slab.getTo()) {
					sewerageCharge = BigDecimal.valueOf((totalUnite * slab.getCharge()));
					if (billSlab.getMinimumCharge() > sewerageCharge.doubleValue()) {
						sewerageCharge = BigDecimal.valueOf(billSlab.getMinimumCharge());
					}
					break;
				}
			}

		} else {
			sewerageCharge = BigDecimal.valueOf(billSlab.getMinimumCharge());
		}
		return sewerageCharge;
	}

	private String getCalculationAttribute(Map<String, Object> calculationAttributeMap, String connectionType) {
		if (calculationAttributeMap == null)
			throw new CustomException("CALCULATION_ATTRIBUTE_MASTER_NOT_FOUND",
					"Calculation attribute master not found!!");
		JSONArray filteredMasters = JsonPath.read(calculationAttributeMap,
				"$.CalculationAttribute[?(@.name=='" + connectionType + "')]");
		JSONObject master = mapper.convertValue(filteredMasters.get(0), JSONObject.class);
		return master.getAsString(SWCalculationConstant.ATTRIBUTE);
	}

	public String getAssessmentYear() {
		LocalDateTime localDateTime = LocalDateTime.now();
		int currentMonth = localDateTime.getMonthValue();
		String assessmentYear;
		if (currentMonth >= 4) {
			assessmentYear = YearMonth.now().getYear() + "-";
			assessmentYear = assessmentYear
					+ (Integer.toString(YearMonth.now().getYear() + 1).substring(2, assessmentYear.length() - 1));
		} else {
			assessmentYear = (YearMonth.now().getYear() - 1) + "-";
			assessmentYear = assessmentYear
					+ (Integer.toString(YearMonth.now().getYear()).substring(2, assessmentYear.length() - 1));
		}
		return assessmentYear;
	}

	/**
	 *
	 * @param assessmentYear - Assessment Year
	 * @param sewerageCharge - Sewerage Charge
	 * @param sewerageConnection - Sewerage connection Object
	 * @param timeBasedExemptionMasterMap - List of time based exemptions master data
	 * @param requestInfoWrapper - Request Info Object
	 * @return - Returns list of TaxHead estimates
	 */
	@SuppressWarnings("unused")
	private List<TaxHeadEstimate> getEstimatesForTax(String assessmentYear, BigDecimal sewerageCharge,
			SewerageConnection sewerageConnection, Map<String, JSONArray> timeBasedExemptionMasterMap,
			RequestInfoWrapper requestInfoWrapper) {
		List<TaxHeadEstimate> estimates = new ArrayList<>();
		// sewerage_charge
		estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_CHARGE)
				.estimateAmount(sewerageCharge.setScale(2, 2)).build());
		return estimates;
	}

	/**
	 * 
	 * @param sewerageConnection - Sewerage Connection Object
	 * @param billingSlabs - List of Billing Slabs
	 * @param requestInfo - Request Info Object
	 * @return List of billing slab based on matching criteria
	 */
	private List<BillingSlab> getSlabsFiltered(SewerageConnection sewerageConnection, List<BillingSlab> billingSlabs,
			String calculationAttribute, RequestInfo requestInfo) {
		
		SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder()
				.sewerageConnection(sewerageConnection).requestInfo(requestInfo).build();
		Property property = sWCalculationUtil.getProperty(sewerageConnectionRequest);
		
		// get billing Slab
		log.debug(" the slabs count : " + billingSlabs.size());
		final String buildingType = (property.getUsageCategory() != null) ? property.getUsageCategory().split("\\.")[0] : "";
		final String connectionType = sewerageConnection.getConnectionType();

		return billingSlabs.stream().filter(slab -> {
			boolean isBuildingTypeMatching = slab.getBuildingType().equalsIgnoreCase(buildingType);
			boolean isConnectionTypeMatching = slab.getConnectionType().equalsIgnoreCase(connectionType);
			boolean isCalculationAttributeMatching = slab.getCalculationAttribute().equalsIgnoreCase(calculationAttribute);
			return isBuildingTypeMatching && isConnectionTypeMatching && isCalculationAttributeMatching;
		}).collect(Collectors.toList());
	}

	private Double getCalculationUnit(SewerageConnection sewerageConnection, String calculationAttribute,
			CalculationCriteria criteria) {
		Double totalUnite = 0.0;
		if (sewerageConnection.getConnectionType().equals(SWCalculationConstant.meteredConnectionType)) {
			return totalUnite;
		} else if (sewerageConnection.getConnectionType().equals(SWCalculationConstant.nonMeterdConnection)
				&& calculationAttribute.equalsIgnoreCase(SWCalculationConstant.noOfToilets)) {
			if (sewerageConnection.getNoOfToilets() == null)
				return totalUnite;
			return new Double(sewerageConnection.getNoOfToilets());
		} else if (sewerageConnection.getConnectionType().equals(SWCalculationConstant.nonMeterdConnection)
				&& calculationAttribute.equalsIgnoreCase(SWCalculationConstant.noOfWaterClosets)) {
			if (sewerageConnection.getNoOfWaterClosets() == null)
				return totalUnite;
			return new Double(sewerageConnection.getNoOfWaterClosets());
		}
		return totalUnite;
	}

	/**
	 * 
	 * @param type
	 *            will be calculation Attribute
	 * @return true if calculation Attribute is not Flat else false
	 */
	private boolean isRangeCalculation(String type) {
		return !type.equalsIgnoreCase(SWCalculationConstant.flatRateCalculationAttribute);
	}

	@SuppressWarnings("rawtypes")
	public Map<String, List> getFeeEstimation(CalculationCriteria criteria, RequestInfo requestInfo,
			Map<String, Object> masterData) {
		String tenantId = requestInfo.getUserInfo().getTenantId();
		if (StringUtils.isEmpty(criteria.getSewerageConnection())
				&& !StringUtils.isEmpty(criteria.getApplicationNo())) {
			SearchCriteria searchCriteria = new SearchCriteria();
			searchCriteria.setApplicationNumber(criteria.getApplicationNo());
			searchCriteria.setTenantId(criteria.getTenantId());
			criteria.setSewerageConnection(
					calculatorUtil.getSewerageConnectionOnApplicationNO(requestInfo, searchCriteria, tenantId));
		}
		if (criteria.getSewerageConnection() == null) {
			throw new CustomException("SEWERAGE_CONNECTION_NOT_FOUND",
					"Sewerage Connection are not present for " + criteria.getApplicationNo() + " Application no");
		}
		ArrayList<String> billingSlabIds = new ArrayList<>();
		billingSlabIds.add("");
		List<TaxHeadEstimate> taxHeadEstimates = getTaxHeadForFeeEstimation(criteria, masterData, requestInfo);
		Map<String, List> estimatesAndBillingSlabs = new HashMap<>();
		estimatesAndBillingSlabs.put("estimates", taxHeadEstimates);
		// //Billing slab id
		estimatesAndBillingSlabs.put("billingSlabIds", billingSlabIds);
		return estimatesAndBillingSlabs;
	}

	/**
	 * 
	 * @param criteria - Calculation Criteria Object
	 * @param masterData - MDMS Master Data
	 * @param requestInfo - Request Info Object
	 * @return return all tax heads
	 */
	private List<TaxHeadEstimate> getTaxHeadForFeeEstimation(CalculationCriteria criteria,
			Map<String, Object> masterData, RequestInfo requestInfo) {
		JSONArray feeSlab = (JSONArray) masterData.getOrDefault(SWCalculationConstant.SC_FEESLAB_MASTER, null);
		if (feeSlab == null)
			throw new CustomException("FEE_SLAB_NOT_FOUND", "fee slab master data not found!!");
		
		Property property = sWCalculationUtil.getProperty(SewerageConnectionRequest.builder()
				.sewerageConnection(criteria.getSewerageConnection()).requestInfo(requestInfo).build());
		
		JSONObject feeObj = mapper.convertValue(feeSlab.get(0), JSONObject.class);
		BigDecimal formFee = BigDecimal.ZERO;
		if (feeObj.get(SWCalculationConstant.FORM_FEE_CONST) != null) {
			formFee = new BigDecimal(feeObj.getAsNumber(SWCalculationConstant.FORM_FEE_CONST).toString());
		}
		BigDecimal scrutinyFee = BigDecimal.ZERO;
		if (feeObj.get(SWCalculationConstant.SCRUTINY_FEE_CONST) != null) {
			scrutinyFee = new BigDecimal(feeObj.getAsNumber(SWCalculationConstant.SCRUTINY_FEE_CONST).toString());
		}
		BigDecimal otherCharges = BigDecimal.ZERO;
		if (feeObj.get(SWCalculationConstant.OTHER_CHARGE_CONST) != null) {
			otherCharges = new BigDecimal(feeObj.getAsNumber(SWCalculationConstant.OTHER_CHARGE_CONST).toString());
		}
		BigDecimal taxAndCessPercentage = BigDecimal.ZERO;
		if (feeObj.get(SWCalculationConstant.TAX_PERCENTAGE_CONST) != null) {
			taxAndCessPercentage = new BigDecimal(
					feeObj.getAsNumber(SWCalculationConstant.TAX_PERCENTAGE_CONST).toString());
		}
		BigDecimal meterCost = BigDecimal.ZERO;
		if (feeObj.get(SWCalculationConstant.METER_COST_CONST) != null
				&& criteria.getSewerageConnection().getConnectionType() != null && criteria.getSewerageConnection()
						.getConnectionType().equalsIgnoreCase(SWCalculationConstant.meteredConnectionType)) {
			meterCost = new BigDecimal(feeObj.getAsNumber(SWCalculationConstant.METER_COST_CONST).toString());
		}
		BigDecimal roadCuttingCharge = BigDecimal.ZERO;
		BigDecimal usageTypeCharge = BigDecimal.ZERO;

		if(criteria.getSewerageConnection().getRoadCuttingInfo() != null){
			for(RoadCuttingInfo roadCuttingInfo : criteria.getSewerageConnection().getRoadCuttingInfo()){
				BigDecimal singleRoadCuttingCharge = BigDecimal.ZERO;
				if (roadCuttingInfo.getRoadType() != null)
					singleRoadCuttingCharge = getChargeForRoadCutting(masterData, roadCuttingInfo.getRoadType(),
							roadCuttingInfo.getRoadCuttingArea());

				BigDecimal singleUsageTypeCharge = BigDecimal.ZERO;
				if (roadCuttingInfo.getRoadCuttingArea() != null)
					singleUsageTypeCharge = getUsageTypeFee(masterData,
							property.getUsageCategory(),
							roadCuttingInfo.getRoadCuttingArea());

				roadCuttingCharge = roadCuttingCharge.add(singleRoadCuttingCharge);
				usageTypeCharge = usageTypeCharge.add(singleUsageTypeCharge);
			}
		}


		BigDecimal roadPlotCharge = BigDecimal.ZERO;
		if (property.getLandArea() != null) {
			roadPlotCharge = getPlotSizeFee(masterData, property.getLandArea());
		}

		BigDecimal totalCharge = formFee.add(scrutinyFee).add(otherCharges).add(meterCost).add(roadCuttingCharge)
				.add(roadPlotCharge).add(usageTypeCharge);
		BigDecimal tax = totalCharge.multiply(taxAndCessPercentage.divide(SWCalculationConstant.HUNDRED));
		//
		List<TaxHeadEstimate> estimates = new ArrayList<>();
		if (!(formFee.compareTo(BigDecimal.ZERO) == 0))
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_FORM_FEE)
					.estimateAmount(formFee.setScale(2, 2)).build());
		if (!(scrutinyFee.compareTo(BigDecimal.ZERO) == 0))
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_SCRUTINY_FEE)
					.estimateAmount(scrutinyFee.setScale(2, 2)).build());
		if (!(otherCharges.compareTo(BigDecimal.ZERO) == 0))
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_OTHER_CHARGE)
					.estimateAmount(otherCharges.setScale(2, 2)).build());
		if (!(roadCuttingCharge.compareTo(BigDecimal.ZERO) == 0))
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_ROAD_CUTTING_CHARGE)
					.estimateAmount(roadCuttingCharge.setScale(2, 2)).build());
		if (!(usageTypeCharge.compareTo(BigDecimal.ZERO) == 0))
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_ONE_TIME_FEE)
					.estimateAmount(usageTypeCharge.setScale(2, 2)).build());
		if (!(roadPlotCharge.compareTo(BigDecimal.ZERO) == 0))
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_SECURITY_CHARGE)
					.estimateAmount(roadPlotCharge.setScale(2, 2)).build());
		if (!(tax.compareTo(BigDecimal.ZERO) == 0))
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_TAX_AND_CESS)
					.estimateAmount(tax.setScale(2, 2)).build());
		addAdhocPenaltyAndRebate(estimates, criteria.getSewerageConnection());
		return estimates;
	}

	
	/**
	 * Enrich the adhoc penalty and adhoc rebate
	 * 
	 * @param estimates
	 *            tax head estimate
	 * @param connection
	 *            water connection object
	 */
	@SuppressWarnings({ "unchecked" })
	private void addAdhocPenaltyAndRebate(List<TaxHeadEstimate> estimates, SewerageConnection connection) {
		if (connection.getAdditionalDetails() != null) {
			HashMap<String, Object> additionalDetails = mapper.convertValue(connection.getAdditionalDetails(),
					HashMap.class);
			if (additionalDetails.getOrDefault(SWCalculationConstant.ADHOC_PENALTY, null) != null) {
				estimates.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_ADHOC_PENALTY)
						.estimateAmount(
								new BigDecimal(additionalDetails.get(SWCalculationConstant.ADHOC_PENALTY).toString()))
						.build());
			}
			if (additionalDetails.getOrDefault(SWCalculationConstant.ADHOC_REBATE, null) != null) {
				estimates
						.add(TaxHeadEstimate.builder().taxHeadCode(SWCalculationConstant.SW_ADHOC_REBATE)
								.estimateAmount(new BigDecimal(
										additionalDetails.get(SWCalculationConstant.ADHOC_REBATE).toString()).negate())
								.build());
			}
		}
	}
	/**
	 * 
	 * @param masterData - MDMS Master Data
	 * @param roadType - Road Type value
	 * @param roadCuttingArea - Road Cutting Area value
	 * @return road cutting charge
	 */
	private BigDecimal getChargeForRoadCutting(Map<String, Object> masterData, String roadType, Float roadCuttingArea) {
		JSONArray roadSlab = (JSONArray) masterData.getOrDefault(SWCalculationConstant.SC_ROADTYPE_MASTER, null);
		BigDecimal charge = BigDecimal.ZERO;
		BigDecimal cuttingArea = new BigDecimal(
				roadCuttingArea == null ? BigDecimal.ZERO.toString() : roadCuttingArea.toString());
		JSONObject masterSlab = new JSONObject();
		if (roadSlab != null) {
			masterSlab.put("RoadType", roadSlab);
			JSONArray filteredMasters = JsonPath.read(masterSlab, "$.RoadType[?(@.code=='" + roadType + "')]");
			if (CollectionUtils.isEmpty(filteredMasters))
				return charge;
			JSONObject master = mapper.convertValue(filteredMasters.get(0), JSONObject.class);
			charge = new BigDecimal(master.getAsNumber(SWCalculationConstant.UNIT_COST_CONST).toString());
			charge = charge.multiply(cuttingArea);
		}
		return charge;
	}

	/**
	 * 
	 * @param masterData - MDMS Master Data
	 * @param plotSize - Plot Size
	 * @return get fee based on plot size
	 */
	private BigDecimal getPlotSizeFee(Map<String, Object> masterData, Double plotSize) {
		BigDecimal charge = BigDecimal.ZERO;
		JSONArray plotSlab = (JSONArray) masterData.getOrDefault(SWCalculationConstant.SC_PLOTSLAB_MASTER, null);
		JSONObject masterSlab = new JSONObject();
		if (plotSlab != null) {
			masterSlab.put("PlotSizeSlab", plotSlab);
			JSONArray filteredMasters = JsonPath.read(masterSlab,
					"$.PlotSizeSlab[?(@.from <=" + plotSize + "&& @.to > " + plotSize + ")]");
			if (CollectionUtils.isEmpty(filteredMasters))
				return charge;
			JSONObject master = mapper.convertValue(filteredMasters.get(0), JSONObject.class);
			charge = new BigDecimal(master.getAsNumber(SWCalculationConstant.UNIT_COST_CONST).toString());
		}
		return charge;
	}

	/**
	 * 
	 * @param masterData - MDMS Master Data
	 * @param usageType - Usage Type
	 * @param roadCuttingArea - Road Cutting Area
	 * @return - Returns the Usage Type fee
	 */
	private BigDecimal getUsageTypeFee(Map<String, Object> masterData, String usageType, Float roadCuttingArea) {
		BigDecimal charge = BigDecimal.ZERO;
		JSONArray usageSlab = (JSONArray) masterData.getOrDefault(SWCalculationConstant.SC_PROPERTYUSAGETYPE_MASTER,
				null);
		JSONObject masterSlab = new JSONObject();
		BigDecimal cuttingArea = new BigDecimal(roadCuttingArea.toString());
		if (usageSlab != null) {
			masterSlab.put("PropertyUsageType", usageSlab);
			JSONArray filteredMasters = JsonPath.read(masterSlab,
					"$.PropertyUsageType[?(@.code=='" + usageType + "')]");
			if (CollectionUtils.isEmpty(filteredMasters))
				return charge;
			JSONObject master = mapper.convertValue(filteredMasters.get(0), JSONObject.class);
			charge = new BigDecimal(master.getAsNumber(SWCalculationConstant.UNIT_COST_CONST).toString());
			charge = charge.multiply(cuttingArea);
		}
		return charge;
	}
	
	public Map<String, Object> getQuarterStartAndEndDate(Map<String, Object> billingPeriod){
		Date date = new Date();
		Calendar fromDateCalendar = Calendar.getInstance();
		fromDateCalendar.setTime(date);
		fromDateCalendar.set(Calendar.MONTH, fromDateCalendar.get(Calendar.MONTH)/3 * 3);
		fromDateCalendar.set(Calendar.DAY_OF_MONTH, 1);
		setTimeToBeginningOfDay(fromDateCalendar);
		Calendar toDateCalendar = Calendar.getInstance();
		toDateCalendar.setTime(date);
		toDateCalendar.set(Calendar.MONTH, toDateCalendar.get(Calendar.MONTH)/3 * 3 + 2);
		toDateCalendar.set(Calendar.DAY_OF_MONTH, toDateCalendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		setTimeToEndOfDay(toDateCalendar);
		billingPeriod.put(SWCalculationConstant.STARTING_DATE_APPLICABLES, fromDateCalendar.getTimeInMillis());
		billingPeriod.put(SWCalculationConstant.ENDING_DATE_APPLICABLES, toDateCalendar.getTimeInMillis());
		return billingPeriod;
	}
	
	public Map<String, Object> getMonthStartAndEndDate(Map<String, Object> billingPeriod){
		Date date = new Date();
		Calendar monthStartDate = Calendar.getInstance();
		monthStartDate.setTime(date);
		monthStartDate.set(Calendar.DAY_OF_MONTH, monthStartDate.getActualMinimum(Calendar.DAY_OF_MONTH));
		setTimeToBeginningOfDay(monthStartDate);
	    
		Calendar monthEndDate = Calendar.getInstance();
		monthEndDate.setTime(date);
		monthEndDate.set(Calendar.DAY_OF_MONTH, monthEndDate.getActualMaximum(Calendar.DAY_OF_MONTH));
		setTimeToEndOfDay(monthEndDate);
		billingPeriod.put(SWCalculationConstant.STARTING_DATE_APPLICABLES, monthStartDate.getTimeInMillis());
		billingPeriod.put(SWCalculationConstant.ENDING_DATE_APPLICABLES, monthEndDate.getTimeInMillis());
		return billingPeriod;
	}
	
	private static void setTimeToBeginningOfDay(Calendar calendar) {
	    calendar.set(Calendar.HOUR_OF_DAY, 0);
	    calendar.set(Calendar.MINUTE, 0);
	    calendar.set(Calendar.SECOND, 0);
	    calendar.set(Calendar.MILLISECOND, 0);
	}

	private static void setTimeToEndOfDay(Calendar calendar) {
	    calendar.set(Calendar.HOUR_OF_DAY, 23);
	    calendar.set(Calendar.MINUTE, 59);
	    calendar.set(Calendar.SECOND, 59);
	    calendar.set(Calendar.MILLISECOND, 999);
	}
}
