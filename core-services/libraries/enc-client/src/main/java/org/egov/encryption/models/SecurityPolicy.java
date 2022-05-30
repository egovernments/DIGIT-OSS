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

    private UniqueIdentifier uniqueIdentifier = null;

    private List<Attribute> attributes = null;

    private List<RoleBasedDecryptionPolicy> roleBasedDecryptionPolicy = null;

}
