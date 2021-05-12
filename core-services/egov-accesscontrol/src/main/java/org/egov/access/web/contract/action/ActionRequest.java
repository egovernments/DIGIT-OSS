package org.egov.access.web.contract.action;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.access.domain.criteria.ActionSearchCriteria;
import org.egov.access.domain.model.Action;
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

public class ActionRequest {

	@NotNull
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	private List<String> roleCodes;
	private List<Long> featureIds;

	@Size(max = 50)
	private String tenantId;
	private Boolean enabled;
	private List<Action> actions;
	private String actionMaster;
	private String navigationURL;
	private String leftIcon;
	private String rightIcon;


	public ActionSearchCriteria toDomain() {
		return ActionSearchCriteria.builder().tenantId(tenantId).roleCodes(roleCodes).build();
	}
}
