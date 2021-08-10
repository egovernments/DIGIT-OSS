package org.egov.swservice.service;

import java.util.HashMap;
import java.util.Map;

import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.ValidatorResult;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class PropertyValidator implements SewerageActionValidator {

	@Override
	public ValidatorResult validate(SewerageConnectionRequest sewerageConnectionRequest, int reqType) {
		Map<String, String> errorMap = new HashMap<>();
		
		if(StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getPropertyId())) {
			errorMap.put("INVALID_PROPERTY_UNIQUE_ID", "Property Unique Id should not be empty");
		}
		if (!errorMap.isEmpty())
			return new ValidatorResult(false, errorMap);
		return new ValidatorResult(true, errorMap);
	}

}
