package org.egov.encryption.models;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttributeVisibility {

    private Attribute attribute;
    private Visibility visibility;

}
