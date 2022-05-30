package org.egov.encryption.models;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttributeAccess {

    private String attribute = null;

    private Visibility firstLevelVisibility = null;

    private Visibility secondLevelVisibility = null;

}
