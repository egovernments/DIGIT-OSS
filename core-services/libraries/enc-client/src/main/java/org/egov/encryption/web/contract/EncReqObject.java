package org.egov.encryption.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * Encryption / Decryption Request Meta-data and Values
 */
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-10-11T17:31:52.360+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EncReqObject {

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("type")
    private String type = null;

    @JsonProperty("value")
    private Object value = null;

}
