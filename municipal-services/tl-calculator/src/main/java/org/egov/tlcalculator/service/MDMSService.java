package org.egov.tlcalculator.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tlcalculator.config.TLCalculatorConfigs;
import org.egov.tlcalculator.repository.ServiceRequestRepository;
import org.egov.tlcalculator.utils.TLCalculatorConstants;
import org.egov.tlcalculator.web.models.enums.CalculationType;
import org.egov.tlcalculator.web.models.tradelicense.TradeLicense;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.jayway.jsonpath.JsonPath.read;

@Slf4j
@Service
public class MDMSService {


    private TLCalculatorConfigs config;

    private ServiceRequestRepository serviceRequestRepository;


    @Autowired
    public MDMSService(TLCalculatorConfigs config, ServiceRequestRepository serviceRequestRepository) {
        this.config = config;
        this.serviceRequestRepository = serviceRequestRepository;
    }


    /**
     * Creates MDMS request
     * @param requestInfo The RequestInfo of the calculationRequest
     * @param tenantId The tenantId of the tradeLicense
     * @return MDMSCriteria Request
     */
    private MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo, String tenantId) {

        // master details for TL module
        List<MasterDetail> fyMasterDetails = new ArrayList<>();
        // filter to only get code field from master data

        final String filterCodeForUom = "$.[?(@.active==true)]";
        final String serviceCode = "$.[?(@.service=='TL.RENEWAL')]";

        fyMasterDetails.add(MasterDetail.builder().name(TLCalculatorConstants.MDMS_FINANCIALYEAR).filter(filterCodeForUom).build());
        ModuleDetail fyModuleDtls = ModuleDetail.builder().masterDetails(fyMasterDetails)
                .moduleName(TLCalculatorConstants.MDMS_EGF_MASTER).build();

        List<MasterDetail> tlMasterDetails = new ArrayList<>();
        tlMasterDetails.add(MasterDetail.builder().name(TLCalculatorConstants.MDMS_CALCULATIONTYPE)
                .filter(filterCodeForUom).build());
        ModuleDetail tlModuleDtls = ModuleDetail.builder().masterDetails(tlMasterDetails)
                .moduleName(TLCalculatorConstants.MDMS_TRADELICENSE).build();
                
        List<MasterDetail> taxPeriodMasterDetails = new ArrayList<>();
        taxPeriodMasterDetails.add(MasterDetail.builder().name(TLCalculatorConstants.MDMS_TAXPERIOD).filter(serviceCode).build());
        ModuleDetail taxPeriodModuleDetails = ModuleDetail.builder().masterDetails(taxPeriodMasterDetails)
                .moduleName(TLCalculatorConstants.MDMS_BILLINGSERVICE).build();        

        List<ModuleDetail> moduleDetails = new ArrayList<>();
        moduleDetails.add(fyModuleDtls);
        moduleDetails.add(tlModuleDtls);
        moduleDetails.add(taxPeriodModuleDetails);

        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId)
                .build();

        return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
    }


    /**
     * Gets the startDate and the endDate of the financialYear
     * @param requestInfo The RequestInfo of the calculationRequest
     * @param license The tradeLicense for which calculation is done
     * @return Map containing the startDate and endDate
     */
    public Map<String,Long> getTaxPeriods(RequestInfo requestInfo,TradeLicense license,Object mdmsData){
        Map<String,Long> taxPeriods = new HashMap<>();
        try {
            String jsonPath = TLCalculatorConstants.MDMS_FINACIALYEAR_PATH.replace("{}",license.getFinancialYear());
            List<Map<String,Object>> jsonOutput =  JsonPath.read(mdmsData, jsonPath);
            Map<String,Object> financialYearProperties = jsonOutput.get(0);
            Object startDate = financialYearProperties.get(TLCalculatorConstants.MDMS_STARTDATE);
            Object endDate = financialYearProperties.get(TLCalculatorConstants.MDMS_ENDDATE);
            taxPeriods.put(TLCalculatorConstants.MDMS_STARTDATE,(Long) startDate);
            taxPeriods.put(TLCalculatorConstants.MDMS_ENDDATE,(Long) endDate);

        } catch (Exception e) {
            log.error("Error while fetvhing MDMS data", e);
            throw new CustomException("INVALID FINANCIALYEAR", "No data found for the financialYear: "+license.getFinancialYear());
        }
        return taxPeriods;
    }

    /**
     * Gets the calculationType for the city for a particular financialYear
     * If for particular financialYear entry is not there previous year is taken
     * If MDMS data is not available default values are returned
     * @param requestInfo The RequestInfo of the calculationRequest
     * @param license The tradeLicense for which calculation is done
     * @return Map contianing the calculationType for TradeUnit and accessory
     */
    public Map getCalculationType(RequestInfo requestInfo,TradeLicense license,Object mdmsData){
        HashMap<String,Object> calculationType = new HashMap<>();
        try {
            LinkedHashMap tradeLicenseData = JsonPath.read(mdmsData,TLCalculatorConstants.MDMS_TRADELICENSE_PATH);
            if(tradeLicenseData.size()==0)
                return defaultMap();

            List jsonOutput = JsonPath.read(mdmsData, TLCalculatorConstants.MDMS_CALCULATIONTYPE_PATH);
            String financialYear = license.getFinancialYear().split("-")[0];
            String maxClosestYear = "0";
            for(Object entry : jsonOutput) {
                HashMap<String,Object> map = (HashMap<String,Object>)entry;
                String mdmsFinancialYear = ((String)map.get(TLCalculatorConstants.MDMS_CALCULATIONTYPE_FINANCIALYEAR));
                String year = mdmsFinancialYear.split("-")[0];
                if(year.compareTo(financialYear)<0 && year.compareTo(maxClosestYear.split("-")[0])>0){
                    maxClosestYear = mdmsFinancialYear;
                }
                if(year.compareTo(financialYear)==0){
                    maxClosestYear = mdmsFinancialYear;
                    break;
                }
            }
            String jsonPath = TLCalculatorConstants.MDMS_CALCULATIONTYPE_FINANCIALYEAR_PATH.replace("{}",maxClosestYear);
            List<HashMap> output = JsonPath.read(mdmsData,jsonPath);
            calculationType = output.get(0);
        }
        catch (Exception e){
            throw new CustomException("MDMS ERROR","Failed to get calculationType");
        }

        return calculationType;
    }

    /**
     * Creates and return default calculationType values as map
     * @return default calculationType Map
     */
    private Map defaultMap(){
        Map defaultMap = new HashMap();
        defaultMap.put(TLCalculatorConstants.MDMS_CALCULATIONTYPE_TRADETYPE,config.getDefaultTradeUnitCalculationType());
        defaultMap.put(TLCalculatorConstants.MDMS_CALCULATIONTYPE_ACCESSORY,config.getDefaultAccessoryCalculationType());
        return defaultMap;
    }


    public Object mDMSCall(RequestInfo requestInfo,String tenantId){
        MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo,tenantId);
        StringBuilder url = getMdmsSearchUrl();
        Object result = serviceRequestRepository.fetchResult(url , mdmsCriteriaReq);
        return result;
    }



    /**
     * Creates and returns the url for mdms search endpoint
     *
     * @return MDMS Search URL
     */
    private StringBuilder getMdmsSearchUrl() {
        return new StringBuilder().append(config.getMdmsHost()).append(config.getMdmsSearchEndpoint());
    }



}
