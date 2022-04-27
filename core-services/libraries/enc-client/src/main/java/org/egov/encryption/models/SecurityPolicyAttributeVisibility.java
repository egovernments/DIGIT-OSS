package org.egov.encryption.models;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SecurityPolicyAttributeVisibility {

    private SecurityPolicyAttribute attribute;
    private Visibility visibility;

}
