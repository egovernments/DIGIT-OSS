package org.egov.encryption.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.encryption.models.KeyRoleAttributeAccess;
import org.egov.encryption.models.RoleAttributeAccess;
import org.egov.mdms.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AbacConfiguration {

    @Autowired
    private EncProperties encProperties;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, List<RoleAttributeAccess>> keyRoleAttributeAccessMap;


    void initializeKeyRoleAttributeAccessMap(List<KeyRoleAttributeAccess> keyRoleAttributeAccessList) {
        keyRoleAttributeAccessMap = keyRoleAttributeAccessList.stream()
                .collect(Collectors.toMap(KeyRoleAttributeAccess::getKey,
                        KeyRoleAttributeAccess::getRoleAttributeAccessList));
    }

    @PostConstruct
    void initializeKeyRoleAttributeAccessMapFromMdms() {
        List<KeyRoleAttributeAccess> keyRoleAttributeAccessList = null;

        try {
            MasterDetail masterDetail = MasterDetail.builder().name(EncClientConstants.MDMS_DECRYPTION_MASTER_NAME).build();
            ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(EncClientConstants.MDMS_MODULE_NAME)
                    .masterDetails(Arrays.asList(masterDetail)) .build();

            MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(encProperties.getStateLevelTenantId())
                    .moduleDetails(Arrays.asList(moduleDetail)).build();

            MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().requestInfo(RequestInfo.builder().build())
                    .mdmsCriteria(mdmsCriteria).build();

            ResponseEntity<MdmsResponse> response =
                    restTemplate.postForEntity(encProperties.getEgovMdmsHost() + encProperties.getEgovMdmsSearchEndpoint(),
                    mdmsCriteriaReq, MdmsResponse.class);

            JSONArray keyRoleAttributeAccessListJSON = response.getBody().getMdmsRes().get(EncClientConstants.MDMS_MODULE_NAME)
                            .get(EncClientConstants.MDMS_DECRYPTION_MASTER_NAME);

            ObjectReader reader = objectMapper.readerFor(objectMapper.getTypeFactory().constructCollectionType(List.class,
                    KeyRoleAttributeAccess.class));
            keyRoleAttributeAccessList = reader.readValue(keyRoleAttributeAccessListJSON.toString());
        } catch (IOException e) {}

        initializeKeyRoleAttributeAccessMap(keyRoleAttributeAccessList);
    }


    public List<RoleAttributeAccess> getRoleAttributeAccessListForKey(String keyId) {
        return keyRoleAttributeAccessMap.get(keyId);
    }
}
