package org.egov.encryption.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KeyRoleAttributeAccess {

    private String key;
    private List<RoleAttributeAccess> roleAttributeAccessList;

}
