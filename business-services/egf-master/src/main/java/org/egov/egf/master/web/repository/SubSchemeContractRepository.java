package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.contract.SubSchemeContract;
import org.egov.egf.master.web.requests.SubSchemeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SubSchemeContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/subschemes/_search?";

	public SubSchemeContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public SubSchemeContract findById(SubSchemeContract subSchemeContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (subSchemeContract.getId() != null) {
			content.append("id=" + subSchemeContract.getId());
		}

		if (subSchemeContract.getTenantId() != null) {
			content.append("&tenantId=" + subSchemeContract.getTenantId());
		}
		url = url + content.toString();
		SubSchemeResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		
		result = restTemplate.postForObject(url, requestInfoWrapper, SubSchemeResponse.class);

		if (result.getSubSchemes() != null && result.getSubSchemes().size() == 1) {
			return result.getSubSchemes().get(0);
		} else {
			return null;
		}

	}
}