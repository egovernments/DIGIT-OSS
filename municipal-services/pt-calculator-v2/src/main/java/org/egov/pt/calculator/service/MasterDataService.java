package org.egov.pt.calculator.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.jayway.jsonpath.JsonPath;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.MdmsResponse;
import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.web.models.CalculationCriteria;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.demand.TaxHeadMaster;
import org.egov.pt.calculator.web.models.demand.TaxHeadMasterResponse;
import org.egov.pt.calculator.web.models.demand.TaxPeriod;
import org.egov.pt.calculator.web.models.demand.TaxPeriodResponse;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.minidev.json.JSONArray;

import static org.egov.pt.calculator.util.CalculatorConstants.*;

@Service
public class MasterDataService {

	@Autowired
	private Repository repository;
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private CalculatorUtils calculatorUtils;

	@Autowired
	private Configurations config;
	
	/**
	 * Fetches Financial Year from Mdms Api
	 * 
	 * @param requestInfo
	 * @param assessmentYear
	 * @param tenantId
	 * @return
	 */
	@SuppressWarnings("unchecked") 
	public Map<String, Object> getFinancialYear(RequestInfo requestInfo, String assessmentYear, String tenantId) {

		MdmsCriteriaReq mdmsCriteriaReq = calculatorUtils.getFinancialYearRequest(requestInfo, assessmentYear, tenantId);
		StringBuilder url = calculatorUtils.getMdmsSearchUrl();
		MdmsResponse res = mapper.convertValue(repository.fetchResult(url, mdmsCriteriaReq), MdmsResponse.class);
		try {
			return (Map<String, Object>) res.getMdmsRes().get(CalculatorConstants.FINANCIAL_MODULE)
					.get(CalculatorConstants.FINANCIAL_YEAR_MASTER).get(0);
		}catch (IndexOutOfBoundsException e){
			throw new CustomException(CalculatorConstants.EG_PT_FINANCIAL_MASTER_NOT_FOUND, CalculatorConstants.EG_PT_FINANCIAL_MASTER_NOT_FOUND_MSG + assessmentYear);
		}
	}

	/**
	 * Fetches Financial Year from Mdms Api
	 *
	 * @param requestInfo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String,Map<String, Object>> getFinancialYear(String tenantId,RequestInfo requestInfo,Set<String> assessmentYears) {
		MdmsCriteriaReq mdmsCriteriaReq = calculatorUtils.getFinancialYearRequest(requestInfo, assessmentYears, tenantId);
		StringBuilder url = calculatorUtils.getMdmsSearchUrl();
		Object res = repository.fetchResult(url, mdmsCriteriaReq);
		Map<String,Map<String, Object>> financialYearMap = new HashMap<>();
		for(String assessmentYear : assessmentYears){
			String jsonPath = MDMS_FINACIALYEAR_PATH.replace("{}",assessmentYear);
			try {
				List<Map<String,Object>> jsonOutput =  JsonPath.read(res, jsonPath);
				Map<String,Object> financialYearProperties = jsonOutput.get(0);
				financialYearMap.put(assessmentYear,financialYearProperties);
			}
			catch (IndexOutOfBoundsException e){
				throw new CustomException(CalculatorConstants.EG_PT_FINANCIAL_MASTER_NOT_FOUND, CalculatorConstants.EG_PT_FINANCIAL_MASTER_NOT_FOUND_MSG + assessmentYear);
			}
		}
		return financialYearMap;
	}
	
	/**
	 * Fetch Tax Head Masters From billing service
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public List<TaxHeadMaster> getTaxHeadMasterMap(RequestInfo requestInfo, String tenantId) {

		StringBuilder uri = calculatorUtils.getTaxHeadSearchUrl(tenantId);
		TaxHeadMasterResponse res = mapper.convertValue(
				repository.fetchResult(uri, RequestInfoWrapper.builder().requestInfo(requestInfo).build()),
				TaxHeadMasterResponse.class);
		return res.getTaxHeadMasters();
	}

	/**
	 * Fetch Tax Head Masters From billing service
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public List<TaxPeriod> getTaxPeriodList(RequestInfo requestInfo, String tenantId) {

		StringBuilder uri = calculatorUtils.getTaxPeriodSearchUrl(tenantId);
		TaxPeriodResponse res = mapper.convertValue(
				repository.fetchResult(uri, RequestInfoWrapper.builder().requestInfo(requestInfo).build()),
				TaxPeriodResponse.class);
		return res.getTaxPeriods();
	}
	
	/**
	 * Method to enrich the property Master data Map
	 * 
	 * @param requestInfo
	 * @param tenantId
	 */
	public void setPropertyMasterValues(RequestInfo requestInfo, String tenantId,
			Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap, Map<String, JSONArray> timeBasedExemptionMasterMap) {

		MdmsResponse response = mapper.convertValue(repository.fetchResult(calculatorUtils.getMdmsSearchUrl(),
				calculatorUtils.getPropertyModuleRequest(requestInfo, tenantId)), MdmsResponse.class);
		Map<String, JSONArray> res = response.getMdmsRes().get(CalculatorConstants.PROPERTY_TAX_MODULE);
		for (Entry<String, JSONArray> entry : res.entrySet()) {

			String masterName = entry.getKey();
			
			/* Masters which need to be parsed will be contained in the list */
			if (CalculatorConstants.PROPERTY_BASED_EXEMPTION_MASTERS.contains(entry.getKey()))
				propertyBasedExemptionMasterMap.put(masterName, getParsedMaster(entry));
			
			/* Master not contained in list will be stored as it is  */
			timeBasedExemptionMasterMap.put(entry.getKey(), entry.getValue());
		}
	}
	
