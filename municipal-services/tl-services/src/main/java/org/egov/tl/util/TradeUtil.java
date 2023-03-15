package org.egov.tl.util;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.web.models.AuditDetails;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tl.web.models.workflow.BusinessService;
import org.egov.tl.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

import static org.egov.tl.util.TLConstants.*;
import static org.egov.tl.util.TLConstants.COMMON_MASTERS_MODULE;

@Component
@Slf4j
public class TradeUtil {

    private TLConfiguration config;

    private ServiceRequestRepository serviceRequestRepository;

    private WorkflowService workflowService;

    @Autowired
    public TradeUtil(TLConfiguration config, ServiceRequestRepository serviceRequestRepository,
                     WorkflowService workflowService) {
        this.config = config;
        this.serviceRequestRepository = serviceRequestRepository;
        this.workflowService = workflowService;
    }



    /**
     * Method to return auditDetails for create/update flows
     *
     * @param by
     * @param isCreate
     * @return AuditDetails
     */
    public AuditDetails getAuditDetails(String by, Boolean isCreate) {
        Long time = System.currentTimeMillis();
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
    }


    /**
     * Creates url for tl-calculator service
     * @return url for tl-calculator service
     */
    public StringBuilder getCalculationURI(String businessService) {
        StringBuilder uri = new StringBuilder();
        uri.append(config.getCalculatorHost());
        if (businessService == null)
            businessService = businessService_TL;
        switch (businessService) {
            case businessService_TL:
                uri.append(config.getCalculateEndpointTL());
                break;

            case businessService_BPA:
                uri.append(config.getCalculateEndpointBPA());
                break;
        }
        return uri;
    }

    /**
     * Creates url for tl-calculator service
     * @return url for tl-calculator service
     */
    public StringBuilder getEstimationURI(String businessService) {
        StringBuilder uri = new StringBuilder();
        uri.append(config.getCalculatorHost());
        if (businessService == null)
            businessService = businessService_TL;
        switch (businessService) {
            case businessService_TL:
                uri.append(config.getEstimateEndpointTL());
                break;
        }
        return uri;
    }

    /**
     * Creates search url for pt-services-v2 service
     * @return url for pt-services-v2 service search
     */
    public String getPropertySearchURL(){
        StringBuilder url = new StringBuilder(config.getPropertyHost());
        url.append(config.getPropertyContextPath());
        url.append(config.getPropertySearchEndpoint());
        url.append("?");
        url.append("tenantId=");
        url.append("{1}");
        url.append("&");
        url.append("propertyIds=");
        url.append("{2}");
        return url.toString();
    }


    /**
     * Creates request to search UOM from MDMS
     * @return request to search UOM from MDMS
     */
    public List<ModuleDetail> getTradeModuleRequest() {

        // master details for TL module
        List<MasterDetail> tlMasterDetails = new ArrayList<>();

        // filter to only get code field from master data
        final String filterCode = "$.[?(@.active==true)].code";

        tlMasterDetails.add(MasterDetail.builder().name(TRADE_TYPE).build());
        tlMasterDetails.add(MasterDetail.builder().name(ACCESSORIES_CATEGORY).build());
        tlMasterDetails.add(MasterDetail.builder().name(REMINDER_PERIODS).build());

        ModuleDetail tlModuleDtls = ModuleDetail.builder().masterDetails(tlMasterDetails)
                .moduleName(TRADE_LICENSE_MODULE).build();

        // master details for common-masters module
        List<MasterDetail> commonMasterDetails = new ArrayList<>();
        commonMasterDetails.add(MasterDetail.builder().name(OWNERSHIP_CATEGORY).filter(filterCode).build());
        commonMasterDetails.add(MasterDetail.builder().name(STRUCTURE_TYPE).filter(filterCode).build());
        ModuleDetail commonMasterMDtl = ModuleDetail.builder().masterDetails(commonMasterDetails)
                .moduleName(COMMON_MASTERS_MODULE).build();


        /*MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(tlModuleDtls,commonMasterMDtl)).tenantId(tenantId)
                .build();*/

        return Arrays.asList(tlModuleDtls,commonMasterMDtl);

    }


    /**
     * Creates request to search UOM from MDMS
     * @return request to search UOM from MDMS
     */
    public ModuleDetail getTradeUomRequest() {

        // master details for TL module
        List<MasterDetail> tlMasterDetails = new ArrayList<>();

        // filter to only get code field from master data


        tlMasterDetails.add(MasterDetail.builder().name(TRADE_TYPE).build());
        tlMasterDetails.add(MasterDetail.builder().name(ACCESSORIES_CATEGORY).build());

        ModuleDetail tlModuleDtls = ModuleDetail.builder().masterDetails(tlMasterDetails)
                .moduleName(TRADE_LICENSE_MODULE).build();


        /*MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Collections.singletonList(tlModuleDtls)).tenantId(tenantId)
                .build();*/

        return tlModuleDtls;
    }


