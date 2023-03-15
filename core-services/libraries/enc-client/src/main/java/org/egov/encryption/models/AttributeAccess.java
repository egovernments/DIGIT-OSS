package org.egov.encryption.models;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
public class AttributeAccess {

    private Attribute attribute;
    private AccessType accessType;

    public AttributeAccess(Attribute attribute) {
        this.attribute = attribute;
        this.accessType = AccessType.PLAIN;
    }

    @Override
    public String toString() {
        return attribute + ", AccessType : " + accessType;
    }
}