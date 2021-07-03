package org.egov.echallan.repository;


import org.egov.common.contract.request.RequestInfo;
import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.web.models.Idgen.IdGenerationRequest;
import org.egov.echallan.web.models.Idgen.IdGenerationResponse;
import org.egov.echallan.web.models.Idgen.IdRequest;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class IdGenRepository {



    private RestTemplate restTemplate;

    private ChallanConfiguration config;

    @Autowired
    public IdGenRepository(RestTemplate restTemplate, ChallanConfiguration config) {
        this.restTemplate = restTemplate;
        this.config = config;
    }
    public IdGenerationResponse getId(RequestInfo requestInfo, String tenantId, String name, String format, int count) {

        List<IdRequest> reqList = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            reqList.add(IdRequest.builder().idName(name).format(format).tenantId(tenantId).build());
        }
        IdGenerationRequest req = IdGenerationRequest.builder().idRequests(reqList).requestInfo(requestInfo).build();
        IdGenerationResponse response = null;
        try {
            response = restTemplate.postForObject( config.getIdGenHost()+ config.getIdGenPath(), req, IdGenerationResponse.class);
        } catch (HttpClientErrorException e) {
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new CustomException(e.getCause().getClass().getName(),e.getMessage());
        }
        return response;
    }



}
