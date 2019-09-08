package org.egov.tl.util;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
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
    public StringBuilder getCalculationURI(){
        StringBuilder uri = new StringBuilder(config.getCalculatorHost());
        uri.append(config.getCalculateEndpoint());
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
        url.append("ids=");
        url.append("{2}");
        return url.toString();
    }


    /**
     * Creates request to search UOM from MDMS
     * @param requestInfo The requestInfo of the request
     * @param tenantId The tenantId of the tradeLicense
     * @return request to search UOM from MDMS
     */
    public List<ModuleDetail> getTradeModuleRequest() {

        // master details for TL module
        List<MasterDetail> tlMasterDetails = new ArrayList<>();

        // filter to only get code field from master data
        final String filterCode = "$.[?(@.active==true)].code";

        tlMasterDetails.add(MasterDetail.builder().name(TRADE_TYPE).build());
        tlMasterDetails.add(MasterDetail.builder().name(ACCESSORIES_CATEGORY).build());

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



    public Object mDMSCall(TradeLicenseRequest tradeLicenseRequest){
        RequestInfo requestInfo = tradeLicenseRequest.getRequestInfo();
        String tenantId = tradeLicenseRequest.getLicenses().get(0).getTenantId();
        MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo,tenantId);
        Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
        return result;
    }


    /**
     * Creates a map of id to isStateUpdatable
     * @param searchresult Licenses from DB
     * @param businessService The businessService configuration
     * @return Map of is to isStateUpdatable
     */
    public Map<String,Boolean> getIdToIsStateUpdatableMap(BusinessService businessService,List<TradeLicense> searchresult){
        Map<String ,Boolean> idToIsStateUpdatableMap = new HashMap<>();
        searchresult.forEach(result -> {
            idToIsStateUpdatableMap.put(result.getId(),workflowService.isStateUpdatable(result.getStatus(), businessService));
        });
        return idToIsStateUpdatableMap;
    }





}
