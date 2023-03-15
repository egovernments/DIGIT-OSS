package org.egov.auditservice.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class VerificationRequest {

    @JsonProperty("objectId")
    private String objectId;

    @JsonProperty("keyValuePairs")
    private Map<String, Object> keyValuePairs = null;

    @JsonProperty
    private RequestInfo requestInfo;

}
