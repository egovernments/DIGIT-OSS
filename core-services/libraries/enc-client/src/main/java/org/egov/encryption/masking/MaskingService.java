package org.egov.encryption.masking;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.encryption.config.EncClientConstants;
import org.egov.encryption.config.EncProperties;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.UniqueIdentifier;
import org.egov.encryption.util.JSONBrowseUtil;
import org.egov.encryption.util.JacksonUtils;
import org.egov.encryption.util.JsonPathConverter;
import org.egov.mdms.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.*;

@Service
public class MaskingService {

    @Autowired
    private EncProperties encProperties;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    Map<String, String> maskingPatternMap;

    @PostConstruct
    private void init() {
        maskingPatternMap = getMaskingPatternMap();
    }

    public <T> T maskData(T data, Attribute attribute) {
        String value = String.valueOf(data);
        String patternId = attribute.getPatternId();
        String maskingRegex = maskingPatternMap.get(patternId);
        value = value.replaceAll(maskingRegex, "*");

        return (T) value;
    }

    public JsonNode maskData(JsonNode decryptedNode, List<Attribute> attributes, UniqueIdentifier uniqueIdentifier, RequestInfo requestInfo) {
        JsonNode maskedNode = decryptedNode.deepCopy();
        for (Attribute attribute : attributes) {
            JsonNode jsonNode = JacksonUtils.filterJsonNodeForPaths(maskedNode,
                    JsonPathConverter.convertToArrayJsonPaths(Arrays.asList(attribute.getJsonPath())));
            jsonNode = JSONBrowseUtil.mapValues(jsonNode, value -> maskData(value, attribute));
            maskedNode = JacksonUtils.merge(jsonNode, maskedNode);
        }
        if (requestInfo.getPlainRequestAccess() != null && requestInfo.getPlainRequestAccess().getRecordId() != null) {
            maskedNode = addPlainRequestAccessValues((ArrayNode) maskedNode, (ArrayNode) decryptedNode, attributes, uniqueIdentifier, requestInfo);
        }
        return maskedNode;
    }

    private JsonNode addPlainRequestAccessValues(ArrayNode maskedArray, ArrayNode decryptedArray,
                                                 List<Attribute> attributes,
                                                 UniqueIdentifier uniqueIdentifier,
                                                 RequestInfo requestInfo) {
        String recordId = requestInfo.getPlainRequestAccess().getRecordId();
        List<String> plainRequestFields = requestInfo.getPlainRequestAccess().getPlainRequestFields();
        for(int i = 0; i < maskedArray.size(); i++) {
            JsonNode maskedNode = maskedArray.get(i);
            JsonNode decryptedNode = decryptedArray.get(i);
            if(recordId.equals(maskedNode.get(uniqueIdentifier.getJsonPath()).asText())) {
                JsonNode plainNode = createPlainNode(decryptedNode, plainRequestFields, attributes);
                plainNode = JacksonUtils.merge(plainNode, maskedNode);
                maskedArray.remove(i);
                maskedArray.insert(i, plainNode);
            }
        }
        return maskedArray;
    }

    private JsonNode createPlainNode(JsonNode decryptedNode, List<String> plainRequestFields,
                                     List<Attribute> attributes) {
        JsonNode plainNode = decryptedNode.deepCopy();
        List<String> plainPaths = new ArrayList<>();
        for (Attribute attribute : attributes) {
            if (plainRequestFields.contains(attribute.getName())) {
                plainPaths.add(attribute.getJsonPath());
            }
        }
        plainNode = JacksonUtils.filterJsonNodeForPaths(plainNode, plainPaths);
        return plainNode;
    }

    public Map<String, String> getMaskingPatternMap(){
        Map<String, String> maskingPatternMap = new HashMap<>();
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

            for(int i =0 ;i <maskingPatternListJSON.size();i++){
                Map<String,String> obj = objectMapper.convertValue(maskingPatternListJSON.get(i),Map.class);
                maskingPatternMap.put(obj.get("patternId"),obj.get("pattern")) ;
            }

        } catch (Exception e) {}
        return  maskingPatternMap;
    }

}
