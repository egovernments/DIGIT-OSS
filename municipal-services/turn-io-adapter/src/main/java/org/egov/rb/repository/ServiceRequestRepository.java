package org.egov.rb.repository;

import java.util.Arrays;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.rb.config.PropertyConfiguration;
import org.egov.rb.pgr.v2.models.ServiceResponseV2;
import org.egov.rb.pgrmodels.RequestInfo;
import org.egov.rb.pgrmodels.ServiceRequest;
import org.egov.rb.pgrmodels.ServiceResponse;
import org.egov.rb.service.TurnIoService;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.HttpClientErrorException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

@Repository
@Slf4j
public class ServiceRequestRepository {

	

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private PropertyConfiguration propertyConfiguration;

	public Object fetchResult(StringBuilder uri, Object serviceRequest) {
		Object serviceResponse=null;
	  	try {
	  		if(Boolean.valueOf(propertyConfiguration.getPgrv1enabled())) {
		  serviceResponse = restTemplate.postForObject(uri.toString(), serviceRequest, ServiceResponse.class);
	  		}else {
	  			serviceResponse = restTemplate.postForObject(uri.toString(), serviceRequest, ServiceResponseV2.class);
	  		}
	  	}catch(HttpClientErrorException e) {
          log.error("External Service threw an Exception: ",e);
          throw new ServiceCallException(e.getResponseBodyAsString());
      	}catch(Exception e) {
          log.error("Exception while fetching from searcher: ",e);
      	}

      	return serviceResponse;
	}

	public Object getMdmsData(StringBuilder uri, Object request) {
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		Object response = null;
		try {
			response = restTemplate.postForObject(uri.toString(), request, Map.class);
		}catch(HttpClientErrorException e) {
			log.error("External Service threw an Exception: ",e);
			throw new ServiceCallException(e.getResponseBodyAsString());
		}catch(Exception e) {
			log.error("Exception while fetching from searcher: ",e);
		}

		return response;
	}

	
	  
	
}
