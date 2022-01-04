package org.egov.access.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class RoleAction {

	@JsonProperty("rolecode")
	private String roleCode;

	@JsonProperty("actionid")
	private long actionId;

	private String tenantId;

	private Action action;

}
