package org.egov.wscalculation.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.MdmsResponse;
import org.egov.tracer.model.CustomException;
import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.web.models.CalculationCriteria;
import org.egov.wscalculation.web.models.RequestInfoWrapper;
import org.egov.wscalculation.web.models.TaxHeadMaster;
import org.egov.wscalculation.web.models.TaxHeadMasterResponse;
import org.egov.wscalculation.web.models.TaxPeriod;
import org.egov.wscalculation.web.models.TaxPeriodResponse;
import org.egov.wscalculation.repository.ServiceRequestRepository;
import org.egov.wscalculation.util.CalculatorUtil;
import org.egov.wscalculation.util.WSCalculationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
@Slf4j
@Service
public class MasterDataService {

	@Autowired
	private ServiceRequestRepository repository;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private WSCalculationUtil wSCalculationUtil;

	@Autowired
	private WSCalculationConfiguration config;

	@Autowired
	private CalculatorUtil calculatorUtils;
	
	@Autowired
	private EstimationService estimationService;

	/**
	 * Fetches and creates map of all required masters
	 * 
	 * @param requestInfo The calculation request
	 * @param tenantId Tenant Id
	 * @param serviceFieldValue Service Field value
	 * @return Returns the MDMS Master Map
	 */
	public Map<String, Object> getMasterMap(RequestInfo requestInfo, String tenantId, String serviceFieldValue) {
		Map<String, Object> masterMap = new HashMap<>();
		List<TaxPeriod> taxPeriods = getTaxPeriodList(requestInfo, tenantId, serviceFieldValue);
		List<TaxHeadMaster> taxHeadMasters = getTaxHeadMasterMap(requestInfo, tenantId, serviceFieldValue);
		Map<String, Map<String, Object>> financialYearMaster = getFinancialYear(requestInfo, tenantId);
		masterMap.put(WSCalculationConstant.TAXPERIOD_MASTER_KEY, taxPeriods);
		masterMap.put(WSCalculationConstant.TAXHEADMASTER_MASTER_KEY, taxHeadMasters);
		masterMap.put(WSCalculationConstant.FINANCIALYEAR_MASTER_KEY, financialYearMaster);
		return masterMap;
	}

	/**
	 * Fetch Tax Head Masters From billing service
	 * 
	 * @param requestInfo - Request Info
	 * @param tenantId - Tenant ID
	 * @return - Returns the list of TaxPeriod
	 */
	public List<TaxPeriod> getTaxPeriodList(RequestInfo requestInfo, String tenantId, String serviceFieldValue) {
		TaxPeriodResponse res = mapper.convertValue(
				repository.fetchResult(wSCalculationUtil.getTaxPeriodSearchUrl(tenantId, serviceFieldValue),
						RequestInfoWrapper.builder().requestInfo(requestInfo).build()),
				TaxPeriodResponse.class);
		return res.getTaxPeriods();
	}

	/**
	 * Fetch Tax Head Masters From billing service
	 * 
	 * @param requestInfo - Request Info
	 * @param tenantId - Tenant ID
	 * @return - Returns the list of TaxHeadMaster details
	 */
	public List<TaxHeadMaster> getTaxHeadMasterMap(RequestInfo requestInfo, String tenantId, String serviceFieldValue) {
		TaxHeadMasterResponse res = mapper.convertValue(
				repository.fetchResult(wSCalculationUtil.getTaxHeadSearchUrl(tenantId, serviceFieldValue),
						RequestInfoWrapper.builder().requestInfo(requestInfo).build()),
				TaxHeadMasterResponse.class);
		return res.getTaxHeadMasters();
	}

