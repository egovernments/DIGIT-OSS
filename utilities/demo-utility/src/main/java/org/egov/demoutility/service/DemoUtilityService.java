package org.egov.demoutility.service;

import org.egov.demoutility.DemoUtility;
import org.egov.demoutility.config.PropertyManager;
import org.egov.demoutility.model.DemoUtilityRequest;
import org.egov.demoutility.producer.Producer;
import org.egov.demoutility.utils.UtilityConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DemoUtilityService {
	
	
	@Autowired
	Producer producer;
	
	@Autowired
	PropertyManager propertyManager;

	public String createdemousers(DemoUtilityRequest demoUtilityRequest) {
		
		producer.push(propertyManager.getDemotopic(), demoUtilityRequest);
		
		return UtilityConstants.MESSAGE;	
	}
	
	
	
	

}
