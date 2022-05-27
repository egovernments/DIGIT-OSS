package org.egov.encryption;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.PlainRequestAccess;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.encryption.accesscontrol.AbacFilter;
import org.egov.encryption.audit.AuditService;
import org.egov.encryption.config.*;
import org.egov.encryption.masking.MaskingService;
import org.egov.encryption.models.*;
import org.egov.encryption.util.ConvertClass;
import org.egov.encryption.util.JSONBrowseUtil;
import org.egov.encryption.util.JacksonUtils;
import org.egov.encryption.util.JsonPathConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.util.*;
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
    private AbacConfiguration abacConfiguration;
    @Autowired
    private AbacFilter abacFilter;
    @Autowired
    private MaskingService maskingService;
    @Autowired
    private AuditService auditService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DecryptionPolicyConfiguration decryptionPolicyConfiguration;

    private JsonNode encryptJsonArray(JsonNode plaintextNode, String model, String tenantId) throws IOException {
        JsonNode encryptNode = plaintextNode.deepCopy();
        List<SecurityPolicyAttribute> securityPolicyAttributes = encryptionPolicyConfiguration.getAttributeDetailsForModel(model);
        List<String> attributesToEncrypt = securityPolicyAttributes.stream().map(SecurityPolicyAttribute::getJsonPath).collect(Collectors.toList());
        attributesToEncrypt = JsonPathConverter.convertToArrayJsonPaths(attributesToEncrypt);
        JsonNode jsonNode = JacksonUtils.filterJsonNodeForPaths(plaintextNode, attributesToEncrypt);

        if(! jsonNode.isEmpty(objectMapper.getSerializerProvider())) {
            JsonNode returnedEncryptedNode = objectMapper.valueToTree(encryptionServiceRestConnection.callEncrypt(tenantId,
                    encProperties.getDefaultEncryptDataType(), jsonNode));
            encryptNode = JacksonUtils.merge(returnedEncryptedNode, encryptNode);
        }

        return encryptNode;
    }

    public JsonNode encryptJson(Object plaintextJson, String key, String tenantId) throws IOException {
        JsonNode plaintextNode = createJsonNode(plaintextJson);
        JsonNode plaintextNodeCopy = plaintextNode.deepCopy();

        // Convert input to array if it isn't already
        if(!plaintextNodeCopy.isArray()) {
            ArrayNode arrayNode = objectMapper.createArrayNode();
            arrayNode.add(plaintextNodeCopy);
            plaintextNodeCopy = arrayNode;
        }
        JsonNode encryptedNode = encryptJsonArray(plaintextNodeCopy, key, tenantId);

        if(!plaintextNode.isArray()) {
            return encryptedNode.get(0);
        }
        return encryptedNode;
    }

    public <E,P> P encryptJson(Object plaintextJson, String key, String tenantId, Class<E> valueType) throws IOException {
        return ConvertClass.convertTo(encryptJson(plaintextJson, key, tenantId), valueType);
    }


    public JsonNode decryptedJson(RequestInfo requestInfo ,Object ciphertextJson, Map<SecurityPolicyAttribute, Visibility> attributesVisibilityMap,
                                  String key, String purpose, SecurityPolicyUniqueIdentifier uniqueIdentifier)throws IOException {
        JsonNode ciphertextNode = createJsonNode(ciphertextJson);
        JsonNode decryptNode = ciphertextNode.deepCopy();

        // Convert input to array if it isn't already
        if(!decryptNode.isArray()) {
            ArrayNode arrayNode = objectMapper.createArrayNode();
            arrayNode.add(decryptNode);
            decryptNode = arrayNode;
        }

        if(attributesVisibilityMap.containsValue(Visibility.NONE)){
            List<SecurityPolicyAttribute> attributesToBeRemoved = attributesVisibilityMap.keySet().stream()
                    .filter(attribute -> attributesVisibilityMap.get(attribute) == Visibility.NONE).collect(Collectors.toList());
            List<String> pathToBeRemoved = attributesToBeRemoved.stream().map(SecurityPolicyAttribute::getJsonPath).collect(Collectors.toList());
            JsonNode nodeToBeEmptied = JacksonUtils.filterJsonNodeForPaths(decryptNode, pathToBeRemoved);
            JsonNode emptyNode = JSONBrowseUtil.mapValues(nodeToBeEmptied, __ -> EncClientConstants.STRING_FOR_NONE_ACCESS);
            decryptNode = JacksonUtils.merge(emptyNode, decryptNode);
        }

        List<SecurityPolicyAttribute> attributesToBeDecrypted = attributesVisibilityMap.keySet().stream()
                .filter(attribute -> attributesVisibilityMap.get(attribute) != Visibility.NONE).collect(Collectors.toList());

        List<String> pathsToBeDecrypted = attributesToBeDecrypted.stream().map(SecurityPolicyAttribute::getJsonPath).collect(Collectors.toList());
        pathsToBeDecrypted = JsonPathConverter.convertToArrayJsonPaths(pathsToBeDecrypted);
        JsonNode jsonNode = JacksonUtils.filterJsonNodeForPaths(ciphertextNode, pathsToBeDecrypted);

        if(! jsonNode.isEmpty(objectMapper.getSerializerProvider())) {
            JsonNode returnedDecryptedNode = encryptionServiceRestConnection.callDecrypt(jsonNode);
            decryptNode = JacksonUtils.merge(returnedDecryptedNode, decryptNode);
        }

        if(attributesVisibilityMap.containsValue(Visibility.MASKED)) {
            List<SecurityPolicyAttribute> attributesToBeMasked = attributesVisibilityMap.keySet().stream()
                    .filter(attribute -> attributesVisibilityMap.get(attribute) == Visibility.MASKED).collect(Collectors.toList());
            decryptNode = maskingService.maskedData(decryptNode, attributesToBeMasked, uniqueIdentifier, requestInfo);
        }

        auditService.audit(decryptNode, key, purpose, requestInfo);

        return  decryptNode;
    }

    @Override
    public JsonNode decryptJson(RequestInfo requestInfo, Object ciphertextJson, String key, String purpose) throws IOException {
        List<String> roles = requestInfo.getUserInfo().getRoles().stream().map(Role::getCode).collect(Collectors.toList());
        Map<SecurityPolicyAttribute, Visibility> attributesVisibilityMap = decryptionPolicyConfiguration.getRoleAttributeAccessListForKey(requestInfo, key, roles);
        
        SecurityPolicyUniqueIdentifier uniqueIdentifier = decryptionPolicyConfiguration.getSecurityPolicyUniqueIdentifier(key);
        JsonNode decryptedNode = decryptedJson(requestInfo,ciphertextJson, attributesVisibilityMap, key, purpose, uniqueIdentifier);

        return decryptedNode;
    }

    public <E,P> P decryptJson(RequestInfo requestInfo, Object ciphertextJson, String key, String purpose
                              , Class<E> valueType) throws IOException {
        return ConvertClass.convertTo(decryptJson(requestInfo, ciphertextJson, key, purpose), valueType);
    }


    JsonNode createJsonNode(Object json) throws IOException {
        JsonNode jsonNode;
        if(json instanceof JsonNode)
            jsonNode = (JsonNode) json;
        else if(json instanceof String)
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