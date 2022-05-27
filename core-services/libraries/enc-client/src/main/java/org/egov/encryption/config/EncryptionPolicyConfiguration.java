package org.egov.encryption.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.minidev.json.JSONArray;
import org.egov.encryption.models.SecurityPolicy;
import org.egov.encryption.models.SecurityPolicyAttribute;
import org.egov.encryption.util.MdmsFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class EncryptionPolicyConfiguration {

    @Autowired
    private MdmsFetcher mdmsFetcher;
    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, List<SecurityPolicyAttribute>> encryptionPolicyAttributesMap;

    @PostConstruct
    void initializeEncryptionPolicyAttributesMapFromMdms() throws JsonProcessingException {
        JSONArray attributesDetailsJSON = mdmsFetcher.getSecurityMdmsForFilter(null);
        List<SecurityPolicy> securityPolicies = objectMapper.readValue(attributesDetailsJSON.toString(), List.class);
        encryptionPolicyAttributesMap = securityPolicies.stream()
                .collect(Collectors.toMap(SecurityPolicy::getModel, SecurityPolicy::getAttributes));
    }

    public List<SecurityPolicyAttribute> getAttributeDetailsForModel(String modelName) throws IOException {
        return encryptionPolicyAttributesMap.get(modelName);
    }

}
