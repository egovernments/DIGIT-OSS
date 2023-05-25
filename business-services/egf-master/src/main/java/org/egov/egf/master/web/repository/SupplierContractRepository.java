package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.contract.SupplierContract;
import org.egov.egf.master.web.requests.SupplierResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SupplierContractRepository {

	private RestTemplate restTemplate;
	private String hostUrl;
	public static final String SEARCH_URL = "/egf-master/suppliers/_search?";

	public SupplierContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.hostUrl = hostUrl;
	}

	public SupplierContract findById(SupplierContract supplierContract, RequestInfo requestInfo) {

		String url = String.format("%s%s", hostUrl, SEARCH_URL);
		StringBuffer content = new StringBuffer();
		if (supplierContract.getId() != null) {
			content.append("id=" + supplierContract.getId());
		}

		if (supplierContract.getTenantId() != null) {
			content.append("&tenantId=" + supplierContract.getTenantId());
		}
		url = url + content.toString();
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		SupplierResponse result;
		
		result = restTemplate.postForObject(url, requestInfoWrapper, SupplierResponse.class);

		if (result.getSuppliers() != null && result.getSuppliers().size() == 1) {
			return result.getSuppliers().get(0);
		} else {
			return null;
		}

	}
}