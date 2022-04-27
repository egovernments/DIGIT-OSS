package org.egov.encryption.models;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SecurityPolicyAttribute {

    private String name = null;

    private String jsonPath = null;

    private String patternId = null;

    private Visibility defaultVisibility = null;

}