	/**
	 * 
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant ID
	 * @param billingSlabMaster - Billing Slab Master Data
	 * @param timeBasedExemptionMasterMap - Time Based Exemption Master Data
	 */
	public void setWaterConnectionMasterValues(RequestInfo requestInfo, String tenantId,
			Map<String, JSONArray> billingSlabMaster, Map<String, JSONArray> timeBasedExemptionMasterMap) {

		MdmsResponse response = mapper.convertValue(repository.fetchResult(calculatorUtils.getMdmsSearchUrl(),
				calculatorUtils.getWaterConnectionModuleRequest(requestInfo, tenantId)), MdmsResponse.class);
		Map<String, JSONArray> res = response.getMdmsRes().get(WSCalculationConstant.WS_TAX_MODULE);
		for (Entry<String, JSONArray> entry : res.entrySet()) {

			String masterName = entry.getKey();

			/* Masters which need to be parsed will be contained in the list */
			if (WSCalculationConstant.WS_BILLING_SLAB_MASTERS.contains(entry.getKey()))
				billingSlabMaster.put(masterName, entry.getValue());

			/* Master not contained in list will be stored as it is */
			timeBasedExemptionMasterMap.put(entry.getKey(), entry.getValue());
		}
	}
	
	 /**
	  * 
	  * @param requestInfo - Request Info
	  * @param tenantId - TenantId
	  * @param masterMap - Master MDMS Data
	  */
	public void loadBillingSlabsAndTimeBasedExemptions(RequestInfo requestInfo, String tenantId,
			Map<String, Object> masterMap) {

		MdmsResponse response = mapper.convertValue(repository.fetchResult(calculatorUtils.getMdmsSearchUrl(),
				calculatorUtils.getWaterConnectionModuleRequest(requestInfo, tenantId)), MdmsResponse.class);
		Map<String, JSONArray> res = response.getMdmsRes().get(WSCalculationConstant.WS_TAX_MODULE);
		for (Entry<String, JSONArray> entry : res.entrySet()) {

			String masterName = entry.getKey();

			/* Masters which need to be parsed will be contained in the list */
			if (WSCalculationConstant.WS_BILLING_SLAB_MASTERS.contains(entry.getKey()))
				masterMap.put(masterName, entry.getValue());

			/* Master not contained in list will be stored as it is */
			masterMap.put(entry.getKey(), entry.getValue());
		}
	}

	/**
	 * Fetches Financial Year from MDMS Api
	 *
	 * @param requestInfo RequestInfo
	 * @param tenantId Tenant Id
	 * @return Returns the Financial Year details
	 */
	public Map<String, Map<String, Object>> getFinancialYear(RequestInfo requestInfo, String tenantId) {
		Set<String> assessmentYears = new HashSet<>(1);
		assessmentYears.add(estimationService.getAssessmentYear());
		MdmsCriteriaReq mdmsCriteriaReq = calculatorUtils.getFinancialYearRequest(requestInfo, assessmentYears,
				tenantId);
		StringBuilder url = calculatorUtils.getMdmsSearchUrl();
		Object res = repository.fetchResult(url, mdmsCriteriaReq);
		Map<String, Map<String, Object>> financialYearMap = new HashMap<>();
		for (String assessmentYear : assessmentYears) {
			String jsonPath = WSCalculationConstant.MDMS_FINACIALYEAR_PATH.replace("{}", assessmentYear);
			try {
				List<Map<String, Object>> jsonOutput = JsonPath.read(res, jsonPath);
				Map<String, Object> financialYearProperties = jsonOutput.get(0);
				financialYearMap.put(assessmentYear, financialYearProperties);
			} catch (IndexOutOfBoundsException e) {
				throw new CustomException(WSCalculationConstant.EG_WS_FINANCIAL_MASTER_NOT_FOUND,
						WSCalculationConstant.EG_WS_FINANCIAL_MASTER_NOT_FOUND_MSG + assessmentYear);
			}
		}
		return financialYearMap;
	}
	
