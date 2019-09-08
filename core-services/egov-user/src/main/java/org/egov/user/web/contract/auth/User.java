package org.egov.user.web.contract.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@Builder
//This class is serialized to Redis
public class User implements Serializable {
	private static final long serialVersionUID = -1053170163821651014L;
	private Long id;
	private String uuid;
	private String userName;
	private String name;
	private String mobileNumber;
	private String emailId;
	private String locale;
	private String type;
	private Set<Role> roles;
	private boolean active;
	private String tenantId;
}