package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.AccountDetailKeyContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.AccountDetailKeyResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AccountDetailKeyContractRepository {
	
	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/accountdetailkeys/_search?";

	public AccountDetailKeyContractRepository(@Value("${egf.master.host.url}") String hostUrl,
			RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public AccountDetailKeyContract findById(AccountDetailKeyContract accountDetailKeyContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (accountDetailKeyContract.getId() != null) {
			content.append("id=" + accountDetailKeyContract.getId());
		}

		if (accountDetailKeyContract.getTenantId() != null) {
			content.append("&tenantId=" + accountDetailKeyContract.getTenantId());
		}
		url = url + content.toString();
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		AccountDetailKeyResponse result;
		
		result = restTemplate.postForObject(url, requestInfoWrapper, AccountDetailKeyResponse.class);

		if (result.getAccountDetailKeys() != null && result.getAccountDetailKeys().size() == 1) {
			return result.getAccountDetailKeys().get(0);
		} else {
			return null;
		}

	}
}