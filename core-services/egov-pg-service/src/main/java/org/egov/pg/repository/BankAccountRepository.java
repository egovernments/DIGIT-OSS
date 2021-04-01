package org.egov.pg.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.config.AppProperties;
import org.egov.pg.models.BankAccount;
import org.egov.pg.models.BankAccountResponse;
import org.egov.pg.web.models.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Repository
public class BankAccountRepository {

    private AppProperties appProperties;
    private RestTemplate restTemplate;

    @Autowired
    BankAccountRepository(RestTemplate restTemplate, AppProperties appProperties) {
        this.restTemplate = restTemplate;
        this.appProperties = appProperties;
    }

    public BankAccount getBankAccountsById( RequestInfo requestInfo, String tenantId) {
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("tenantId", tenantId);

        String uri = UriComponentsBuilder
                .fromHttpUrl(appProperties.getBankAccountHost())
                .path(appProperties.getBankAccountPath())
                .queryParams(queryParams)
                .build()
                .toUriString();

        RequestInfoWrapper wrapper = new RequestInfoWrapper(requestInfo);

        try {
            BankAccountResponse response = restTemplate.postForObject(uri, wrapper, BankAccountResponse.class);
            if( response.getBankAccounts().size() == 1 )
                return response.getBankAccounts().get(0);
            else {
                log.error("Expected to find one bank account for tenant " +
                        "{}, instead found {}", tenantId, response.getBankAccounts().size());
                throw new CustomException("BANK_ACCOUNT_FETCH_ERROR", "Unable to fetch related bank account");
            }
        } catch (HttpClientErrorException e) {
            log.error("Unable to fetch bank account for tenant " + tenantId, e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Unable to fetch bank account for tenant "+ tenantId, e);
            throw new CustomException("FINANCIALS_SEARCH_ERROR", "Failed to fetch bank account, unknown error " +
                    "occurred");
        }
    }

}