    /**
     * Returns the url for mdms search endpoint
     *
     * @return url for mdms search endpoint
     */
    public StringBuilder getMdmsSearchUrl() {
        return new StringBuilder().append(config.getMdmsHost()).append(config.getMdmsEndPoint());
    }


    /**
     * Creates map containing the startTime and endTime of the given tradeLicense
     * @param license The create or update TradeLicense request
     * @return Map containing startTime and endTime
     */
    public Map<String,Long> getTaxPeriods(TradeLicense license,Object mdmsData){
        Map<String,Long> taxPeriods = new HashMap<>();
        try {
            String jsonPath = TLConstants.MDMS_FINACIALYEAR_PATH.replace("{}",license.getFinancialYear());
            List<Map<String,Object>> jsonOutput =  JsonPath.read(mdmsData, jsonPath);
            Map<String,Object> financialYearProperties = jsonOutput.get(0);
            Object startDate = financialYearProperties.get(TLConstants.MDMS_STARTDATE);
            Object endDate = financialYearProperties.get(TLConstants.MDMS_ENDDATE);
            taxPeriods.put(TLConstants.MDMS_STARTDATE,(Long) startDate);
            taxPeriods.put(TLConstants.MDMS_ENDDATE,(Long) endDate);

        } catch (Exception e) {
            log.error("Error while fetching MDMS data", e);
            throw new CustomException("INVALID FINANCIALYEAR", "No data found for the financialYear: "+license.getFinancialYear());
        }
        return taxPeriods;
    }


    /**
     * Creates map containing the startTime and endTime of the given tradeLicense for Renewal 
     * @param license The create or update TradeLicense request
     * @return Map containing startTime and endTime
     */
//    public Map<String,Long> getTaxPeriodsforRenewal(TradeLicense license,Object mdmsData){
//        Map<String,Long> taxPeriods = new HashMap<>();
//        try {
//            String currentYearjsonPath = TLConstants.MDMS_FINACIALYEAR_PATH.replace("{}",license.getFinancialYear());
//            List<Map<String,Object>> currentFinancialYear = JsonPath.read(mdmsData, currentYearjsonPath);
//            Map<String,Object> currentFYObject = currentFinancialYear.get(0);
//            Object startDate = currentFYObject.get(TLConstants.MDMS_STARTDATE);
//            Object endDate = currentFYObject.get(TLConstants.MDMS_ENDDATE);
//            taxPeriods.put(TLConstants.MDMS_STARTDATE,(Long) startDate);
//            taxPeriods.put(TLConstants.MDMS_ENDDATE,(Long) endDate);
//        } catch (Exception e) {
//            log.error("Error while fetching MDMS data", e);
//            throw new CustomException("INVALID FINANCIALYEAR", "No data found for the financialYear: "+license.getFinancialYear());
//        }
//        return taxPeriods;
//    }



    /**
     * Creates request to search financialYear in mdms
     * @return MDMS request for financialYear
     */
    private ModuleDetail getFinancialYearRequest() {

        // master details for TL module
        List<MasterDetail> tlMasterDetails = new ArrayList<>();

        // filter to only get code field from master data

        final String filterCodeForUom = "$.[?(@.active==true && @.module=='TL')]";

        tlMasterDetails.add(MasterDetail.builder().name(TLConstants.MDMS_FINANCIALYEAR).filter(filterCodeForUom).build());

        ModuleDetail tlModuleDtls = ModuleDetail.builder().masterDetails(tlMasterDetails)
                .moduleName(TLConstants.MDMS_EGF_MASTER).build();


  /*      MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Collections.singletonList(tlModuleDtls)).tenantId(tenantId)
                .build();*/

        return tlModuleDtls;
    }


