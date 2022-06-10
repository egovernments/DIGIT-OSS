package org.egov.encryption.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.SecurityPolicy;
import org.egov.encryption.util.MdmsFetcher;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
public class EncryptionPolicyConfiguration {

    @Autowired
    private MdmsFetcher mdmsFetcher;
    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, List<Attribute>> encryptionPolicyAttributesMap;

    @PostConstruct
    void initializeEncryptionPolicyAttributesMapFromMdms() throws JsonProcessingException {
        try {
            JSONArray attributesDetailsJSON = mdmsFetcher.getSecurityMdmsForFilter(null);
            ObjectReader reader = objectMapper.readerFor(objectMapper.getTypeFactory().constructCollectionType(List.class,
                    SecurityPolicy.class));
            List<SecurityPolicy> securityPolicies = reader.readValue(attributesDetailsJSON.toString());
            encryptionPolicyAttributesMap = securityPolicies.stream()
                    .collect(Collectors.toMap(SecurityPolicy::getModel, SecurityPolicy::getAttributes));
        } catch (IOException e) {
            log.error(ErrorConstants.SECURITY_POLICY_READING_ERROR_MESSAGE, e);
            throw new CustomException(ErrorConstants.SECURITY_POLICY_READING_ERROR, ErrorConstants.SECURITY_POLICY_READING_ERROR_MESSAGE);
        }
    }

    public List<Attribute> getAttributeDetailsForModel(String modelName){
        try {
            return encryptionPolicyAttributesMap.get(modelName);
        }catch(Exception e) {
            throw new CustomException("DECRYPTION_ERROR","Error in retrieving MDMS data");
        }

    }

}
