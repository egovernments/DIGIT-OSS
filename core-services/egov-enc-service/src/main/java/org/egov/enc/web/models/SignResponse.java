package org.egov.enc.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignResponse {

    @JsonProperty("value")
    private String value;

    @JsonProperty("signature")
    private String signature;

}