    private MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo,String tenantId){
        ModuleDetail financialYearRequest = getFinancialYearRequest();
        List<ModuleDetail> tradeModuleRequest = getTradeModuleRequest();

        List<ModuleDetail> moduleDetails = new LinkedList<>();
        moduleDetails.add(financialYearRequest);
        moduleDetails.addAll(tradeModuleRequest);

        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId)
                .build();

        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria)
                .requestInfo(requestInfo).build();
        return mdmsCriteriaReq;
    }

    public List<String> getBPAEndState(TradeLicenseRequest tradeLicenseRequest) {

        List<String> endstates = new ArrayList<>();
        for (TradeLicense tradeLicense : tradeLicenseRequest.getLicenses()) {
            String tradetype = tradeLicense.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType();
            Object mdmsData = mDMSCallForBPA(tradeLicenseRequest.getRequestInfo(), tradeLicense.getTenantId(), tradetype);
            List<String> res = JsonPath.read(mdmsData, BPAConstants.MDMS_ENDSTATEPATH);
            endstates.add(res.get(0));
        }
        return endstates;
    }

    public List<String> getusernewRoleFromMDMS(TradeLicense license,RequestInfo requestInfo){
        String tradetype=license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType();
        Object mdmsData=mDMSCallForBPA(requestInfo,license.getTenantId(),tradetype);
        List<List<String>>res=JsonPath.read(mdmsData, BPAConstants.MDMS_BPAROLEPATH);
        return  res.get(0);
    }

    public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
    	MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo,tenantId);
        Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
        return result;
    }




    public Object mDMSCallForBPA(RequestInfo requestInfo,String tenantId,String tradetype){


        List<MasterDetail> masterDetails = new ArrayList<>();


        final String filterCodeForLicenseetypes = "$.[?(@.tradeType =='"+tradetype+"')]";

        masterDetails.add(MasterDetail.builder().name(BPAConstants.TRADETYPE_TO_ROLEMAPPING).filter(filterCodeForLicenseetypes).build());

        ModuleDetail moduleDetail = ModuleDetail.builder().masterDetails(masterDetails)
                .moduleName(BPAConstants.MDMS_MODULE_BPAREGISTRATION).build();


        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Collections.singletonList(moduleDetail)).tenantId(tenantId)
                .build();


        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria)
                .requestInfo(requestInfo).build();
        Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
        return result;
    }




    /**
     * Creates a map of id to isStateUpdatable
     * @param searchresult Licenses from DB
     * @param businessService The businessService configuration
     * @return Map of is to isStateUpdatable
     */
    public Map<String, Boolean> getIdToIsStateUpdatableMap(BusinessService businessService, List<TradeLicense> searchresult) {
        Map<String, Boolean> idToIsStateUpdatableMap = new HashMap<>();
        searchresult.forEach(result -> {
            String nameofBusinessService = result.getBusinessService();
            if (StringUtils.equals(nameofBusinessService,businessService_BPA) && (result.getStatus().equalsIgnoreCase(STATUS_INITIATED))) {
                idToIsStateUpdatableMap.put(result.getId(), true);
            } else
                idToIsStateUpdatableMap.put(result.getId(), workflowService.isStateUpdatable(result.getStatus(), businessService));
        });
        return idToIsStateUpdatableMap;
    }



	public Map<String, Long> getTenantIdToReminderPeriod(RequestInfo requestInfo) {
		Object mdmsData = mDMSCall(requestInfo, requestInfo.getUserInfo().getTenantId());
		String jsonPath = REMINDER_JSONPATH;
		List<Map<String,Object>> jsonOutput = JsonPath.read(mdmsData, jsonPath);
		Map<String,Long>tenantIdToReminderPeriod = new HashMap <String,Long>();
		
		for (int i=0; i<jsonOutput.size();i++) {
	        tenantIdToReminderPeriod.put((String) jsonOutput.get(i).get(TENANT_ID),((Number)jsonOutput.get(i).get(REMINDER_INTERVAL)).longValue());
	        }
		
		return tenantIdToReminderPeriod;
		
	}

    public Object getBillingSlabs(RequestInfo requestInfo, String tenantId) {
        Map<String, Object> billingSlabSearchReq = new HashMap<>();
        billingSlabSearchReq.put("RequestInfo", requestInfo);
        Object result = serviceRequestRepository.fetchResult(getBillingSlabUrl(tenantId), billingSlabSearchReq);
        return result;
    }

    public StringBuilder getBillingSlabUrl(String tenantId) {
        return new StringBuilder().append(config.getCalculatorHost()).append(config.getBillingSlabEndPoint())
                .append("?").append("tenantId=").append(tenantId);
    }

    /**
     * Creates request to search StateName in mdms
     *
     * @return State name
     */
    public String mDMSCallForStateName(RequestInfo requestInfo, String tenantId) {

        List<MasterDetail> masterDetails = new ArrayList<>();

        final String filterCodeForLicenseetypes = "$.[?(@.code =='" + tenantId + "')]";

        masterDetails.add(MasterDetail.builder().name(BPAConstants.MDMS_TENANTS).filter(filterCodeForLicenseetypes).build());

        ModuleDetail moduleDetail = ModuleDetail.builder().masterDetails(masterDetails)
                .moduleName(BPAConstants.MDMS_MODULE_TENANT).build();

        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Collections.singletonList(moduleDetail)).tenantId(tenantId)
                .build();

        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria)
                .requestInfo(requestInfo).build();
        Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
        String jsonPath = TENANTS_JSONPATH;
        List<Map<String, Object>> jsonOutput = JsonPath.read(result, jsonPath);
        String state = (String) jsonOutput.get(0).get("name");
        return state;
    }

}