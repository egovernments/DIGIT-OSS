package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StatusInfo {

    @Valid
    @JsonProperty("statusCode")
    private String statusCode;

    @Valid
    @JsonProperty("statusMessage")
    private String statusMessage;

    @Valid
    @JsonProperty("errorMessage")
    private String errorMessage;
}
