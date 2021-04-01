package org.egov.encryption.accesscontrol;

import org.egov.encryption.models.AccessType;
import org.egov.encryption.models.Attribute;
import org.egov.encryption.models.AttributeAccess;
import org.egov.encryption.models.RoleAttributeAccess;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AbacFilter {


    public Map<Attribute, AccessType> getAttributeAccessForRoles(
            List<String> roles, Map<String, List<AttributeAccess>> roleAttributeAccessMapping) {
        Map<Attribute, AccessType> attributeAccessTypeMap = new HashMap<>();

        for(String role : roles) {
            if(! roleAttributeAccessMapping.containsKey(role))
                continue;
            List<AttributeAccess> attributeAccessList = roleAttributeAccessMapping.get(role);
            for(AttributeAccess attributeAccess : attributeAccessList) {
                Attribute attribute = attributeAccess.getAttribute();
                AccessType accessType = attributeAccess.getAccessType();
                if(attributeAccessTypeMap.containsKey(attribute)) {
                    if(attributeAccessTypeMap.get(attribute).ordinal() > accessType.ordinal()) {
                        attributeAccessTypeMap.remove(attribute);
                        attributeAccessTypeMap.put(attribute, accessType);
                    }
                } else {
                    attributeAccessTypeMap.put(attribute, accessType);
                }
            }
        }

        return attributeAccessTypeMap;
    }

    public Map<Attribute, AccessType> getAttributeAccessForRoles(List<String> roles, List<RoleAttributeAccess> roleAttributeAccessList) {
        Map<String, List<AttributeAccess>> roleAttributeAccessMapping = makeRoleAttributeAccessMapping(roleAttributeAccessList);
        return getAttributeAccessForRoles(roles, roleAttributeAccessMapping);
    }

    private Map<String, List<AttributeAccess>> makeRoleAttributeAccessMapping(List<RoleAttributeAccess> roleAttributeAccessList) {
        return roleAttributeAccessList.stream().collect(Collectors.toMap(RoleAttributeAccess::getRoleCode,
                RoleAttributeAccess::getAttributeAccessList));
    }

}