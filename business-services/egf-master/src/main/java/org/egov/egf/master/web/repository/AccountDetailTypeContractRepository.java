package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.AccountDetailTypeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AccountDetailTypeContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/accountdetailtypes/_search?";

	public AccountDetailTypeContractRepository(@Value("${egf.master.host.url}") String hostUrl,
			RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public AccountDetailTypeContract findById(AccountDetailTypeContract accountDetailTypeContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (accountDetailTypeContract.getId() != null) {
			content.append("id=" + accountDetailTypeContract.getId());
		}

		if (accountDetailTypeContract.getTenantId() != null) {
			content.append("&tenantId=" + accountDetailTypeContract.getTenantId());
		}
		url = url + content.toString();
		AccountDetailTypeResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		
		result = restTemplate.postForObject(url, requestInfoWrapper, AccountDetailTypeResponse.class);


		if (result.getAccountDetailTypes() != null && result.getAccountDetailTypes().size() == 1) {
			return result.getAccountDetailTypes().get(0);
		} else {
			return null;
		}

	}
}