	/**
	 * Parses the master which has an exemption in them
	 * @param entry
	 * @return
	 */
	private Map<String, List<Object>> getParsedMaster(Entry<String, JSONArray> entry) {
		
		JSONArray values = entry.getValue();
		Map<String, List<Object>> codeValueListMap = new HashMap<>();
		for (Object object : values) {

			@SuppressWarnings("unchecked")
			Map<String, Object> objectMap = (Map<String, Object>) object;
			String code = (String) objectMap.get(CalculatorConstants.CODE_FIELD_NAME);
			if (null == codeValueListMap.get(code)) {

				List<Object> valuesList = new ArrayList<>();
				valuesList.add(objectMap);
				codeValueListMap.put(code, valuesList);
			} else {
				codeValueListMap.get(code).add(objectMap);
			}
		}
		return codeValueListMap;
	}

	/**
	 * Returns the 'APPLICABLE' master object from the list of inputs
	 *
	 * filters the Input based on their effective financial year and starting day
	 *
	 * If an object is found with effective year same as assessment year that master entity will be returned
	 *
	 * If exact match is not found then the entity with latest effective financial year which should be lesser than the assessment year
	 *
	 * NOTE : applicable points to single object  out of all the entries for a given master which fits the period of the property being assessed
	 *
	 * @param assessmentYear
	 * @param masterList
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> getApplicableMaster(String assessmentYear, List<Object> masterList) {

		Map<String, Object> objToBeReturned = null;
		String maxYearFromTheList = "0";
		Long maxStartTime = 0l;

		for (Object object : masterList) {

			Map<String, Object> objMap = (Map<String, Object>) object;
			String objFinYear = ((String) objMap.get(CalculatorConstants.FROMFY_FIELD_NAME)).split("-")[0];
			if(!objMap.containsKey(CalculatorConstants.STARTING_DATE_APPLICABLES)){
				if (objFinYear.compareTo(assessmentYear.split("-")[0]) == 0)
					return  objMap;

				else if (assessmentYear.split("-")[0].compareTo(objFinYear) > 0 && maxYearFromTheList.compareTo(objFinYear) <= 0) {
					maxYearFromTheList = objFinYear;
					objToBeReturned = objMap;
				}
			}
			else{
				String objStartDay = ((String) objMap.get(CalculatorConstants.STARTING_DATE_APPLICABLES));
				if (assessmentYear.split("-")[0].compareTo(objFinYear) >= 0 && maxYearFromTheList.compareTo(objFinYear) <= 0) {
					maxYearFromTheList = objFinYear;
					Long startTime = getStartDayInMillis(objStartDay);
					Long currentTime = System.currentTimeMillis();
					if(startTime < currentTime && maxStartTime < startTime){
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
	 * @param startDay StartDay of applicable
	 * @return
	 */
	private Long getStartDayInMillis(String startDay){

		Long startTime = null;
		try{
			SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
			Date date = df.parse(startDay);
			startTime = date.getTime();
		}
		catch (ParseException e) {
			throw new CustomException("INVALID STARTDAY","The startDate of the penalty cannot be parsed");
		}

		return startTime;
	}
	/**
	 * Estimates the fire cess that needs to be paid for the given tax amount
	 * 
	 * Returns Zero if no data is found for the given criteria
	 * 
	 * @param payableTax
	 * @param assessmentYear
	 * @return
	 */
	public BigDecimal getCess(BigDecimal payableTax, String assessmentYear,List<Object> masterList) {
		BigDecimal fireCess = BigDecimal.ZERO;

		if (payableTax.doubleValue() == 0.0)
			return fireCess;

		Map<String, Object> CessMap = getApplicableMaster(assessmentYear,masterList);

		return calculateApplicables(payableTax, CessMap);
	}
	
