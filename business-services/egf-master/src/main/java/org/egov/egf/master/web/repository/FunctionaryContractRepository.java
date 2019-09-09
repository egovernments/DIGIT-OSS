package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FunctionaryContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.FunctionaryResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FunctionaryContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/functionaries/_search?";

	public FunctionaryContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public FunctionaryContract findById(FunctionaryContract functionaryContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (functionaryContract.getId() != null) {
			content.append("id=" + functionaryContract.getId());
		}

		if (functionaryContract.getTenantId() != null) {
			content.append("&tenantId=" + functionaryContract.getTenantId());
		}
		url = url + content.toString();
		FunctionaryResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		
		result = restTemplate.postForObject(url, requestInfoWrapper, FunctionaryResponse.class);


		if (result.getFunctionaries() != null && result.getFunctionaries().size() == 1) {
			return result.getFunctionaries().get(0);
		} else {
			return null;
		}

	}
}