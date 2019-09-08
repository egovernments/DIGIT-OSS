package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FundContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.FundResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FundContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/funds/_search?";

	public FundContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public FundContract findById(FundContract fundContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (fundContract.getId() != null) {
			content.append("id=" + fundContract.getId());
		}

		if (fundContract.getTenantId() != null) {
			content.append("&tenantId=" + fundContract.getTenantId());
		}
		url = url + content.toString();
		FundResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		
		result = restTemplate.postForObject(url, requestInfoWrapper, FundResponse.class);

		if (result.getFunds() != null && result.getFunds().size() == 1) {
			return result.getFunds().get(0);
		} else {
			return null;
		}

	}
}