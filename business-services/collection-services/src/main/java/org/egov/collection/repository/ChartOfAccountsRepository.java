package org.egov.collection.repository;

import org.egov.collection.web.contract.ChartOfAccount;
import org.egov.collection.web.contract.ChartOfAccountsResponse;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ChartOfAccountsRepository {

	public static final Logger LOGGER = LoggerFactory.getLogger(ChartOfAccountsRepository.class);

	
    @Autowired
    private RestTemplate restTemplate;

    private String url;

    public ChartOfAccountsRepository(final RestTemplate restTemplate,@Value("${egov.egfmasters.hostname}") final String egfServiceHost,
                                     @Value("${coa.search.uri}") final String url) {
        this.restTemplate = restTemplate;
        this.url = egfServiceHost + url;

    }

    public List<ChartOfAccount> getChartOfAccounts(final List<String> accountCodes,final String tenantId,final RequestInfo requestInfo) {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(requestInfo);
        String chartOfAccountCodes = String.join(",", accountCodes);
        LOGGER.info("URI: "+url);
        LOGGER.info("tenantid: "+tenantId);
        return restTemplate.postForObject(url, requestInfoWrapper,
                ChartOfAccountsResponse.class,tenantId,chartOfAccountCodes).getChartOfAccounts();
    }
}
