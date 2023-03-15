package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.contract.SchemeContract;
import org.egov.egf.master.web.requests.SchemeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SchemeContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/schemes/_search?";

	public SchemeContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public SchemeContract findById(SchemeContract schemeContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (schemeContract.getId() != null) {
			content.append("id=" + schemeContract.getId());
		}

		if (schemeContract.getTenantId() != null) {
			content.append("&tenantId=" + schemeContract.getTenantId());
		}
		url = url + content.toString();
		SchemeResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		
		result = restTemplate.postForObject(url, requestInfoWrapper, SchemeResponse.class);


		if (result.getSchemes() != null && result.getSchemes().size() == 1) {
			return result.getSchemes().get(0);
		} else {
			return null;
		}

	}
}