package org.egov.encryption.masking;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.encryption.config.EncClientConstants;
import org.egov.encryption.config.EncProperties;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.MaskingPatterns;
import org.egov.encryption.models.SecurityPolicy;
import org.egov.encryption.models.SecurityPolicyAttribute;
import org.egov.encryption.util.JSONBrowseUtil;
import org.egov.encryption.util.JacksonUtils;
import org.egov.mdms.model.*;
import org.reflections.Reflections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MaskingService {

    @Autowired
    private EncProperties encProperties;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    Map<String, Masking> maskingTechniqueMap;


    @PostConstruct
    private void init() throws IllegalAccessException, InstantiationException {
        maskingTechniqueMap = new HashMap<>();

        Reflections reflections = new Reflections(getClass().getPackage().getName());
        Set<Class<? extends Masking>> maskingTechniques =  reflections.getSubTypesOf(Masking.class);
        for(Class<? extends Masking> maskingTechnique : maskingTechniques) {
            Masking masking = maskingTechnique.newInstance();
            maskingTechniqueMap.put(masking.getMaskingTechnique(), masking);
        }
    }

    public <T> T maskData(T data, Attribute attribute) {
        Masking masking = maskingTechniqueMap.get(attribute.getMaskingTechnique());

        return masking.maskData(data);
    }

    public <T> T maskedData(T data, SecurityPolicyAttribute attribute, Map<String, String> maskingPatternMap) {

        //Masking masking = maskingTechniqueMap.get(attribute.getMaskingTechnique());
        String value = String.valueOf(data);
        String patternId = attribute.getPatternId();
        String maskingRegex = maskingPatternMap.get(patternId);
        value = value.replaceAll(maskingRegex, "*");

        return (T) value;
    }

    public JsonNode maskData(JsonNode decryptedNode, List<Attribute> attributes) {
        JsonNode maskedNode = decryptedNode.deepCopy();

        for(Attribute attribute : attributes) {
            JsonNode jsonNode = JacksonUtils.filterJsonNodeForPaths(maskedNode, Arrays.asList(attribute.getJsonPath()));

            jsonNode = JSONBrowseUtil.mapValues(jsonNode, value -> maskData(value, attribute));

            maskedNode = JacksonUtils.merge(jsonNode, maskedNode);
        }

        return maskedNode;
    }

    public JsonNode maskedData(JsonNode decryptedNode, List<SecurityPolicyAttribute> attributes) {
        JsonNode maskedNode = decryptedNode.deepCopy();
        Map<String, String> maskingPatternMap = getMaskingPatternMap();

        for(SecurityPolicyAttribute attribute : attributes) {
            JsonNode jsonNode = JacksonUtils.filterJsonNodeForPaths(maskedNode, Arrays.asList(attribute.getJsonPath()));

            jsonNode = JSONBrowseUtil.mapValues(jsonNode, value -> maskedData(value, attribute, maskingPatternMap));

            maskedNode = JacksonUtils.merge(jsonNode, maskedNode);
        }

        return maskedNode;
    }

    public Map<String, String> getMaskingPatternMap(){
        Map<String, String> maskingPatternMap = new HashMap<>();
        List<MaskingPatterns> maskingPatternsList = null;
        try {
            MasterDetail masterDetail = MasterDetail.builder().name(EncClientConstants.MDMS_MASKING_PATTERN_MASTER_NAME).build();
            ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(EncClientConstants.MDMS_MODULE_NAME)
                    .masterDetails(Arrays.asList(masterDetail)) .build();

            MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(encProperties.getStateLevelTenantId())
                    .moduleDetails(Arrays.asList(moduleDetail)).build();

            MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().requestInfo(RequestInfo.builder().build())
                    .mdmsCriteria(mdmsCriteria).build();

            ResponseEntity<MdmsResponse> response =
                    restTemplate.postForEntity(encProperties.getEgovMdmsHost() + encProperties.getEgovMdmsSearchEndpoint(),
                            mdmsCriteriaReq, MdmsResponse.class);

            JSONArray maskingPatternListJSON = response.getBody().getMdmsRes().get(EncClientConstants.MDMS_MODULE_NAME)
                    .get(EncClientConstants.MDMS_MASKING_PATTERN_MASTER_NAME);

            ObjectReader reader = objectMapper.readerFor(objectMapper.getTypeFactory().constructCollectionType(List.class,
                    MaskingPatterns.class));
            maskingPatternsList = reader.readValue(maskingPatternListJSON.toString());

            maskingPatternMap = maskingPatternsList.stream()
                    .collect(Collectors.toMap(MaskingPatterns::getId,
                            MaskingPatterns::getPattern));
        } catch (IOException e) {}
        return  maskingPatternMap;
    }
}
