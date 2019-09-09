package org.egov.collection.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillRequest;
import org.egov.collection.web.contract.BillResponse;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

import static java.util.Objects.isNull;

@Service
@Slf4j
public class BillingServiceRepository {
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ApplicationProperties applicationProperties;

    public BillResponse getApportionListFromBillingService(RequestInfo requestInfo, Bill apportionBill) {
        log.info("Apportion Paid Amount in Billing Service");
        StringBuilder uriForApportion = new StringBuilder();
        uriForApportion
                .append(applicationProperties.getBillingServiceHostName())
                .append(applicationProperties.getBillingServiceApportion());
        //.append("&tenantId=").append(apportionBill.getTenantId());
        log.info("URI For Apportioning Paid Amount in Billing Service: "
                + uriForApportion.toString());
        BillRequest billRequest = new BillRequest();
        billRequest.setRequestInfo(requestInfo);
        billRequest.getBills().add(apportionBill);
        try {
            BillResponse response = restTemplate.postForObject(uriForApportion.toString(),
                    billRequest, BillResponse.class);

            if (!isNull(response.getBill()) && !isNull(response.getBill().get(0).getBillDetails()) && !response
                    .getBill().get(0).getBillDetails().isEmpty())
                return response;
            else
                throw new CustomException("APPORTION_FAILED", "Apportioning from billing service failed");

        } catch (RestClientException e) {
            log.error("Error while apportioning paid amount from billing service. ", e);
            throw new CustomException("APPORTION_FAILED", "Apportioning from billing service failed");
        }
    }


    public List<Bill> fetchBill(RequestInfo requestInfo, String tenantId, String billId) {
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("tenantId", tenantId);
        queryParams.add("billId", billId);

        String uri = UriComponentsBuilder
                .fromHttpUrl(applicationProperties.getBillingServiceHostName())
                .path(applicationProperties.getSearchBill())
                .queryParams(queryParams)
                .build()
                .toUriString();

        RequestInfoWrapper wrapper = new RequestInfoWrapper(requestInfo);

        try {
            BillResponse response = restTemplate.postForObject(uri, wrapper, BillResponse.class);
            return response.getBill();
        } catch (HttpClientErrorException e) {
            log.error("Unable to fetch bill for Bill ID: {} in tenant {}", billId, tenantId, e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Unable to fetch bill for Bill ID: {} in tenant {}", billId, tenantId, e);
            throw new CustomException("BILLING_SERVICE_ERROR", "Failed to fetch bill, unknown error occurred");
        }
    }
}
