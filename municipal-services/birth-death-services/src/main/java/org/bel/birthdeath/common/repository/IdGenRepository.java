package org.bel.birthdeath.common.repository;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.bel.birthdeath.common.Idgen.IdGenerationRequest;
import org.bel.birthdeath.common.Idgen.IdGenerationResponse;
import org.bel.birthdeath.common.Idgen.IdRequest;
import org.bel.birthdeath.config.BirthDeathConfiguration;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Repository
public class IdGenRepository {

	@Autowired
    private RestTemplate restTemplate;

	@Autowired
    private BirthDeathConfiguration config;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    @Qualifier("objectMapperBnd")
    private ObjectMapper mapper;

    public IdGenerationResponse getId(RequestInfo requestInfo, String tenantId, String name, String format, int count) {

        List<IdRequest> reqList = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            reqList.add(IdRequest.builder().idName(name).format(format).tenantId(tenantId).build());
        }
        IdGenerationRequest req = IdGenerationRequest.builder().idRequests(reqList).requestInfo(requestInfo).build();
        Object result =  serviceRequestRepository.fetchResult(new StringBuilder(config.getIdGenHost() + config.getIdGenPath()), req);
        IdGenerationResponse response = null;
        try {
          response =   mapper.convertValue(result, IdGenerationResponse.class);
        } catch (IllegalArgumentException e) {
            throw new CustomException("PARSING ERROR","Failed to parse response of ID Generation");
        } catch (Exception e) {
            Map<String, String> map = new HashMap<>();
            map.put(e.getCause().getClass().getName(),e.getMessage());
            throw new CustomException(map);
        }
        return response;
    }



}
