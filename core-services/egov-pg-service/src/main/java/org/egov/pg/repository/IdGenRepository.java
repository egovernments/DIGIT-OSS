package org.egov.pg.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.config.AppProperties;
import org.egov.pg.models.IdGenerationRequest;
import org.egov.pg.models.IdGenerationResponse;
import org.egov.pg.models.IdRequest;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Repository
@Slf4j
public class IdGenRepository {

    private AppProperties appProperties;
    private RestTemplate restTemplate;

    @Autowired
    IdGenRepository(RestTemplate restTemplate, AppProperties appProperties) {
        this.restTemplate = restTemplate;
        this.appProperties = appProperties;
    }


    public IdGenerationResponse getId(RequestInfo requestInfo, String tenantId, String name, String format, int count) {

        List<IdRequest> reqList = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            reqList.add(new IdRequest(name, tenantId, format));
        }
        IdGenerationRequest req = new IdGenerationRequest(requestInfo, reqList);
        String uri = UriComponentsBuilder
                .fromHttpUrl(appProperties.getIdGenHost())
                .path(appProperties.getIdGenPath())
                .build()
                .toUriString();
        try {
            return restTemplate.postForObject(uri, req,
                    IdGenerationResponse.class);
        } catch (HttpClientErrorException e) {
            log.error("ID Gen Service failure ", e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("ID Gen Service failure", e);
            throw new CustomException("IDGEN_SERVICE_ERROR", "Failed to generate ID, unknown error occurred");
        }
    }


}
