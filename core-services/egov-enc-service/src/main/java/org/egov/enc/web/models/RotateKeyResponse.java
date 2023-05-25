package org.egov.enc.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RotateKeyResponse {

    @JsonProperty("acknowledged")
    private boolean acknowledged;

}