	/**
	 *
	 * @param criteria - Calculation Criteria
	 * @param mdmsResponse - MDMS Response
	 * @param masterMap - MDMS Master Data
	 * @return master map with date period
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> enrichBillingPeriod(CalculationCriteria criteria, ArrayList<?> mdmsResponse,
			Map<String, Object> masterMap, String connectiontype) {
		log.info("Billing Frequency Map {}", mdmsResponse.toString());
		Map<String, Object> master = new HashMap<>();
		for (Object o : mdmsResponse) {
			if ((((Map<String, Object>) o).get(WSCalculationConstant.ConnectionType).toString())
					.equalsIgnoreCase(connectiontype)) {
				master = (Map<String, Object>) o;
				break;
			}
		}
		Map<String, Object> billingPeriod = new HashMap<>();
		if (master.get(WSCalculationConstant.ConnectionType).toString()
				.equalsIgnoreCase(WSCalculationConstant.meteredConnectionType)) {
			billingPeriod.put(WSCalculationConstant.STARTING_DATE_APPLICABLES, criteria.getFrom());
			billingPeriod.put(WSCalculationConstant.ENDING_DATE_APPLICABLES, criteria.getTo());
		} else {
			if (WSCalculationConstant.Monthly_Billing_Period
					.equalsIgnoreCase(master.get(WSCalculationConstant.Billing_Cycle_String).toString())) {
				estimationService.getMonthStartAndEndDate(billingPeriod);
			} else if (WSCalculationConstant.Quaterly_Billing_Period
					.equalsIgnoreCase(master.get(WSCalculationConstant.Billing_Cycle_String).toString())) {
				estimationService.getQuarterStartAndEndDate(billingPeriod);
			} else {
				LocalDateTime demandEndDate = LocalDateTime.now();
				demandEndDate = setCurrentDateValueToStartingOfDay(demandEndDate);
				Long endDaysMillis = (Long) master.get(WSCalculationConstant.Demand_End_Date_String);

				billingPeriod.put(WSCalculationConstant.STARTING_DATE_APPLICABLES,
						Timestamp.valueOf(demandEndDate).getTime() - endDaysMillis);
				billingPeriod.put(WSCalculationConstant.ENDING_DATE_APPLICABLES,
						Timestamp.valueOf(demandEndDate).getTime());
			}
		}
		log.info("Demand Expiry Date : {}", master.get(WSCalculationConstant.Demand_Expiry_Date_String));
		BigInteger expiryDate = new BigInteger(
				String.valueOf(master.get(WSCalculationConstant.Demand_Expiry_Date_String)));
		Long demandExpiryDateMillis = expiryDate.longValue();
		billingPeriod.put(WSCalculationConstant.Demand_Expiry_Date_String, demandExpiryDateMillis);
		masterMap.put(WSCalculationConstant.BILLING_PERIOD, billingPeriod);
		return masterMap;
	}
	/**
	 * 
	 * @param masterMap - MDMS master data
	 * @return master map contains demand start date, end date and expiry date
	 */
	public Map<String, Object> enrichBillingPeriodForFee(Map<String, Object> masterMap) {
		Map<String, Object> billingPeriod = new HashMap<>();
		billingPeriod.put(WSCalculationConstant.STARTING_DATE_APPLICABLES, System.currentTimeMillis());
		billingPeriod.put(WSCalculationConstant.ENDING_DATE_APPLICABLES,
				System.currentTimeMillis() + WSCalculationConstant.APPLICATION_FEE_DEMAND_END_DATE);
		billingPeriod.put(WSCalculationConstant.Demand_Expiry_Date_String, WSCalculationConstant.APPLICATION_FEE_DEMAND_EXP_DATE);
		masterMap.put(WSCalculationConstant.BILLING_PERIOD, billingPeriod);
		return masterMap;
	}

