package org.egov.encryption.masking;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.encryption.config.EncProperties;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.UniqueIdentifier;
import org.egov.encryption.util.JSONBrowseUtil;
import org.egov.encryption.util.JacksonUtils;
import org.egov.encryption.util.JsonPathConverter;
import org.egov.encryption.util.MdmsFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class MaskingService {

    @Autowired
    private EncProperties encProperties;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MdmsFetcher mdmsFetcher;

    Map<String, String> maskingPatternMap;

    @PostConstruct
    private void initMaskingPatternMap() {
        try {
            JSONArray maskingPatternListJSON = mdmsFetcher.getMaskingMdmsForFilter(null);
            for (int i = 0; i < maskingPatternListJSON.size(); i++) {
                Map<String, String> obj = objectMapper.convertValue(maskingPatternListJSON.get(i), Map.class);
                maskingPatternMap.put(obj.get("patternId"), obj.get("pattern"));
            }
        } catch (Exception e) {
        }
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

}
