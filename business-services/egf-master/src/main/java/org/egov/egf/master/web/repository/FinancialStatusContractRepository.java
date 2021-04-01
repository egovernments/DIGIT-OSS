package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FinancialStatusContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.FinancialStatusResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FinancialStatusContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/financialstatuses/_search?";

	public FinancialStatusContractRepository(@Value("${egf.master.host.url}") String hostUrl,
			RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public FinancialStatusContract findById(FinancialStatusContract financialStatusContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (financialStatusContract.getId() != null) {
			content.append("id=" + financialStatusContract.getId());
		}

		if (financialStatusContract.getTenantId() != null) {
			content.append("&tenantId=" + financialStatusContract.getTenantId());
		}
		url = url + content.toString();
		FinancialStatusResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		
		result = restTemplate.postForObject(url, requestInfoWrapper, FinancialStatusResponse.class);

		if (result.getFinancialStatuses() != null && result.getFinancialStatuses().size() == 1) {
			return result.getFinancialStatuses().get(0);
		} else {
			return null;
		}

	}

	public FinancialStatusContract findByModuleCode(FinancialStatusContract financialStatusContract) {

	        String url = String.format("%s%s", hostUrl, SEARCH_URL);
	        StringBuffer content = new StringBuffer();
	        if (financialStatusContract.getCode() != null) {
	                content.append("code=" + financialStatusContract.getCode());
	        }

	        if (financialStatusContract.getModuleType() != null) {
	                content.append("&moduleType=" + financialStatusContract.getModuleType());
	        }
	        url = url + content.toString();
	        FinancialStatusResponse result = restTemplate.postForObject(url, null, FinancialStatusResponse.class);

	        if (result.getFinancialStatuses() != null && result.getFinancialStatuses().size() == 1) {
	                return result.getFinancialStatuses().get(0);
	        } else {
	                return null;
	        }

	}
}