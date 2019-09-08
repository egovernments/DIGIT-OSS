package org.egov.user.persistence.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.user.domain.model.Action;
import org.egov.user.persistence.dto.ActionRequest;
import org.egov.user.persistence.dto.ActionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ActionRestRepository {

	private RestTemplate restTemplate;
	private String url;
	@Value("${egov.mdms.actions}")
	private String actionFile;

	public ActionRestRepository(final RestTemplate restTemplate,
								@Value("${egov.services.accesscontrol.host}") final String accessControlHost,
								@Value("${egov.services.accesscontrol.action_search}") final String url) {
		this.restTemplate = restTemplate;
		this.url = accessControlHost + url;
	}

	/**
	 * get the list of Actions based on RoleCodes and tenantId from access-control
	 * @param roleCodes
	 * @param tenantId
	 * @return
	 */
	public List<Action> getActionByRoleCodes(final List<String> roleCodes, String tenantId) {
		String actionFileName = "";
		actionFileName = actionFile;
		ActionRequest actionRequest = ActionRequest.builder()
				.requestInfo(new RequestInfo())
				.roleCodes(roleCodes)
				.tenantId(tenantId)
				.actionMaster(actionFileName)
				.build();

		final ActionResponse actionResponse = restTemplate.postForObject(url, actionRequest, ActionResponse.class);
		return actionResponse.toDomainActions();
	}

}
