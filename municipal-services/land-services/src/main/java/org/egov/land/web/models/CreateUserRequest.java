package org.egov.land.web.models;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Getter
@NoArgsConstructor
@Builder
public class CreateUserRequest {

    @JsonProperty("requestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("user")
    private OwnerInfo user;

}
