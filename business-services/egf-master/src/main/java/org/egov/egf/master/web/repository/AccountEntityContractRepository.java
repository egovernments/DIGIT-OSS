package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.AccountEntityContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.AccountEntityResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AccountEntityContractRepository {
	
	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/accountentities/_search?";

	public AccountEntityContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public AccountEntityContract findById(AccountEntityContract accountEntityContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (accountEntityContract.getId() != null) {
			content.append("id=" + accountEntityContract.getId());
		}

		if (accountEntityContract.getTenantId() != null) {
			content.append("&tenantId=" + accountEntityContract.getTenantId());
		}
		url = url + content.toString();
		AccountEntityResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		
		result = restTemplate.postForObject(url, requestInfoWrapper, AccountEntityResponse.class);


		if (result.getAccountEntities() != null && result.getAccountEntities().size() == 1) {
			return result.getAccountEntities().get(0);
		} else {
			return null;
		}

	}
}