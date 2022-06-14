package org.egov.encryption.util;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.encryption.config.EncClientConstants;
import org.egov.encryption.config.EncProperties;
import org.egov.encryption.config.ErrorConstants;
import org.egov.mdms.model.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Slf4j
@Component
public class MdmsFetcher {

    @Autowired
    private EncProperties encProperties;
    @Autowired
    private RestTemplate restTemplate;

    public JSONArray getSecurityMdmsForFilter(String filter) {
        return getMdmsForFilter(filter, EncClientConstants.MDMS_SECURITY_POLICY_MASTER_NAME);
    }

    public JSONArray getMaskingMdmsForFilter(String filter) {
        return getMdmsForFilter(filter, EncClientConstants.MDMS_MASKING_PATTERN_MASTER_NAME);
    }

    public JSONArray getMdmsForFilter(String filter, String masterName) {
        MasterDetail masterDetail = MasterDetail.builder().name(masterName)
                .filter(filter).build();
        ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(EncClientConstants.MDMS_MODULE_NAME)
                .masterDetails(Arrays.asList(masterDetail)).build();
        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(encProperties.getStateLevelTenantId())
                .moduleDetails(Arrays.asList(moduleDetail)).build();

        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().requestInfo(RequestInfo.builder().build())
                .mdmsCriteria(mdmsCriteria).build();

        try {
            ResponseEntity<MdmsResponse> response =
                    restTemplate.postForEntity(encProperties.getEgovMdmsHost() + encProperties.getEgovMdmsSearchEndpoint(),
                            mdmsCriteriaReq, MdmsResponse.class);
            return response.getBody().getMdmsRes().get(EncClientConstants.MDMS_MODULE_NAME)
                    .get(masterName);
        } catch (Exception e) {
            log.error(ErrorConstants.MDMS_FETCH_ERROR_MESSAGE, e);
            throw new CustomException(ErrorConstants.MDMS_FETCH_ERROR, ErrorConstants.MDMS_FETCH_ERROR_MESSAGE);
        }
    }

}
