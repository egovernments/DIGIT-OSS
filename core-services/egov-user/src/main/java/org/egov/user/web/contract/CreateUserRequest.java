package org.egov.user.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;
import org.egov.user.domain.model.User;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.annotation.JsonValue;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class CreateUserRequest {

	private RequestInfo requestInfo;

	@NotNull
	@Valid
	@Value("user")
	private UserRequest user;

	public User toDomain(boolean isCreate) {
		// user.toDomain(loggedInUserId(), isCreate);
		return user.toDomain(loggedInUserId(), isCreate);
	}

	// TODO Update libraries to have uuid in request info
	private Long loggedInUserId() {
		System.out.println("get user nfo : " + requestInfo.getUserInfo());
		return requestInfo.getUserInfo() == null ? null : requestInfo.getUserInfo().getId();
	}

}
