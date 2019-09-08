package org.egov.user.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class UserDetail {
	private SecureUser secureUser;
	private List<Action> actions;
}
