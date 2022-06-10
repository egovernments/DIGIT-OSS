package org.egov.encryption.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import net.minidev.json.JSONArray;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.SecurityPolicy;
import org.egov.encryption.util.MdmsFetcher;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
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
        ObjectReader reader = objectMapper.readerFor(objectMapper.getTypeFactory().constructCollectionType(List.class,
                SecurityPolicy.class));
        List<SecurityPolicy> securityPolicies = reader.readValue(attributesDetailsJSON.toString());
        encryptionPolicyAttributesMap = securityPolicies.stream()
                .collect(Collectors.toMap(SecurityPolicy::getModel, SecurityPolicy::getAttributes));
    }

    public List<Attribute> getAttributeDetailsForModel(String modelName){
        try {
            return encryptionPolicyAttributesMap.get(modelName);
        }catch(Exception e) {
            throw new CustomException("DECRYPTION_ERROR","Error in retrieving MDMS data");
        }

    }

}
