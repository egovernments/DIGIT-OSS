package org.egov.encryption.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SecurityPolicy {

    private String model = null;

    private SecurityPolicyUniqueIdentifier uniqueIdentifier = null;

    private List<SecurityPolicyAttribute> attributes = null;

    private List<SecurityPolicyRoleBasedDecryptionPolicy> roleBasedDecryptionPolicy = null;

}
