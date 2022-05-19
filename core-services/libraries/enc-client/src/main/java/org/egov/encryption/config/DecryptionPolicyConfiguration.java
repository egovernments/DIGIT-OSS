package org.egov.encryption.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.encryption.models.*;
import org.egov.encryption.util.MdmsFetcher;
import org.egov.mdms.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    private Map<String, List<SecurityPolicyAttribute>> modelAttributeAccessMap;

    private Map<String, List<SecurityPolicyRoleBasedDecryptionPolicy>> modelRoleBasedDecryptionPolicyMap;

    private Map<String, SecurityPolicyUniqueIdentifier> uniqueIdentifierMap;


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
        } catch (IOException e) {}

        initializeModelAttributeAccessMap(securityPolicyList);
        initializeRoleBasedDecryptionPolicyMap(securityPolicyList);
        initializeUniqueIdentifierMap(securityPolicyList);
    }

    public SecurityPolicyUniqueIdentifier getUniqueIdentifierForKey(String key) {
        return uniqueIdentifierMap.get(key);
    }

    public Map<SecurityPolicyAttribute, Visibility> getRoleAttributeAccessListForKey(RequestInfo requestInfo,String keyId, List<String> roles) {
        Map<SecurityPolicyAttribute, Visibility> mapping = new HashMap<>();
        List<String> plainRequestFields = requestInfo.getPlainRequestFields();

        List<SecurityPolicyAttribute> securityPolicyAttributesList = modelAttributeAccessMap.get(keyId);
        List<SecurityPolicyRoleBasedDecryptionPolicy> securityPolicyRoleBasedDecryptionPolicyList = modelRoleBasedDecryptionPolicyMap.get(keyId);

        Map<String, List<SecurityPolicyAttributeAccess>> roleSecurityPolicyAttributeAccessmap = makeRoleAttributeAccessMapping(securityPolicyRoleBasedDecryptionPolicyList);
        Map<String, SecurityPolicyAttribute> attributesMap = makeAttributeMap(securityPolicyAttributesList);


        for(String role: roles){
            if(!roleSecurityPolicyAttributeAccessmap.containsKey(role))
                continue;

            List<SecurityPolicyAttributeAccess> attributeList = roleSecurityPolicyAttributeAccessmap.get(role);

            for(SecurityPolicyAttributeAccess attributeAccess: attributeList){
                String attributeName = attributeAccess.getAttribute();
                SecurityPolicyAttribute attribute = attributesMap.get(attributeName);
                Visibility visibility;
              if(!CollectionUtils.isEmpty(plainRequestFields) && plainRequestFields.contains(attributeName)
                      && attributeAccess.getSecondLevelVisibility() != null){
                  String secondLevelVisibility = String.valueOf(attributeAccess.getSecondLevelVisibility());
                  visibility= Visibility.valueOf(secondLevelVisibility);
              }
              else {
                  String firstLevelVisibility = attributeAccess.getFirstLevelVisibility() != null ?
                          String.valueOf(attributeAccess.getFirstLevelVisibility()) : String.valueOf(attribute.getDefaultVisibility());
                  visibility = Visibility.valueOf(firstLevelVisibility);
              }
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

        return mapping;
    }

    private Map<String, List<SecurityPolicyAttributeAccess>> makeRoleAttributeAccessMapping(List<SecurityPolicyRoleBasedDecryptionPolicy> securityPolicyRoleBasedDecryptionPolicyList) {
        return securityPolicyRoleBasedDecryptionPolicyList.stream().collect(Collectors.toMap(SecurityPolicyRoleBasedDecryptionPolicy::getRole,
                SecurityPolicyRoleBasedDecryptionPolicy::getAttributeAccessList));
    }

    private Map<String, SecurityPolicyAttribute> makeAttributeMap(List<SecurityPolicyAttribute> securityPolicyAttributesList) {
        Map<String, SecurityPolicyAttribute> atrributesMap = new HashMap<>();

        for(SecurityPolicyAttribute securityPolicyAttribute : securityPolicyAttributesList){
            String filedName = securityPolicyAttribute.getName();
            atrributesMap.put(filedName, securityPolicyAttribute);
        }
        return atrributesMap;
    }

}
