package org.egov.access.web.contract.action;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.Role;
import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RoleActionsRequest {

	@NotNull
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	private Role role;
	private String tenantId;
	private List<Action> actions;

}
