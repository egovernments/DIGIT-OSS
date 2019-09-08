package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.AccountCodePurposeContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.AccountCodePurposeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AccountCodePurposeContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/accountcodepurposes/_search?";

	public AccountCodePurposeContractRepository(@Value("${egf.master.host.url}") String hostUrl,
			RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public AccountCodePurposeContract findById(AccountCodePurposeContract accountCodePurposeContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (accountCodePurposeContract.getId() != null) {
			content.append("id=" + accountCodePurposeContract.getId());
		}

		if (accountCodePurposeContract.getTenantId() != null) {
			content.append("&tenantId=" + accountCodePurposeContract.getTenantId());
		}
		url = url + content.toString();
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		AccountCodePurposeResponse result;
		
		result = restTemplate.postForObject(url, requestInfoWrapper, AccountCodePurposeResponse.class);

		if (result.getAccountCodePurposes() != null && result.getAccountCodePurposes().size() == 1) {
			return result.getAccountCodePurposes().get(0);
		} else {
			return null;
		}

	}
}