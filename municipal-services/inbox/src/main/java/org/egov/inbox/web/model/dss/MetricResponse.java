package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MetricResponse {

        @Valid
        @JsonProperty("statusInfo")
        private StatusInfo statusInfo;

        @Valid
        @JsonProperty("responseData")
        private ResponseData responseData;

}
