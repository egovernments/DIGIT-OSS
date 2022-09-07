package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RegistrationSearchRequest {
        @JsonProperty("RequestInfo")
        private RequestInfo requestInfo = null;
        private String registrationId = null;
        private Long lastModifiedTime = null;

}