	/**
	 * 
	 * @param assessmentYear Assessment year
	 * @param masterList master list for that applicable
	 * @return master data for that assessment Year
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> getApplicableMaster(String assessmentYear, List<Object> masterList) {

		Map<String, Object> objToBeReturned = null;
		String maxYearFromTheList = "0";
		long maxStartTime = 0L;

		for (Object object : masterList) {

			Map<String, Object> objMap = (Map<String, Object>) object;
			String objFinYear = ((String) objMap.get(WSCalculationConstant.FROMFY_FIELD_NAME)).split("-")[0];
			if (!objMap.containsKey(WSCalculationConstant.STARTING_DATE_APPLICABLES)) {
				if (objFinYear.compareTo(assessmentYear.split("-")[0]) == 0)
					return objMap;

				else if (assessmentYear.split("-")[0].compareTo(objFinYear) > 0
						&& maxYearFromTheList.compareTo(objFinYear) <= 0) {
					maxYearFromTheList = objFinYear;
					objToBeReturned = objMap;
				}
			} else {
				String objStartDay = ((String) objMap.get(WSCalculationConstant.STARTING_DATE_APPLICABLES));
				if (assessmentYear.split("-")[0].compareTo(objFinYear) >= 0
						&& maxYearFromTheList.compareTo(objFinYear) <= 0) {
					maxYearFromTheList = objFinYear;
					long startTime = getStartDayInMillis(objStartDay);
					long currentTime = System.currentTimeMillis();
					if (startTime < currentTime && maxStartTime < startTime) {
						objToBeReturned = objMap;
						maxStartTime = startTime;
					}
				}
			}
		}
		return objToBeReturned;
	}

	/**
	 * Converts startDay to epoch
	 * 
	 * @param startDay
	 *            StartDay of applicable
	 * @return Returns the start date in milli seconds
	 */
	private Long getStartDayInMillis(String startDay) {
		Date date;
		try {
			SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
			 date = df.parse(startDay);
		} catch (ParseException e) {
			throw new CustomException("INVALID_START_DAY", "The startDate of the penalty cannot be parsed");
		}

		return date.getTime();
	}

	/**
	 * Method to calculate exemption based on the Amount and exemption map
	 * 
	 * @param applicableAmount Application Amount
	 * @param config Tax Head Object
	 * @return Returns the calculated Amount
	 */
	public BigDecimal calculateApplicable(BigDecimal applicableAmount, Object config) {

		BigDecimal currentApplicable = BigDecimal.ZERO;

		if (null == config)
			return currentApplicable;

		@SuppressWarnings("unchecked")
		Map<String, Object> configMap = (Map<String, Object>) config;

		BigDecimal rate = null != configMap.get(WSCalculationConstant.RATE_FIELD_NAME)
				? BigDecimal.valueOf(((Number) configMap.get(WSCalculationConstant.RATE_FIELD_NAME)).doubleValue())
				: null;

		BigDecimal maxAmt = null != configMap.get(WSCalculationConstant.MAX_AMOUNT_FIELD_NAME) ? BigDecimal
				.valueOf(((Number) configMap.get(WSCalculationConstant.MAX_AMOUNT_FIELD_NAME)).doubleValue()) : null;

		BigDecimal minAmt = null != configMap.get(WSCalculationConstant.MIN_AMOUNT_FIELD_NAME) ? BigDecimal
				.valueOf(((Number) configMap.get(WSCalculationConstant.MIN_AMOUNT_FIELD_NAME)).doubleValue()) : null;

		BigDecimal flatAmt = null != configMap.get(WSCalculationConstant.FLAT_AMOUNT_FIELD_NAME)
				? BigDecimal
						.valueOf(((Number) configMap.get(WSCalculationConstant.FLAT_AMOUNT_FIELD_NAME)).doubleValue())
				: BigDecimal.ZERO;

		if (null == rate)
			currentApplicable = flatAmt.compareTo(applicableAmount) > 0 ? applicableAmount : flatAmt;
		else {
			currentApplicable = applicableAmount.multiply(rate.divide(WSCalculationConstant.HUNDRED));

			if (null != maxAmt && BigDecimal.ZERO.compareTo(maxAmt) < 0 && currentApplicable.compareTo(maxAmt) > 0)
				currentApplicable = maxAmt;
			else if (null != minAmt && currentApplicable.compareTo(minAmt) < 0)
				currentApplicable = minAmt;
		}
		return currentApplicable;
	}

