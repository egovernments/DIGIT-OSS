package org.egov.pt.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.collection.BillResponse;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import static org.egov.pt.util.PTConstants.PT_BUSINESSSERVICE;

import java.util.LinkedHashMap;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BillingService {
	
	@Value("${egbs.host}")
	private String billingHost;
	
	@Value("${egbs.fetchbill.endpoint}")
	private String fetchBillEndpoint;
	
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;
	
	public BillResponse fetchBill(Property property, RequestInfo requestInfo) {
		
		StringBuilder uri = new StringBuilder(billingHost);
		uri.append(fetchBillEndpoint);
		uri.append("?").append("tenantId=").append(property.getTenantId());
		uri.append("&businessService=").append(PT_BUSINESSSERVICE);
		uri.append("&consumerCode=").append(property.getPropertyId());
		
		try {
        	Optional<Object> response = serviceRequestRepository.fetchResult(uri, RequestInfoWrapper.builder().requestInfo(requestInfo).build());
        	
        	if(response.isPresent()) {
        		LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>)response.get();
                BillResponse billResponse = mapper.convertValue(responseMap,BillResponse.class);
                return billResponse;
        	}else {
        		throw new CustomException("IllegalArgumentException","Did not get any response from the billing services");
        		
        	}
        }

        catch(IllegalArgumentException  e)
        {
            throw new CustomException("IllegalArgumentException","ObjectMapper not able to convert response into bill response");
        }
	}

}
