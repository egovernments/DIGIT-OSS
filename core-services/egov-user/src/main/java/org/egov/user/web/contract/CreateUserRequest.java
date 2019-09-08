package org.egov.user.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.RequestInfo;
import org.egov.user.domain.model.User;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class CreateUserRequest {
    private RequestInfo requestInfo;

    private UserRequest user;

    public User toDomain(boolean isCreate) {
        return user.toDomain(loggedInUserId(), isCreate);
    }
// TODO Update libraries to have uuid in request info
    private Long loggedInUserId() {
		return requestInfo.getUserInfo() == null ? null : requestInfo.getUserInfo().getId();
	}
    
}


