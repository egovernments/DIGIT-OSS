package org.egov.swcalculation.util;

import java.util.*;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.constants.SWCalculationConstant;
import org.egov.swcalculation.repository.ServiceRequestRepository;
import org.egov.swcalculation.web.models.*;
import org.egov.swcalculation.web.models.workflow.ProcessInstance;
import org.egov.swcalculation.web.models.workflow.ProcessInstanceResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.Getter;

@Component
@Getter
public class CalculatorUtils {

	@Autowired
	private SWCalculationConfiguration configurations;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Prepares and returns MDMS search request with financial master criteria
	 *
	 * @param requestInfo - Request Info Object
	 * @param assessmentYears - List of financial years
	 * @return - Returns Criteria for MDMS
	 */
	public MdmsCriteriaReq getFinancialYearRequest(RequestInfo requestInfo, Set<String> assessmentYears,
			String tenantId) {

		String assessmentYearStr = StringUtils.join(assessmentYears, ",");
		MasterDetail masterDetail = MasterDetail.builder().name(SWCalculationConstant.FINANCIAL_YEAR_MASTER)
				.filter("[?(@." + SWCalculationConstant.FINANCIAL_YEAR_RANGE_FEILD_NAME + " IN [" + assessmentYearStr
						+ "]" + " && @.module== '" + SWCalculationConstant.SERVICE_FIELD_VALUE_SW + "')]")
				.build();
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(SWCalculationConstant.FINANCIAL_MODULE)
				.masterDetails(Arrays.asList(masterDetail)).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(moduleDetail)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	/**
	 * Returns the url for mdms search endpoint
	 *
	 * @return - Returns MDMS Search URL
	 */
	public StringBuilder getMdmsSearchUrl() {
		return new StringBuilder().append(configurations.getMdmsHost()).append(configurations.getMdmsEndPoint());
	}

	/**
	 * Call SW-services to get sewerage for the given connectionNo and tenantID
	 * 
	 * @param requestInfo
	 *            The RequestInfo of the incoming request
	 * @param connectionNo
	 *            The connectionNumber whose sewerage connection has to be
	 *            fetched
	 * @param tenantId
	 *            The tenantId of the sewerage connection
	 * @return The water connection fo the particular connection no
	 */
	public List<SewerageConnection> getSewerageConnection(RequestInfo requestInfo, String connectionNo, String tenantId) {
		Object result = serviceRequestRepository.fetchResult(getSewerageSearchURL(tenantId, connectionNo),
				RequestInfoWrapper.builder().requestInfo(requestInfo).build());

		SewerageConnectionResponse response = null;
		try {
			response = mapper.convertValue(result, SewerageConnectionResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING_ERROR", "Error while parsing response of Sewerage Search");
		}

		if (response == null || CollectionUtils.isEmpty(response.getSewerageConnections()))
			return null;

		Collections.sort(response.getSewerageConnections(), new Comparator<SewerageConnection>() {
			@Override
			public int compare(SewerageConnection sc1, SewerageConnection sc2) {
				return sc1.getAuditDetails().getLastModifiedTime().compareTo(sc2.getAuditDetails().getLastModifiedTime());
			}
		});

		return response.getSewerageConnections();
	}

	public  SewerageConnection getSewerageConnectionObject(List<SewerageConnection> sewerageConnectionList){
		int size = sewerageConnectionList.size();
		if(size>1){
			SewerageConnection sewerageConnection = null;
			if(sewerageConnectionList.get(size-1).getApplicationType().equalsIgnoreCase("MODIFY_SEWERAGE_CONNECTION") && sewerageConnectionList.get(size-1).getDateEffectiveFrom() > System.currentTimeMillis()){
				sewerageConnection =  sewerageConnectionList.get(size-2);
			}
			else
				sewerageConnection =  sewerageConnectionList.get(size-1);

			return sewerageConnection;
		}
		else
			return sewerageConnectionList.get(0);
	}

	/**
	 * Creates tradeLicense search url based on tenantId and applicationNumber
	 * 
	 * @return water search url
	 */
	private StringBuilder getSewerageSearchURL(String tenantId, String connectionNo) {
		StringBuilder url = new StringBuilder(configurations.getSewerageConnectionHost());
		url.append(configurations.getSewerageConnectionSearchEndPoint());
		url.append("?");
		url.append("tenantId=");
		url.append(tenantId);
		url.append("&");
		url.append("connectionNumber=");
		url.append(connectionNo);
		return url;
	}

	/**
	 * Methods provides all the usage category master for Sewerage Service
	 * module
	 */
	public MdmsCriteriaReq getWaterConnectionModuleRequest(RequestInfo requestInfo, String tenantId) {
		List<MasterDetail> details = new ArrayList<>();
		details.add(MasterDetail.builder().name(SWCalculationConstant.SW_REBATE_MASTER).build());
		details.add(MasterDetail.builder().name(SWCalculationConstant.SW_PENANLTY_MASTER).build());
		details.add(MasterDetail.builder().name(SWCalculationConstant.SW_INTEREST_MASTER).build());
		details.add(MasterDetail.builder().name(SWCalculationConstant.SW_BILLING_SLAB_MASTER).build());
		details.add(MasterDetail.builder().name(SWCalculationConstant.CALCULATION_ATTRIBUTE_CONST)
				.filter("[?(@.active== " + true + ")]").build());
		ModuleDetail mdDtl = ModuleDetail.builder().masterDetails(details)
				.moduleName(SWCalculationConstant.SW_TAX_MODULE).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(mdDtl)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	public MdmsCriteriaReq getBillingFrequency(RequestInfo requestInfo, String tenantId) {

		MasterDetail masterDetail = MasterDetail.builder().name(SWCalculationConstant.BILLING_PERIOD)
				.filter("[?(@.active== " + true + ")]").build();
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(SWCalculationConstant.SW_MODULE)
				.masterDetails(Arrays.asList(masterDetail)).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(moduleDetail)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	/**
	 * Methods provides all the usage category master for Water Service module
	 */
	public MdmsCriteriaReq getMdmsReqCriteria(RequestInfo requestInfo, String tenantId, ArrayList<String> masterDetails,
			String moduleName) {

		List<MasterDetail> details = new ArrayList<>();
		masterDetails.forEach(masterName -> details.add(MasterDetail.builder().name(masterName).build()));
		ModuleDetail mdDtl = ModuleDetail.builder().masterDetails(details).moduleName(moduleName).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(mdDtl)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	/**
	 * 
	 * @param tenantId - Tenant ID
	 * @return uri of fetch bill
	 */
	public StringBuilder getFetchBillURL(String tenantId, String consumerCode) {

		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getFetchBillEndPoint()).append(SWCalculationConstant.URL_PARAMS_SEPARATER)
				.append(SWCalculationConstant.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(SWCalculationConstant.SEPARATER).append(SWCalculationConstant.CONSUMER_CODE_SEARCH_FIELD_NAME)
				.append(consumerCode).append(SWCalculationConstant.SEPARATER)
				.append(SWCalculationConstant.BUSINESSSERVICE_FIELD_FOR_SEARCH_URL)
				.append(SWCalculationConstant.SEWERAGE_TAX_SERVICE_CODE);
	}
	
	/**
	 * 
	 * @param requestInfo - Request Info Object
	 * @param searchCriteria - Search Criteria Object
	 * @param tenantId - Tenant ID
	 * @return sewerage connection
	 */
	public SewerageConnection getSewerageConnectionOnApplicationNO(RequestInfo requestInfo, SearchCriteria searchCriteria,
			String tenantId) {
		String url = getSewerageSearchURL(searchCriteria);
		Object result = serviceRequestRepository.fetchResult(new StringBuilder(url),
				RequestInfoWrapper.builder().requestInfo(requestInfo).build());
		SewerageConnectionResponse response;
		try {
			response = mapper.convertValue(result, SewerageConnectionResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING_ERROR", "Error while parsing response of Sewerage Connection Search");
		}

		if (response == null || CollectionUtils.isEmpty(response.getSewerageConnections()))
			return null;

		return response.getSewerageConnections().get(0);
	}


	/**
	 * Creates sewerageConnection search url based on tenantId and connectionNumber
	 * 
	 * @return water search url
	 */
	private String getSewerageSearchURL(SearchCriteria searchCriteria) {
		StringBuilder url = new StringBuilder(configurations.getSewerageConnectionHost());
		url.append(configurations.getSewerageConnectionSearchEndPoint());
		url.append("?");
		url.append("tenantId=").append(searchCriteria.getTenantId());
		if (searchCriteria.getConnectionNumber() != null) {
			url.append("&");
			url.append("connectionNumber=").append(searchCriteria.getConnectionNumber());
		}
		if (searchCriteria.getApplicationNumber() != null) {
			url.append("&");
			url.append("applicationNumber=").append(searchCriteria.getApplicationNumber());
		}
		return url.toString();
	}
	
	/**
	 * 
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant Id
	 * @return mdms request for master data
	 */
	public MdmsCriteriaReq getEstimationMasterCriteria(RequestInfo requestInfo, String tenantId) {
		List<MasterDetail> details = new ArrayList<>();
		details.add(MasterDetail.builder().name(SWCalculationConstant.SC_PLOTSLAB_MASTER)
				.filter("[?(@.isActive== " + true + ")]").build());
		details.add(MasterDetail.builder().name(SWCalculationConstant.SC_PROPERTYUSAGETYPE_MASTER)
				.filter("[?(@.isActive== " + true + ")]").build());
		details.add(MasterDetail.builder().name(SWCalculationConstant.SC_FEESLAB_MASTER)
				.filter("[?(@.isActive== " + true + ")]").build());
		details.add(MasterDetail.builder().name(SWCalculationConstant.SC_ROADTYPE_MASTER)
				.filter("[?(@.isActive== " + true + ")]").build());
		ModuleDetail mdDtl = ModuleDetail.builder().masterDetails(details)
				.moduleName(SWCalculationConstant.SW_TAX_MODULE).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(mdDtl)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}
	
	/**
	 * 
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant Id
	 * @return MdmsCriteria
	 */
	private MdmsCriteriaReq getBillingFrequencyForScheduler(RequestInfo requestInfo, String tenantId) {

		MasterDetail masterDetail = MasterDetail.builder().name(SWCalculationConstant.BILLING_PERIOD)
				.filter("[?(@.active== " + true + " && @.connectionType== '" + SWCalculationConstant.nonMeterdConnection
						+ "')]")
				.build();
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(SWCalculationConstant.SW_MODULE)
				.masterDetails(Arrays.asList(masterDetail)).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(moduleDetail)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	/**
	 * 
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant ID
	 * @return Master For Billing Period
	 */
	public Map<String, Object> loadBillingFrequencyMasterData(RequestInfo requestInfo, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getBillingFrequencyForScheduler(requestInfo, tenantId);
		Object res = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
		if (res == null) {
			throw new CustomException("MDMS_ERROR_FOR_BILLING_FREQUENCY", "Failed to get Billing Frequency details");
		}
		List<Map<String, Object>> jsonOutput = JsonPath.read(res, SWCalculationConstant.JSONPATH_ROOT_FOR_BilingPeriod);
		return jsonOutput.get(0);
	}
	
	public Property getProperty(RequestInfo requestInfo, String tenantId, String propertyId){
		String propertySearchURL = getPropertySearchURL(propertyId,tenantId);
		Object propertyResult = serviceRequestRepository.fetchResult(new StringBuilder(propertySearchURL),
				RequestInfoWrapper.builder().requestInfo(requestInfo).build());

		PropertyResponse properties = null;

		try {
			properties = mapper.convertValue(propertyResult, PropertyResponse.class);
		}
		catch (IllegalArgumentException e){
			throw new CustomException("PARSING ERROR","Error while parsing response of Property Search");
		}

		if(properties==null || CollectionUtils.isEmpty(properties.getProperties()))
			return null;


		return properties.getProperties().get(0);
	}

	public String getPropertySearchURL(String propertyId,String tenantId){
		StringBuilder url = new StringBuilder(configurations.getPropertyHost());
		url.append(configurations.getSearchPropertyEndPoint()).append("?");
		url.append("tenantId=").append(tenantId).append("&");
		url.append("propertyIds=").append(propertyId);
		return url.toString();
	}


	public List<ProcessInstance> getWorkFlowProcessInstance(RequestInfo requestInfo, String tenantId, String businessIds){
		String workflowProcessInstanceSearchURL = getWorkflowProcessInstanceSearchURL(tenantId,businessIds);
		Object result = serviceRequestRepository.fetchResult(new StringBuilder(workflowProcessInstanceSearchURL),
				RequestInfoWrapper.builder().requestInfo(requestInfo).build());

		ProcessInstanceResponse processInstanceResponse = null;

		try {
			processInstanceResponse =mapper.convertValue(result, ProcessInstanceResponse.class);
		}
		catch (IllegalArgumentException e){
			throw new CustomException("PARSING ERROR","Error while parsing response of process Instance Search");
		}

		if(processInstanceResponse==null || CollectionUtils.isEmpty(processInstanceResponse.getProcessInstances()))
			return Collections.emptyList();

		return processInstanceResponse.getProcessInstances();
	}

	public String getWorkflowProcessInstanceSearchURL(String tenantId, String businessIds){
		StringBuilder url = new StringBuilder(configurations.getWorkflowHost());
		url.append(configurations.getSearchWorkflowProcessEndPoint()).append("?");
		url.append("tenantId=").append(tenantId).append("&");
		url.append("businessIds=").append(businessIds);
		return url.toString();
	}

	/**
	 *
	 * @param dateInLong
	 *
	 * @return year from date object
	 */
	public String epochToDate(Long dateInLong){
		Long timeStamp= dateInLong / 1000L;
		java.util.Date time=new java.util.Date((Long)timeStamp*1000);
		Calendar cal = Calendar.getInstance();
		cal.setTime(time);
		String day = String.valueOf(cal.get(Calendar.DAY_OF_MONTH));
		Integer mon = cal.get(Calendar.MONTH);
		mon=mon+1;
		String month = String.valueOf(mon);
		String year = String.valueOf(cal.get(Calendar.YEAR));
		StringBuilder date = new StringBuilder(day);
		date.append("/").append(month).append("/").append(year);

		return year;
	}

	/**
	 *
	 * @param masterMap
	 *
	 * @return billingcycle from mastermap
	 */
	public String getBillingCycle(Map<String, Object> masterMap)
	{
		Map<String, Object> financialYearMaster =  (Map<String, Object>) masterMap
				.get(SWCalculationConstant.BILLING_PERIOD);
		Long fromDateLong = (Long) financialYearMaster.get(SWCalculationConstant.STARTING_DATE_APPLICABLES);
		Long toDateLong = (Long) financialYearMaster.get(SWCalculationConstant.ENDING_DATE_APPLICABLES);

		return epochToDate(fromDateLong) + "-" +epochToDate(toDateLong) ;
	}

	/**
	 *
	 * @param requestInfo, tenantId, consumerCode
	 *
	 * @return billing response
	 */
	public Map<String, Object> getBillData(RequestInfo requestInfo, String tenantId, String consumerCode) {
		Object result =  serviceRequestRepository.fetchResult(
				getSearchBillURL(tenantId, consumerCode),
				RequestInfoWrapper.builder().requestInfo(requestInfo).build());

		Map<String, Object> billResponse = null;
		try {
			billResponse = mapper.convertValue(result, Map.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING_ERROR", "Error while parsing response of bill");
		}

		if (billResponse == null)
			throw new CustomException("WATERMETER_INACTIVE", "Can not generate bill for inactive waterconnection");

		return billResponse;
	}

	private StringBuilder getSearchBillURL(String tenantId, String consumerCode) {

		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getSearchBillEndPoint()).append(SWCalculationConstant.URL_PARAMS_SEPARATER)
				.append(SWCalculationConstant.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(SWCalculationConstant.SEPARATER).append(SWCalculationConstant.CONSUMER_CODE_SEARCH_FIELD_NAME)
				.append(consumerCode).append(SWCalculationConstant.SEPARATER)
				.append(SWCalculationConstant.SERVICE_FIELD_FOR_SEARCH_URL)
				.append(SWCalculationConstant.ONE_TIME_FEE_SERVICE_FIELD);
	}
}
