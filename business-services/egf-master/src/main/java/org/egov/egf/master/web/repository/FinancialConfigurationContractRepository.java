package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FinancialConfigurationContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.FinancialConfigurationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

@Repository
public class FinancialConfigurationContractRepository {

	public static final String SEARCH_URL = "/egf-master/financialconfigurations/_search?";
	private RestTemplate restTemplate;
	private String hostUrl;
	private String fetchDataFrom;

	public FinancialConfigurationContractRepository(@Value("${egf.master.host.url}") String hostUrl,
			@Value("${fetch_data_from}") String fetchDataFrom, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
		this.fetchDataFrom = fetchDataFrom;
	}

	public FinancialConfigurationContract findById(FinancialConfigurationContract financialConfigurationContract,
			RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (financialConfigurationContract.getId() != null) {
			content.append("id=" + financialConfigurationContract.getId());
		}

		if (financialConfigurationContract.getTenantId() != null) {
			content.append("&tenantId=" + financialConfigurationContract.getTenantId());
		}
		url = url + content.toString();
		FinancialConfigurationResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);

		result = restTemplate.postForObject(url, requestInfoWrapper, FinancialConfigurationResponse.class);

		if (result.getFinancialConfigurations() != null && result.getFinancialConfigurations().size() == 1) {
			return result.getFinancialConfigurations().get(0);
		} else {
			return null;
		}

	}

	public FinancialConfigurationContract findByModuleAndName(
			FinancialConfigurationContract financialConfigurationContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (financialConfigurationContract.getName() != null) {
			content.append("name=" + financialConfigurationContract.getName());
		}

		if (financialConfigurationContract.getModule() != null) {
			content.append("&module=" + financialConfigurationContract.getModule());
		}

		if (financialConfigurationContract.getTenantId() != null) {
			content.append("&tenantId=" + financialConfigurationContract.getTenantId());
		}
		url = url + content.toString();
		FinancialConfigurationResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		result = restTemplate.postForObject(url, requestInfoWrapper, FinancialConfigurationResponse.class);

		if (result.getFinancialConfigurations() != null && result.getFinancialConfigurations().size() == 1) {
			return result.getFinancialConfigurations().get(0);
		} else {
			return null;
		}

	}

	public String fetchDataFrom() {
		return fetchDataFrom;
	}

}