	public LocalDateTime setCurrentDateValueToStartingOfDay(LocalDateTime localDateTime) {
		return localDateTime.withHour(0).withMinute(0).withSecond(0).withNano(0);
	}
	
	public JSONArray getMasterListOfReceiver(RequestInfo requestInfo, String tenantId) {
		ArrayList<String> masterDetails = new ArrayList<>();
		masterDetails.add(WSCalculationConstant.SMS_RECIEVER_MASTER);
		MdmsResponse response = mapper.convertValue(
				repository.fetchResult(calculatorUtils.getMdmsSearchUrl(), calculatorUtils
						.getMdmsReqCriteria(requestInfo, tenantId, masterDetails, WSCalculationConstant.WS_TAX_MODULE)),
				MdmsResponse.class);
		Map<String, JSONArray> res = response.getMdmsRes().get(WSCalculationConstant.WS_TAX_MODULE);
		return res.get(WSCalculationConstant.SMS_RECIEVER_MASTER);
	}
	
	/**
	 * 
	 * @param requestInfo RequestInfo
	 * @param tenantId TenantId
	 * @return all masters that is needed for calculation and demand generation.
	 */
	@Cacheable(value = WSCalculationConstant.MDMS_CACHE_KEY , sync = true)
	public Map<String, Object> loadMasterData(RequestInfo requestInfo, String tenantId) {
		Map<String, Object> master = getMasterMap(requestInfo, tenantId, WSCalculationConstant.SERVICE_FIELD_VALUE_WS);
		loadBillingSlabsAndTimeBasedExemptions(requestInfo, tenantId, master);
		loadBillingFrequencyMasterData(requestInfo, tenantId, master);
		return master;
	}
	
	/**
	 * 
	 * @param requestInfo Request Info
	 * @param tenantId Tenant Id
	 * @param masterMap MDMS Data
	 * @return Master For Billing Period
	 */
	public Map<String, Object> loadBillingFrequencyMasterData(RequestInfo requestInfo, String tenantId, Map<String, Object> masterMap) {
		MdmsCriteriaReq mdmsCriteriaReq = calculatorUtils.getBillingFrequency(requestInfo, tenantId);
		Object res = repository.fetchResult(calculatorUtils.getMdmsSearchUrl(), mdmsCriteriaReq);
		if (res == null) {
			throw new CustomException("MDMS_ERROR_FOR_BILLING_FREQUENCY", "Failed to fetch the billing frequency");
		}
		ArrayList<?> mdmsResponse = JsonPath.read(res, WSCalculationConstant.JSONPATH_ROOT_FOR_BilingPeriod);
		masterMap.put(WSCalculationConstant.Billing_Period_Master, mdmsResponse);
		return masterMap;
	}
	
	/**
	 * 
	 * @param requestInfo RequestInfo
	 * @param tenantId TenantId
	 * @return masterMap return master data with exception master data
	 */
	public Map<String, Object> loadExemptionMaster(RequestInfo requestInfo, String tenantId) {
		Map<String, Object> master = getMasterMap(requestInfo, tenantId, WSCalculationConstant.ONE_TIME_FEE_SERVICE_FIELD);
		MdmsResponse response = mapper.convertValue(
				repository.fetchResult(calculatorUtils.getMdmsSearchUrl(),
						calculatorUtils.getEstimationMasterCriteria(requestInfo, tenantId)),
				MdmsResponse.class);
		Map<String, JSONArray> res = response.getMdmsRes().get(WSCalculationConstant.WS_TAX_MODULE);
		for (Map.Entry<String, JSONArray> resp : res.entrySet()) {
			master.put(resp.getKey(), resp.getValue());
		}
		return master;
	}
	
}
