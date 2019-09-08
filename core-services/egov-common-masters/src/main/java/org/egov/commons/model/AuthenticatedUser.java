package org.egov.commons.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class AuthenticatedUser {
	private String mobileNumber;
	private String emailId;
	private String name;
	private Long id;
	private boolean anonymousUser;
	private List<Role> roles;
	private List<UserType> type;

}
