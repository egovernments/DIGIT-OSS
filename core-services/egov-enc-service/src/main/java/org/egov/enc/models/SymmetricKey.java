package org.egov.enc.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SymmetricKey {

    private int id;

    private Integer keyId;

    private String secretKey;

    private String initialVector;

    private boolean active;

    private String tenantId;

}
