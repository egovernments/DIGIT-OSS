package org.egov.fsm.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.billing.models.BillResponse;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BillingService {

	@Value("${egov.billingservice.host}")
	private String billingHost;

	@Value("${egov.bill.gen.endpoint}")
	private String fetchBillEndpoint;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	public BillResponse fetchBill(FSM fsmRequest, RequestInfo requestInfo) {

		StringBuilder uri = new StringBuilder(billingHost);
		uri.append(fetchBillEndpoint);
		uri.append("?").append("tenantId=").append(fsmRequest.getTenantId());
		uri.append("&businessService=").append(FSMConstants.FSM_PAY_BUSINESS_SERVICE);
		uri.append("&consumerCode=").append(fsmRequest.getApplicationNo());

		try {
			
			Optional<Object> response = serviceRequestRepository.fetchApiResult(uri,
					RequestInfoWrapper.builder().requestInfo(requestInfo).build());

			if (response.isPresent()) {
				LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) response.get();
				return mapper.convertValue(responseMap, BillResponse.class);
			} else {
				throw new CustomException("IllegalArgumentException",
						"Did not get any response from the billing services");

			}
		}

		catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException",
					"ObjectMapper not able to convert response into bill response");
		}
	}

}
