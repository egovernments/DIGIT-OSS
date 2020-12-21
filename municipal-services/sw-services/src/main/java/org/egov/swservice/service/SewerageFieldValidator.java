package org.egov.swservice.service;

import java.util.HashMap;
import java.util.Map;

import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.ValidatorResult;
import org.egov.swservice.util.SWConstants;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class SewerageFieldValidator implements SewerageActionValidator {

	@Override
	public ValidatorResult validate(SewerageConnectionRequest sewerageConnectionRequest, boolean isUpdate) {
		Map<String, String> errorMap = new HashMap<>();
		if (isUpdate) {
			if (SWConstants.ACTIVATE_CONNECTION_CONST.equalsIgnoreCase(
					sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
				if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionType())) {
					errorMap.put("INVALID_SEWERAGE_CONNECTION_TYPE", "Connection type should not be empty");
				}
				if (StringUtils
						.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionExecutionDate())) {
					errorMap.put("INVALID_CONNECTION_EXECUTION_DATE", "Connection execution date should not be empty");
				}
			}
			if (SWConstants.APPROVE_CONNECTION_CONST.equalsIgnoreCase(
					sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
				if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getRoadType())) {
					errorMap.put("INVALID_ROAD_TYPE", "Road type should not be empty");
				}
				if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getRoadCuttingArea())) {
					errorMap.put("INVALID_ROAD_CUTTING_AREA", "Road cutting area should not be empty");
				}
			}
		}
		if (!errorMap.isEmpty())
			return new ValidatorResult(false, errorMap);
		return new ValidatorResult(true, errorMap);
	}

}
