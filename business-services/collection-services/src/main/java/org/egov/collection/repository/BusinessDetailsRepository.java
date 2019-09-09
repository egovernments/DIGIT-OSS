package org.egov.collection.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.collection.web.contract.BusinessDetailsResponse;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Repository
@Slf4j
public class BusinessDetailsRepository {

	public static final Logger LOGGER = LoggerFactory.getLogger(BusinessDetailsRepository.class);
	
    @Autowired
    private RestTemplate restTemplate;

    private String url;

    public BusinessDetailsRepository(RestTemplate restTemplate,@Value("${egov.common.service.host}") final String commonServiceHost,
                                     @Value("${egov.services.get_businessdetails_by_codes}") final String url) {
        this.restTemplate = restTemplate;
        this.url = commonServiceHost + url;
    }

    public BusinessDetailsResponse getBusinessDetails(List<String> businessCodes,String tenantId,RequestInfo requestInfo) {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(requestInfo);
        String businessDetailsCodes = String.join(",", businessCodes);
        try {
            return restTemplate.postForObject(url, requestInfoWrapper,
                    BusinessDetailsResponse.class, tenantId, businessDetailsCodes);
        } catch (HttpClientErrorException e) {
            log.error("Unable to fetch business detail for {} and tenant id {} from egov-common-masters, " ,
                    businessCodes, tenantId, e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Unable to fetch business detail for {} and tenant id, " , businessCodes, tenantId, e);
            throw new CustomException("BUSINESS_DETAIL_SERVICE_ERROR", "Unable to fetch business detail from " +
                    "egov-common-masters, unknown error occurred");
        }
    }
}
