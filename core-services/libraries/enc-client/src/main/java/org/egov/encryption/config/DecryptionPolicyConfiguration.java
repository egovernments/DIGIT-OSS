package org.egov.encryption.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.encryption.models.*;
import org.egov.encryption.util.MdmsFetcher;
import org.egov.mdms.model.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class DecryptionPolicyConfiguration {

    @Autowired
    private EncProperties encProperties;

    @Autowired
    private MdmsFetcher mdmsFetcher;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, List<Attribute>> modelAttributeAccessMap;

    private Map<String, List<RoleBasedDecryptionPolicy>> modelRoleBasedDecryptionPolicyMap;

    private Map<String, UniqueIdentifier> uniqueIdentifierMap;


    void initializeModelAttributeAccessMap(List<SecurityPolicy> modelRoleAttributeAccessList) {
        modelAttributeAccessMap = modelRoleAttributeAccessList.stream()
                .collect(Collectors.toMap(SecurityPolicy::getModel,
                        SecurityPolicy::getAttributes));
    }

    void initializeRoleBasedDecryptionPolicyMap(List<SecurityPolicy> modelRoleAttributeAccessList) {
        modelRoleBasedDecryptionPolicyMap = modelRoleAttributeAccessList.stream()
                .collect(Collectors.toMap(SecurityPolicy::getModel,
                        SecurityPolicy::getRoleBasedDecryptionPolicy));
    }

    void initializeUniqueIdentifierMap(List<SecurityPolicy> modelRoleAttributeAccessList) {
        uniqueIdentifierMap = modelRoleAttributeAccessList.stream()
                .collect(Collectors.toMap(SecurityPolicy::getModel,
                        SecurityPolicy::getUniqueIdentifier));
    }

    @PostConstruct
    void initializeModelAttributeAccessMapFromMdms() {
        List<SecurityPolicy> securityPolicyList = null;
        try {
            MasterDetail masterDetail = MasterDetail.builder().name(EncClientConstants.MDMS_SECURITY_POLICY_MASTER_NAME).build();
            ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(EncClientConstants.MDMS_MODULE_NAME)
                    .masterDetails(Arrays.asList(masterDetail)) .build();

            MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(encProperties.getStateLevelTenantId())
                    .moduleDetails(Arrays.asList(moduleDetail)).build();

            MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().requestInfo(RequestInfo.builder().build())
                    .mdmsCriteria(mdmsCriteria).build();

            ResponseEntity<MdmsResponse> response =
                    restTemplate.postForEntity(encProperties.getEgovMdmsHost() + encProperties.getEgovMdmsSearchEndpoint(),
                            mdmsCriteriaReq, MdmsResponse.class);

            JSONArray securityPolicyJson = response.getBody().getMdmsRes().get(EncClientConstants.MDMS_MODULE_NAME)
                    .get(EncClientConstants.MDMS_SECURITY_POLICY_MASTER_NAME);

            ObjectReader reader = objectMapper.readerFor(objectMapper.getTypeFactory().constructCollectionType(List.class,
                    SecurityPolicy.class));
            securityPolicyList = reader.readValue(securityPolicyJson.toString());
        } catch (IOException e) {
        }

        initializeModelAttributeAccessMap(securityPolicyList);
        initializeRoleBasedDecryptionPolicyMap(securityPolicyList);
        initializeUniqueIdentifierMap(securityPolicyList);
    }

    public UniqueIdentifier getUniqueIdentifierForModel(String model) {
        return uniqueIdentifierMap.get(model);
    }

    public Map<Attribute, Visibility> getRoleAttributeAccessListForModel(RequestInfo requestInfo, String model, List<String> roles) {
        Map<Attribute, Visibility> mapping = new HashMap<>();
        try {
            List<Attribute> attributesList = modelAttributeAccessMap.get(model);
            List<RoleBasedDecryptionPolicy> roleBasedDecryptionPolicyList = modelRoleBasedDecryptionPolicyMap.get(model);

            boolean isAttributeListEmpty = CollectionUtils.isEmpty(attributesList);
            boolean isroleBasedDecryptionPolicyListEmpty = CollectionUtils.isEmpty(roleBasedDecryptionPolicyList);

            if (isAttributeListEmpty) {
                throw new CustomException("DECRYPTION_NULL_ERROR", "Attribute list is empty");
            }

            if (!isAttributeListEmpty && isroleBasedDecryptionPolicyListEmpty) {
                for (Attribute attribute : attributesList) {
                    String defaultVisibility = String.valueOf(attribute.getDefaultVisibility());
                    Visibility visibility = Visibility.valueOf(defaultVisibility);
                    if (mapping.containsKey(attribute)) {
                        if (mapping.get(attribute).ordinal() > visibility.ordinal()) {
                            mapping.remove(attribute);
                            mapping.put(attribute, visibility);
                        }
                    } else {
                        mapping.put(attribute, visibility);
                    }
                }

            }

            if(!isAttributeListEmpty && !isroleBasedDecryptionPolicyListEmpty) {
                Map<String, List<AttributeAccess>> roleSecurityPolicyAttributeAccessmap = makeRoleAttributeAccessMapping(roleBasedDecryptionPolicyList);
                Map<String, Attribute> attributesMap = makeAttributeMap(attributesList);

                List<String> secondLevelVisibility = new ArrayList<>();

                for (String role : roles) {
                    if (!roleSecurityPolicyAttributeAccessmap.containsKey(role))
                        continue;

                    List<AttributeAccess> attributeList = roleSecurityPolicyAttributeAccessmap.get(role);

                    for (AttributeAccess attributeAccess : attributeList) {
                        String attributeName = attributeAccess.getAttribute();
                        Attribute attribute = attributesMap.get(attributeName);
                        if (requestInfo.getPlainRequestAccess() != null && !CollectionUtils.isEmpty(requestInfo.getPlainRequestAccess().getPlainRequestFields())
                                && requestInfo.getPlainRequestAccess().getPlainRequestFields().contains(attributeName)
                                && attributeAccess.getSecondLevelVisibility() != null) {
                            secondLevelVisibility.add(attributeName);
                        }
                        String firstLevelVisibility = attributeAccess.getFirstLevelVisibility() != null ?
                                String.valueOf(attributeAccess.getFirstLevelVisibility()) : String.valueOf(attribute.getDefaultVisibility());
                        Visibility visibility = Visibility.valueOf(firstLevelVisibility);
                        if(mapping.containsKey(attribute)){
                            if(mapping.get(attribute).ordinal() > visibility.ordinal()){
                                mapping.remove(attribute);
                                mapping.put(attribute, visibility);
                            }
                        }
                        else{
                            mapping.put(attribute, visibility);
                        }
                    }
                }

                if (requestInfo.getPlainRequestAccess() != null)
                    requestInfo.getPlainRequestAccess().setPlainRequestFields(secondLevelVisibility);
            }

            return mapping;
        } catch (Exception e) {
            throw new CustomException("DECRYPTION_NULL_ERROR", "Error in decryption process");
        }
    }

    private Map<String, List<AttributeAccess>> makeRoleAttributeAccessMapping(List<RoleBasedDecryptionPolicy> roleBasedDecryptionPolicyList) {
        return roleBasedDecryptionPolicyList.stream().collect(Collectors.toMap(RoleBasedDecryptionPolicy::getRole,
                RoleBasedDecryptionPolicy::getAttributeAccessList));
    }

    private Map<String, Attribute> makeAttributeMap(List<Attribute> attributesList) {
        Map<String, Attribute> atrributesMap = new HashMap<>();

        for (Attribute attribute : attributesList) {
            String filedName = attribute.getName();
            atrributesMap.put(filedName, attribute);
        }
        return atrributesMap;
    }

    public UniqueIdentifier getSecurityPolicyUniqueIdentifier(String model) {
        return uniqueIdentifierMap.get(model);
    }

}
