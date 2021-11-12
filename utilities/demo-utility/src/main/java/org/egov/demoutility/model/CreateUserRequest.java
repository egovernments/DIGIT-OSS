package org.egov.demoutility.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;


@AllArgsConstructor
@Getter
@NoArgsConstructor
@Setter
public class CreateUserRequest {
	
    private RequestInfo requestInfo;

    @NotNull
    @Valid
    private UserRequest user;

   
    // TODO Update libraries to have uuid in request info
    private Long loggedInUserId() {
        return requestInfo.getUserInfo() == null ? null : requestInfo.getUserInfo().getId();
    }

}


