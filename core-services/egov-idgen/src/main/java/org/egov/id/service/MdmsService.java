package org.egov.id.service;

import java.io.IOException;
import java.util.*;

import lombok.extern.log4j.Log4j2;
import org.egov.id.model.IdRequest;
import org.egov.id.model.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.MdmsResponse;
import org.egov.mdms.model.ModuleDetail;
import org.egov.mdms.service.MdmsClientService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.log4j.Log4j;

@Service
@Log4j2
public class MdmsService {

    @Autowired
    MdmsClientService mdmsClientService;

    // 'tenants' & 'citymodule' are the JSON files inside the folder 'tenant'.
    private static final String tenantMaster = "tenants";
    private static final String cityMaster = "citymodule";
    private static final String tenantModule = "tenant";

    //'IdFormat' is the JSON file in the Folder 'common-masters'.
    private static final String formatMaster = "IdFormat";
    private static final String formatModule = "common-masters";


    public MdmsResponse getMasterData(RequestInfo requestInfo, String tenantId,
                                      Map<String, List<MasterDetail>> masterDetails) {

        MdmsResponse mdmsResponse = null;
        try {
            mdmsResponse = mdmsClientService.getMaster(RequestInfo.toCommonRequestInfo(requestInfo), tenantId,
                    masterDetails);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            log.error("Error occurred while fetching MDMS data", e);
        }
        return mdmsResponse;
    }

    /**
     * Description : This method to get CityCode from Mdms
     *
     * @param idRequest
     * @param requestInfo
     * @return cityCode
     * @throws Exception
     */

    public String getCity(RequestInfo requestInfo, IdRequest idRequest) {
        Map<String, String> getCity = doMdmsServiceCall(requestInfo, idRequest);
        String cityCode = null;
        try {
            if (getCity != null) {
                cityCode = getCity.get(tenantMaster);
            }
            if(cityCode== null){
                throw new CustomException("PARSING ERROR", "City code is Null/not valid");
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            log.error("Error occurred while fetching city code", e);
            throw new CustomException("PARSING ERROR", "Failed to get citycode from MDMS");
        }
        return cityCode;
    }

    /**
     * Description : This method to get IdFormat from Mdms
     *
     * @param idRequest
     * @param requestInfo
     * @return IdFormat
     * @throws Exception
     */

    public String getIdFormat(RequestInfo requestInfo, IdRequest idRequest) {
        Map<String, String> getIdFormat = doMdmsServiceCall(requestInfo, idRequest);
        String idFormat = null;
        try {
            if (getIdFormat != null) {
                idFormat = getIdFormat.get(formatMaster);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            log.error("Error while fetching id format", e);
            throw new CustomException("PARSING ERROR", "Failed to get formatid from MDMS");
        }
        return idFormat;
    }

    /**
     * Prepares and returns Mdms search request
     *
     * @param requestInfo
     * @return MAP
     */
    private Map<String, String> doMdmsServiceCall(RequestInfo requestInfo, IdRequest idRequest) {


        String idname = idRequest.getIdName();
        String tenantId = idRequest.getTenantId();

        String idFormatFromMdms = null;
        String cityCodeFromMdms = null;


        Map<String, List<MasterDetail>> masterDetails = new HashMap<String, List<MasterDetail>>();

        List<MasterDetail> masterDetailListCity = new LinkedList();
        List<MasterDetail> masterDetailListFormat = new LinkedList();

        MasterDetail masterDetailForCity = MasterDetail.builder().name(tenantMaster)
                .filter("[?(@.code=='" + tenantId + "')]").build();

        masterDetailListCity.add(masterDetailForCity);

        MasterDetail masterDetailForFormat = MasterDetail.builder().name(formatMaster)
                .filter("[?(@.idname=='" + idname + "')]").build();


        masterDetailListFormat.add(masterDetailForFormat);

        masterDetails.put(tenantModule, masterDetailListCity);
        masterDetails.put(formatModule, masterDetailListFormat);
        MdmsResponse mdmsResponse = null;

        try {
            mdmsResponse = getMasterData(requestInfo, tenantId, masterDetails);

            if (mdmsResponse.getMdmsRes() != null && mdmsResponse.getMdmsRes().containsKey(tenantModule)
                    && mdmsResponse.getMdmsRes().get(tenantModule).containsKey(tenantMaster)
                    && mdmsResponse.getMdmsRes().get(tenantModule).get(tenantMaster).size() > 0
                    && mdmsResponse.getMdmsRes().get(tenantModule).get(tenantMaster).get(0) != null) {
                DocumentContext documentContext = JsonPath
                        .parse(mdmsResponse.getMdmsRes().get(tenantModule).get(tenantMaster).get(0));

                cityCodeFromMdms = documentContext.read("$.city.code");
                log.debug("Found city code as - " + cityCodeFromMdms);
            }
            if (mdmsResponse.getMdmsRes() != null && mdmsResponse.getMdmsRes().containsKey(formatModule)
                    && mdmsResponse.getMdmsRes().get(formatModule).containsKey(formatMaster)
                    && mdmsResponse.getMdmsRes().get(formatModule).get(formatMaster).size() > 0
                    && mdmsResponse.getMdmsRes().get(formatModule).get(formatMaster).get(0) != null) {
                DocumentContext documentContext = JsonPath
                        .parse(mdmsResponse.getMdmsRes().get(formatModule).get(formatMaster).get(0));
                idFormatFromMdms = documentContext.read("$.format");
            }

        } catch (Exception e) {
            // TODO Auto-generated catch block
            log.error("MDMS Fetch failed", e);
            throw new CustomException("PARSING ERROR", "Failed to get citycode/formatid from MDMS");
        }
        Map<String, String> mdmsCallMap = new HashMap();
        mdmsCallMap.put(formatMaster, idFormatFromMdms);
        mdmsCallMap.put(tenantMaster, cityCodeFromMdms);

        return mdmsCallMap;
    }

}
