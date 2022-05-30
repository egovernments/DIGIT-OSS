package org.egov.encryption.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.minidev.json.JSONArray;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.SecurityPolicy;
import org.egov.encryption.util.MdmsFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class EncryptionPolicyConfiguration {

    @Autowired
    private MdmsFetcher mdmsFetcher;
    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, List<Attribute>> encryptionPolicyAttributesMap;

    @PostConstruct
    void initializeEncryptionPolicyAttributesMapFromMdms() throws JsonProcessingException {
        JSONArray attributesDetailsJSON = mdmsFetcher.getSecurityMdmsForFilter(null);
        List<SecurityPolicy> securityPolicies = objectMapper.readValue(attributesDetailsJSON.toString(), List.class);
        encryptionPolicyAttributesMap = securityPolicies.stream()
                .collect(Collectors.toMap(SecurityPolicy::getModel, SecurityPolicy::getAttributes));
    }

    public List<Attribute> getAttributeDetailsForModel(String modelName) throws IOException {
        return encryptionPolicyAttributesMap.get(modelName);
    }

}
