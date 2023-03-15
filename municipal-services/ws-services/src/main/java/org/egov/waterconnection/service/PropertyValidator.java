package org.egov.waterconnection.service;

import java.util.HashMap;
import java.util.Map;

import org.egov.waterconnection.web.models.ValidatorResult;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class PropertyValidator implements WaterActionValidator {

	@Override
	public ValidatorResult validate(WaterConnectionRequest waterConnectionRequest, int reqType) {
		Map<String, String> errorMap = new HashMap<>();
		if(StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getPropertyId())) {
			errorMap.put("INVALID_PROPERTY_UNIQUE_ID", "Property Unique Id should not be empty");
		}
		if (!errorMap.isEmpty())
			return new ValidatorResult(false, errorMap);
		return new ValidatorResult(true, errorMap);
	}

}
