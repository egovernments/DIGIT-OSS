package org.egov.encryption.models;


import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = {"jsonPath"})
@ToString
public class Attribute {

    private String jsonPath;
    private String maskingTechnique;
    private String type;

}