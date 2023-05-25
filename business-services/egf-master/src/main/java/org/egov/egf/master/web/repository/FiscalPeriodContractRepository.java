package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FiscalPeriodContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.FiscalPeriodResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FiscalPeriodContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/fiscalperiods/_search?";

	public FiscalPeriodContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public FiscalPeriodContract findById(FiscalPeriodContract fiscalPeriodContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (fiscalPeriodContract.getId() != null) {
			content.append("id=" + fiscalPeriodContract.getId());
		}

		if (fiscalPeriodContract.getTenantId() != null) {
			content.append("&tenantId=" + fiscalPeriodContract.getTenantId());
		}
		url = url + content.toString();
		FiscalPeriodResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		
		result = restTemplate.postForObject(url, requestInfoWrapper, FiscalPeriodResponse.class);

		if (result.getFiscalPeriods() != null && result.getFiscalPeriods().size() == 1) {
			return result.getFiscalPeriods().get(0);
		} else {
			return null;
		}

	}
}