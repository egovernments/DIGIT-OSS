package org.egov.persistence.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.egov.domain.model.User;
import org.egov.web.contract.ResponseInfo;
import org.springframework.util.CollectionUtils;

import java.util.List;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class UserSearchResponse {
	@JsonProperty("responseInfo")
	ResponseInfo responseInfo;

	@JsonProperty("user")
	List<UserSearchResponseContent> users;

	public boolean isMatchingUserPresent() {
		return !CollectionUtils.isEmpty(users);
	}

	public User toDomainUser() {
		return users.get(0).toDomainUser();
	}

}