	/**
	 * Method to calculate exmeption based on the Amount and exemption map
	 * 
	 * @param applicableAmount
	 * @param config
	 * @return
	 */
	public BigDecimal calculateApplicables(BigDecimal applicableAmount, Object config) {

		BigDecimal currentApplicable = BigDecimal.ZERO;

		if (null == config)
			return currentApplicable;

		@SuppressWarnings("unchecked")
		Map<String, Object> configMap = (Map<String, Object>) config;

		BigDecimal rate = null != configMap.get(CalculatorConstants.RATE_FIELD_NAME)
				? BigDecimal.valueOf(((Number) configMap.get(CalculatorConstants.RATE_FIELD_NAME)).doubleValue())
				: null;

		BigDecimal maxAmt = null != configMap.get(CalculatorConstants.MAX_AMOUNT_FIELD_NAME)
				? BigDecimal.valueOf(((Number) configMap.get(CalculatorConstants.MAX_AMOUNT_FIELD_NAME)).doubleValue())
				: null;

		BigDecimal minAmt = null != configMap.get(CalculatorConstants.MIN_AMOUNT_FIELD_NAME)
				? BigDecimal.valueOf(((Number) configMap.get(CalculatorConstants.MIN_AMOUNT_FIELD_NAME)).doubleValue())
				: null;

		BigDecimal flatAmt = null != configMap.get(CalculatorConstants.FLAT_AMOUNT_FIELD_NAME)
				? BigDecimal.valueOf(((Number) configMap.get(CalculatorConstants.FLAT_AMOUNT_FIELD_NAME)).doubleValue())
				: BigDecimal.ZERO;

		if (null == rate)
			currentApplicable = flatAmt.compareTo(applicableAmount) > 0 ? applicableAmount : flatAmt;
		else {
			currentApplicable = applicableAmount.multiply(rate.divide(CalculatorConstants.HUNDRED));

			if (null != maxAmt && BigDecimal.ZERO.compareTo(maxAmt) < 0 && currentApplicable.compareTo(maxAmt) > 0)
				currentApplicable = maxAmt;
			else if (null != minAmt && currentApplicable.compareTo(minAmt) < 0)
				currentApplicable = minAmt;
		}
		return currentApplicable;
	}

	/**
	 * Fetches and creates map of all required masters
	 * @param request The calculation request
	 * @return
	 */
	public Map<String,Object> getMasterMap(CalculationReq request){
		RequestInfo requestInfo = request.getRequestInfo();
		String tenantId = request.getCalculationCriteria().get(0).getTenantId();
		Set<String> assessmentYears = request.getCalculationCriteria().stream().map(cal -> cal.getProperty().getPropertyDetails().get(0).getFinancialYear())
				.collect(Collectors.toSet());
		Map<String,Object> masterMap = new HashMap<>();
		List<TaxPeriod> taxPeriods = getTaxPeriodList(requestInfo,tenantId);
		List<TaxHeadMaster> taxHeadMasters = getTaxHeadMasterMap(requestInfo,tenantId);
		Map<String,Map<String, Object>> financialYearMaster = getFinancialYear(tenantId,requestInfo,assessmentYears);

		masterMap.put(TAXPERIOD_MASTER_KEY,taxPeriods);
		masterMap.put(TAXHEADMASTER_MASTER_KEY,taxHeadMasters);
		masterMap.put(FINANCIALYEAR_MASTER_KEY,financialYearMaster);

		return masterMap;
	}
	
}
