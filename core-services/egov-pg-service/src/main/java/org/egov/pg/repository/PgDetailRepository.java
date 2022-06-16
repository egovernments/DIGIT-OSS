package org.egov.pg.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.config.AppProperties;
import org.egov.pg.models.PgDetail;
import org.egov.pg.models.PgDetailRequest;
import org.egov.pg.models.PgDetailResponse;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class PgDetailRepository {

    private AppProperties appProperties;
    private RestTemplate restTemplate;

    @Autowired
    PgDetailRepository(RestTemplate restTemplate, AppProperties appProperties) {
        this.restTemplate = restTemplate;
        this.appProperties = appProperties;
    }

    public PgDetail getPgDetailByTenantId( RequestInfo requestInfo, String tenantId) {
    	List<PgDetail> pgDetails = new ArrayList<PgDetail>();
    	PgDetail pgDetail = new PgDetail();
        pgDetail.setTenantId(tenantId);
        pgDetails.add(pgDetail);
    	PgDetailRequest pgDetailRequest = new PgDetailRequest(requestInfo,pgDetails);
    	String uri = UriComponentsBuilder
                .fromHttpUrl(appProperties.getPgDetailHost())
                .path(appProperties.getPgDetailPath())
                .build()
                .toUriString();
    	
    	 

        try {
        	PgDetailResponse response = restTemplate.postForObject(uri, pgDetailRequest, PgDetailResponse.class);
            if( response.getPgDetail().size() == 1 )
                return response.getPgDetail().get(0);
            else {
                log.error("Expected to fetch payment gateway detail for tenant " +
                        "{}, instead found {}", tenantId, response.getPgDetail().size());
                throw new CustomException("PG_DETAIL_FETCH_ERROR", "Online Payment is not allowed for selected Cant Board");
            }
        } catch (HttpClientErrorException e) {
            log.error("Unable to fetch payment gateway detail for tenant " + tenantId, e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Unable to fetch payment gateway detail for tenant "+ tenantId, e);
            throw new CustomException("PG_DETAIL_SEARCH_ERROR", "Failed to fetch Payment Gateway Detail, unknown error " +
                    "occurred");
        }
    }

}
