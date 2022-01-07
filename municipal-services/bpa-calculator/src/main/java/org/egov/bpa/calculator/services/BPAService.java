package org.egov.bpa.calculator.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;

import org.egov.bpa.calculator.config.BPACalculatorConfig;
import org.egov.bpa.calculator.repository.ServiceRequestRepository;
import org.egov.bpa.calculator.utils.BPACalculatorConstants;
import org.egov.bpa.calculator.web.models.RequestInfoWrapper;
import org.egov.bpa.calculator.web.models.bpa.BPA;
import org.egov.bpa.calculator.web.models.bpa.BPAResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

@Service
public class BPAService {

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private BPACalculatorConfig config;

	public BPA getBuildingPlan(RequestInfo requestInfo, String tenantId, String applicationNo, String approvalNo) {
		StringBuilder url = getBPASearchURL();
		url.append("tenantId=");
		url.append(tenantId);
		if (approvalNo != null) {
			url.append("&");
			url.append("approvalNo=");
		} else {
			url.append("&");
			url.append("applicationNo=");
		}
		url.append(approvalNo);
		LinkedHashMap responseMap = null;
		responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(url, new RequestInfoWrapper(requestInfo));

		BPAResponse bpaResponse = null;

		try {
			bpaResponse = mapper.convertValue(responseMap, BPAResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException(BPACalculatorConstants.PARSING_ERROR, "Error while parsing response of TradeLicense Search");
		}

		return bpaResponse.getBPA().get(0);
	}

	private StringBuilder getBPASearchURL() {
		// TODO Auto-generated method stub
		StringBuilder url = new StringBuilder(config.getBpaHost());
		url.append(config.getBpaContextPath());
		url.append(config.getBpaSearchEndpoint());
		url.append("?");
		return url;
	}
}
