package org.egov.encryption;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.encryption.audit.AuditService;
import org.egov.encryption.config.DecryptionPolicyConfiguration;
import org.egov.encryption.config.EncClientConstants;
import org.egov.encryption.config.EncProperties;
import org.egov.encryption.config.EncryptionPolicyConfiguration;
import org.egov.encryption.masking.MaskingService;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.UniqueIdentifier;
import org.egov.encryption.models.Visibility;
import org.egov.encryption.util.ConvertClass;
import org.egov.encryption.util.JSONBrowseUtil;
import org.egov.encryption.util.JacksonUtils;
import org.egov.encryption.util.JsonPathConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EncryptionServiceImpl implements EncryptionService {

    @Autowired
    private EncProperties encProperties;
    @Autowired
    private EncryptionServiceRestConnection encryptionServiceRestConnection;
    @Autowired
    private EncryptionPolicyConfiguration encryptionPolicyConfiguration;
    @Autowired
    private DecryptionPolicyConfiguration decryptionPolicyConfiguration;
    @Autowired
    private MaskingService maskingService;
    @Autowired
    private AuditService auditService;
    @Autowired
    private ObjectMapper objectMapper;

    private JsonNode encryptJsonArray(JsonNode plaintextNode, String model, String tenantId) throws IOException {
        JsonNode encryptNode = plaintextNode.deepCopy();
        List<Attribute> attributes = encryptionPolicyConfiguration.getAttributeDetailsForModel(model);
        List<String> attributesToEncrypt = attributes.stream().map(Attribute::getJsonPath).collect(Collectors.toList());
        attributesToEncrypt = JsonPathConverter.convertToArrayJsonPaths(attributesToEncrypt);
        JsonNode jsonNode = JacksonUtils.filterJsonNodeForPaths(plaintextNode, attributesToEncrypt);

        if (!jsonNode.isEmpty(objectMapper.getSerializerProvider())) {
            JsonNode returnedEncryptedNode = objectMapper.valueToTree(encryptionServiceRestConnection.callEncrypt(tenantId,
                    encProperties.getDefaultEncryptDataType(), jsonNode));
            encryptNode = JacksonUtils.merge(returnedEncryptedNode, encryptNode);
        }

        return encryptNode;
    }

    public JsonNode encryptJson(Object plaintextJson, String model, String tenantId) throws IOException {
        JsonNode plaintextNode = createJsonNode(plaintextJson);
        JsonNode plaintextNodeCopy = plaintextNode.deepCopy();

        // Convert input to array if it isn't already
        if (!plaintextNodeCopy.isArray()) {
            ArrayNode arrayNode = objectMapper.createArrayNode();
            arrayNode.add(plaintextNodeCopy);
            plaintextNodeCopy = arrayNode;
        }
        JsonNode encryptedNode = encryptJsonArray(plaintextNodeCopy, model, tenantId);

        if (!plaintextNode.isArray()) {
            return encryptedNode.get(0);
        }
        return encryptedNode;
    }

    public <E, P> P encryptJson(Object plaintextJson, String model, String tenantId, Class<E> valueType) throws IOException {
        return ConvertClass.convertTo(encryptJson(plaintextJson, model, tenantId), valueType);
    }

    private JsonNode decryptJson(RequestInfo requestInfo, Object ciphertextJson,
                                 Map<Attribute, Visibility> attributesVisibilityMap,
                                 String model, String purpose, UniqueIdentifier uniqueIdentifier) throws IOException {
        JsonNode ciphertextNode = createJsonNode(ciphertextJson);
        JsonNode decryptNode = ciphertextNode.deepCopy();

        // Convert input to array if it isn't already
        if (!decryptNode.isArray()) {
            ArrayNode arrayNode = objectMapper.createArrayNode();
            arrayNode.add(decryptNode);
            decryptNode = arrayNode;
        }

        if (attributesVisibilityMap.containsValue(Visibility.NONE)) {
            List<Attribute> attributesToBeRemoved = attributesVisibilityMap.keySet().stream()
                    .filter(attribute -> attributesVisibilityMap.get(attribute) == Visibility.NONE).collect(Collectors.toList());
            List<String> pathToBeRemoved = attributesToBeRemoved.stream().map(Attribute::getJsonPath).collect(Collectors.toList());
            JsonNode nodeToBeEmptied = JacksonUtils.filterJsonNodeForPaths(decryptNode, pathToBeRemoved);
            JsonNode emptyNode = JSONBrowseUtil.mapValues(nodeToBeEmptied, __ -> EncClientConstants.STRING_FOR_NONE_ACCESS);
            decryptNode = JacksonUtils.merge(emptyNode, decryptNode);
        }

        List<Attribute> attributesToBeDecrypted = attributesVisibilityMap.keySet().stream()
                .filter(attribute -> attributesVisibilityMap.get(attribute) != Visibility.NONE).collect(Collectors.toList());

        List<String> pathsToBeDecrypted = attributesToBeDecrypted.stream().map(Attribute::getJsonPath).collect(Collectors.toList());
        pathsToBeDecrypted = JsonPathConverter.convertToArrayJsonPaths(pathsToBeDecrypted);
        JsonNode jsonNode = JacksonUtils.filterJsonNodeForPaths(ciphertextNode, pathsToBeDecrypted);

        if (!jsonNode.isEmpty(objectMapper.getSerializerProvider())) {
            JsonNode returnedDecryptedNode = encryptionServiceRestConnection.callDecrypt(jsonNode);
            decryptNode = JacksonUtils.merge(returnedDecryptedNode, decryptNode);
        }

        if (attributesVisibilityMap.containsValue(Visibility.MASKED)) {
            List<Attribute> attributesToBeMasked = attributesVisibilityMap.keySet().stream()
                    .filter(attribute -> attributesVisibilityMap.get(attribute) == Visibility.MASKED).collect(Collectors.toList());
            decryptNode = maskingService.maskData(decryptNode, attributesToBeMasked, uniqueIdentifier, requestInfo);
        }

        auditService.audit(decryptNode, model, purpose, requestInfo);

        return decryptNode;
    }

    @Override
    public JsonNode decryptJson(RequestInfo requestInfo, Object ciphertextJson, String model, String purpose) throws IOException {
        List<String> roles = requestInfo.getUserInfo().getRoles().stream().map(Role::getCode).collect(Collectors.toList());
        Map<Attribute, Visibility> attributesVisibilityMap = decryptionPolicyConfiguration.getRoleAttributeAccessListForModel(requestInfo, model, roles);

        UniqueIdentifier uniqueIdentifier = decryptionPolicyConfiguration.getSecurityPolicyUniqueIdentifier(model);
        JsonNode decryptedNode = decryptJson(requestInfo, ciphertextJson, attributesVisibilityMap, model, purpose, uniqueIdentifier);

        return decryptedNode;
    }

    public <E, P> P decryptJson(RequestInfo requestInfo, Object ciphertextJson, String model, String purpose
            , Class<E> valueType) throws IOException {
        return ConvertClass.convertTo(decryptJson(requestInfo, ciphertextJson, model, purpose), valueType);
    }


    JsonNode createJsonNode(Object json) throws IOException {
        JsonNode jsonNode;
        if (json instanceof JsonNode)
            jsonNode = (JsonNode) json;
        else if (json instanceof String)
            jsonNode = objectMapper.readTree((String) json);           //JsonNode from JSON String
        else
            jsonNode = objectMapper.valueToTree(json);                 //JsonNode from POJO or Map
        return jsonNode;
    }


    public String encryptValue(Object plaintext, String tenantId) throws IOException {
        return encryptValue(plaintext, tenantId, encProperties.getDefaultEncryptDataType());
    }

    public String encryptValue(Object plaintext, String tenantId, String type) throws IOException {
        return encryptValue(new ArrayList<>(Collections.singleton(plaintext)), tenantId, type).get(0);
    }

    public List<String> encryptValue(List<Object> plaintext, String tenantId, String type) throws IOException {
        Object encryptionResponse = encryptionServiceRestConnection.callEncrypt(tenantId, type, plaintext);
        return ConvertClass.convertTo(objectMapper.valueToTree(encryptionResponse), List.class);
    }

}