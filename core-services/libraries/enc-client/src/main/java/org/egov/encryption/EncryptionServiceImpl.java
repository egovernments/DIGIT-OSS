package org.egov.encryption;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.encryption.accesscontrol.AbacFilter;
import org.egov.encryption.config.*;
import org.egov.encryption.masking.MaskingService;
import org.egov.encryption.models.AccessType;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.SecurityPolicyAttribute;
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
    private AbacConfiguration abacConfiguration;
    @Autowired
    private AbacFilter abacFilter;
    @Autowired
    private MaskingService maskingService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DecryptionPolicyConfiguration decryptionPolicyConfiguration;

    private JsonNode encryptJsonArray(JsonNode plaintextNode, String model, String tenantId) throws IOException {
        JsonNode encryptNode = plaintextNode.deepCopy();
        List<String> attributesToEncrypt = encryptionPolicyConfiguration.getAttributesJsonPathForModel(model);
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


    public JsonNode decryptedJson(Object ciphertextJson, Map<SecurityPolicyAttribute, Visibility> attributesVisibilityMap, User user)
            throws IOException {
        JsonNode ciphertextNode = createJsonNode(ciphertextJson);
        JsonNode decryptNode = ciphertextNode.deepCopy();

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
            decryptNode = maskingService.maskedData(decryptNode, attributesToBeMasked);
        }

        return  decryptNode;
    }


    public JsonNode decryptJson(Object ciphertextJson, Map<Attribute, AccessType> attributeAccessTypeMap, User user)
            throws IOException {
        JsonNode ciphertextNode = createJsonNode(ciphertextJson);
        JsonNode decryptNode = ciphertextNode.deepCopy();

        if(attributeAccessTypeMap.containsValue(AccessType.NONE)) {
            List<Attribute> attributesToBeRemoved = attributeAccessTypeMap.keySet().stream()
                    .filter(attribute -> attributeAccessTypeMap.get(attribute) == AccessType.NONE).collect(Collectors.toList());
            List<String> pathsToBeRemoved = attributesToBeRemoved.stream().map(Attribute::getJsonPath).collect(Collectors.toList());
            JsonNode nodeToBeEmptied = JacksonUtils.filterJsonNodeForPaths(decryptNode, pathsToBeRemoved);
            JsonNode emptyNode = JSONBrowseUtil.mapValues(nodeToBeEmptied, __ -> EncClientConstants.STRING_FOR_NONE_ACCESS);
            decryptNode = JacksonUtils.merge(emptyNode, decryptNode);
        }

        List<Attribute> attributesToBeDecrypted = attributeAccessTypeMap.keySet().stream()
                .filter(attribute -> attributeAccessTypeMap.get(attribute) != AccessType.NONE).collect(Collectors.toList());

        List<String> pathsToBeDecrypted = attributesToBeDecrypted.stream().map(Attribute::getJsonPath).collect(Collectors.toList());

        JsonNode jsonNode = JacksonUtils.filterJsonNodeForPaths(ciphertextNode, pathsToBeDecrypted);

        if(! jsonNode.isEmpty(objectMapper.getSerializerProvider())) {
            JsonNode returnedDecryptedNode = encryptionServiceRestConnection.callDecrypt(jsonNode);
            decryptNode = JacksonUtils.merge(returnedDecryptedNode, decryptNode);
        }

        if(attributeAccessTypeMap.containsValue(AccessType.MASK)) {
            List<Attribute> attributesToBeMasked = attributeAccessTypeMap.keySet().stream()
                    .filter(attribute -> attributeAccessTypeMap.get(attribute) == AccessType.MASK).collect(Collectors.toList());
            decryptNode = maskingService.maskData(decryptNode, attributesToBeMasked);
        }

        return decryptNode;
    }


    public JsonNode decryptJson(Object ciphertextJson, String key, User user) throws IOException {

        List<String> roles = user.getRoles().stream().map(Role::getCode).collect(Collectors.toList());

//        Map<Attribute, AccessType> attributeAccessTypeMap = abacFilter.getAttributeAccessForRoles(roles,
//                abacConfiguration.getRoleAttributeAccessListForKey(key));

        Map<SecurityPolicyAttribute, Visibility> attributesVisibilityMap = decryptionPolicyConfiguration.getRoleAttributeAccessListForKey(key, roles);

        //JsonNode decryptedNode = decryptJson(ciphertextJson, attributeAccessTypeMap, user);

        JsonNode decryptedNode = decryptedJson(ciphertextJson, attributesVisibilityMap, user);

        return decryptedNode;
    }

    public <E,P> P decryptJson(Object ciphertextJson, String key, User user, Class<E> valueType) throws IOException {
        return ConvertClass.convertTo(decryptJson(ciphertextJson, key, user), valueType);
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