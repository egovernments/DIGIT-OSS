package org.egov.demand.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.IdGenerationRequest;
import org.egov.demand.model.IdGenerationResponse;
import org.egov.demand.model.IdRequest;
import org.egov.demand.model.IdResponse;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class IdGenRepo {
	
	@Autowired
	private ApplicationProperties appProps;
	
	@Autowired
	private RestTemplate rest;

	public List<String> getId(RequestInfo requestInfo, String tenantId, String name, String format, int count) {

		List<IdRequest> reqList = new ArrayList<>();
		for (int i = 0; i < count; i++) {
			reqList.add(IdRequest.builder().idName(name).format(format).tenantId(tenantId).build());
		}

		IdGenerationRequest req = IdGenerationRequest.builder().requestInfo(requestInfo).idRequests(reqList).build();

		String uri = UriComponentsBuilder.fromHttpUrl(appProps.getIdGenHost()).path(appProps.getIdGenUrl()).build()
				.toUriString();
		try {
			IdGenerationResponse idGenerationResponse = rest.postForObject(uri, req, IdGenerationResponse.class);
			return idGenerationResponse.getIdResponses().stream().map(IdResponse::getId).collect(Collectors.toList());
		} catch (HttpClientErrorException e) {
			log.error("ID Gen Service failure ", e);
			throw new ServiceCallException(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error("ID Gen Service failure", e);
			throw new org.egov.tracer.model.CustomException("IDGEN_SERVICE_ERROR",
					"Failed to generate ID, unknown error occurred");
		}
	}
}
