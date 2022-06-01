package org.egov.encryption.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleBasedDecryptionPolicy {

    private List<String> roles = null;

    private List<AttributeAccess> attributeAccessList = null;

}
