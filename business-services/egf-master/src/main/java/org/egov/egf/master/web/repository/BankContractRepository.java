package org.egov.egf.master.web.repository;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.RequestInfoWrapper;
import org.egov.egf.master.web.requests.BankResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BankContractRepository {

    private RestTemplate restTemplate;
    private String hostUrl;
    public static final String SEARCH_URL = "/egf-master/banks/_search?";

    public BankContractRepository(@Value("${egf.master.host.url}") String hostUrl, RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.hostUrl = hostUrl;
    }

    public BankContract findById(BankContract bankContract, RequestInfo requestInfo) {

        String url = String.format("%s%s", hostUrl, SEARCH_URL);
        StringBuffer content = new StringBuffer();
        if (bankContract.getId() != null) {
            content.append("id=" + bankContract.getId());
        }

        if (bankContract.getTenantId() != null) {
            content.append("&tenantId=" + bankContract.getTenantId());
        }
        url = url + content.toString();

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(requestInfo);
       
        BankResponse result = restTemplate.postForObject(url, requestInfoWrapper, BankResponse.class);

        if (result.getBanks() != null && result.getBanks().size() == 1) {
            return result.getBanks().get(0);
        } else {
            return null;
        }

    }

    public BankContract findByCode(BankContract bankContract) {

        String url = String.format("%s%s", hostUrl, SEARCH_URL);
        StringBuffer content = new StringBuffer();
        if (bankContract.getCode() != null) {
            content.append("code=" + bankContract.getCode());
        }

        if (bankContract.getTenantId() != null) {
            content.append("&tenantId=" + bankContract.getTenantId());
        }
        url = url + content.toString();
        BankResponse result = restTemplate.postForObject(url, null, BankResponse.class);

        if (result.getBanks() != null && result.getBanks().size() == 1) {
            return result.getBanks().get(0);
        } else {
            return null;
        }

    }
}