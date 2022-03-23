package org.egov.service;

import java.util.LinkedHashMap;

import org.egov.models.RequestInfo;
import org.egov.models.RequestInfoWrapper;
import org.egov.utils.JsonPathConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.jayway.jsonpath.DocumentContext;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SignOutService {

	@Autowired
	private RestTemplate restTemplate;

	@Value("${egov.coexistence.hostname}")
	private String coexistencehost;

	@Value("${egov.coexistence.singout.uri}")
	private String coexistencelogoutUri;

	public void callFinanceForSignOut(DocumentContext documentContext) {
		ResponseEntity<?> response = null;
		String accessToken = documentContext.read(JsonPathConstant.signOutAccessToken);
		documentContext = documentContext.delete(JsonPathConstant.userInfo);
		documentContext = documentContext.put(JsonPathConstant.requestInfo, "authToken", accessToken);
		String correlationId = documentContext.read(JsonPathConstant.correlationId);
		LinkedHashMap<String, Object> jsonRequest = documentContext.read(JsonPathConstant.request);
		log.info(coexistencehost + coexistencelogoutUri + accessToken);
		RequestInfoWrapper reqInfoWrapper = new RequestInfoWrapper();
		RequestInfo requestInfo = new RequestInfo();
		requestInfo.setAuthToken(accessToken);
		requestInfo.setCorrelationId(correlationId);
		reqInfoWrapper.setRequestInfo(requestInfo);
		log.info("Call signout API");
		log.info(reqInfoWrapper.toString());
		response = restTemplate.postForEntity(coexistencehost + coexistencelogoutUri, reqInfoWrapper, ResponseEntity.class);
		log.info("SignOutService response :" + response.getStatusCode());
	}

}
