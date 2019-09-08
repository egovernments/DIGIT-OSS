package org.egov.egf.master.web.repository;

import java.text.SimpleDateFormat;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FinancialYearContract;
import org.egov.egf.master.web.contract.FinancialYearSearchContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.FinancialYearResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

@Repository
public class FinancialYearContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/financialyears/_search?";

	public FinancialYearContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public FinancialYearContract findById(FinancialYearContract financialYearContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (financialYearContract.getId() != null) {
			content.append("id=" + financialYearContract.getId());
		}

		if (financialYearContract.getTenantId() != null) {
			content.append("&tenantId=" + financialYearContract.getTenantId());
		}
		url = url + content.toString();
		FinancialYearResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);

		result = restTemplate.postForObject(url, requestInfoWrapper, FinancialYearResponse.class);

		if (result.getFinancialYears() != null && result.getFinancialYears().size() == 1) {
			return result.getFinancialYears().get(0);
		} else {
			return null;
		}

	}

	public FinancialYearContract findByAsOnDate(FinancialYearSearchContract financialYearSearchContract,
			RequestInfo requestInfo) {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (financialYearSearchContract.getAsOnDate() != null) {
			content.append("asOnDate=" + sdf.format(financialYearSearchContract.getAsOnDate()));
		}

		if (financialYearSearchContract.getTenantId() != null) {
			content.append("&tenantId=" + financialYearSearchContract.getTenantId());
		}
		url = url + content.toString();
		FinancialYearResponse result;
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		result = restTemplate.postForObject(url, requestInfoWrapper, FinancialYearResponse.class);

		if (result.getFinancialYears() != null && result.getFinancialYears().size() == 1) {
			return result.getFinancialYears().get(0);
		} else {
			return null;
		}

	}
}
