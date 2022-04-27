package org.egov.encryption.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SecurityPolicyRoleBasedDecryptionPolicy {

    private String role = null;

    private List<SecurityPolicyAttributeAccess> attributeAccessList = null;

}
