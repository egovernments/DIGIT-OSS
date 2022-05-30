package org.egov.encryption.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleBasedDecryptionPolicy {

    private String role = null;

    private List<AttributeAccess> attributeAccessList = null;

}
