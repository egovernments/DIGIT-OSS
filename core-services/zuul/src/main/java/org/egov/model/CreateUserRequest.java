package org.egov.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.egov.common.contract.request.RequestInfo;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class CreateUserRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @NotNull
    @Valid
    private UserRequest user;

}
