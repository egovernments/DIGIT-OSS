package org.egov.swservice.service;

import java.util.HashMap;
import java.util.Map;

import org.egov.swservice.web.models.RoadCuttingInfo;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.ValidatorResult;
import org.egov.swservice.util.SWConstants;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class SewerageFieldValidator implements SewerageActionValidator {

	@Override
	public ValidatorResult validate(SewerageConnectionRequest sewerageConnectionRequest, int reqType) {
		Map<String, String> errorMap = new HashMap<>();
		switch (reqType){
			case SWConstants.UPDATE_APPLICATION:
				validateUpdateRequest(sewerageConnectionRequest, errorMap);
			    break;
			case SWConstants.MODIFY_CONNECTION:
				validateModifyRequest(sewerageConnectionRequest, errorMap);
				break;
			case SWConstants.DISCONNECT_CONNECTION:
				validateDisconnectionRequest(sewerageConnectionRequest, errorMap);
				break;
			default:
				break;
		}
		if (!errorMap.isEmpty())
			return new ValidatorResult(false, errorMap);
		return new ValidatorResult(true, errorMap);
	}

	public void validateDisconnectionRequest(SewerageConnectionRequest sewerageConnectionRequest, Map<String, String> errorMap) {
		if (SWConstants.EXECUTE_DISCONNECTION.equalsIgnoreCase(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
			if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionType())) {
				errorMap.put("INVALID_SEWERAGE_CONNECTION_TYPE", "Connection type should not be empty");
			}
			if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionExecutionDate()) ||
					sewerageConnectionRequest.getSewerageConnection().getConnectionExecutionDate().equals(SWConstants.INVALID_CONEECTION_EXECUTION_DATE)) {
				errorMap.put("INVALID_CONNECTION_EXECUTION_DATE", "Connection execution date should not be empty");
			}
		}
	}
	public void validateUpdateRequest(SewerageConnectionRequest sewerageConnectionRequest, Map<String, String> errorMap) {
		if (SWConstants.ACTIVATE_CONNECTION_CONST.equalsIgnoreCase(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
			if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionType())) {
				errorMap.put("INVALID_SEWERAGE_CONNECTION_TYPE", "Connection type should not be empty");
			}
			if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionExecutionDate()) ||
					sewerageConnectionRequest.getSewerageConnection().getConnectionExecutionDate().equals(SWConstants.INVALID_CONEECTION_EXECUTION_DATE)) {
				errorMap.put("INVALID_CONNECTION_EXECUTION_DATE", "Connection execution date should not be empty");
			}
		}
		if (SWConstants.APPROVE_CONNECTION_CONST.equalsIgnoreCase(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
			if(sewerageConnectionRequest.getSewerageConnection().getRoadCuttingInfo() == null){
				errorMap.put("INVALID_ROAD_INFO", "Road Cutting Information should not be empty");
			}

			if(sewerageConnectionRequest.getSewerageConnection().getRoadCuttingInfo() != null){
				for(RoadCuttingInfo roadCuttingInfo : sewerageConnectionRequest.getSewerageConnection().getRoadCuttingInfo()){
					if(StringUtils.isEmpty(roadCuttingInfo.getRoadType())){
						errorMap.put("INVALID_ROAD_TYPE", "Road type should not be empty");
					}
					if(roadCuttingInfo.getRoadCuttingArea() == null){
						errorMap.put("INVALID_ROAD_CUTTING_AREA", "Road cutting area should not be empty");
					}
				}
			}

		}
	}

	public void validateModifyRequest(SewerageConnectionRequest sewerageConnectionRequest, Map<String, String> errorMap) {
		if (SWConstants.APPROVE_CONNECTION.equalsIgnoreCase(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())
				|| SWConstants.ACTION_INITIATE.equalsIgnoreCase(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
			if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionType())) {
				errorMap.put("INVALID_SEWERAGE_CONNECTION_TYPE", "Connection type should not be empty");
			}
			if (StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionExecutionDate()) ||
					sewerageConnectionRequest.getSewerageConnection().getConnectionExecutionDate().equals(SWConstants.INVALID_CONEECTION_EXECUTION_DATE)) {
				errorMap.put("INVALID_CONNECTION_EXECUTION_DATE", "Connection execution date should not be empty");

			}
			if (sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() != null) {
				if (System.currentTimeMillis() > sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom()) {
					errorMap.put("DATE_EFFECTIVE_FROM_IN_PAST", "Date effective from cannot be past");
				}
				if ((sewerageConnectionRequest.getSewerageConnection().getConnectionExecutionDate() != null)
						&& (sewerageConnectionRequest.getSewerageConnection()
						.getConnectionExecutionDate() > sewerageConnectionRequest.getSewerageConnection()
						.getDateEffectiveFrom())) {

					errorMap.put("DATE_EFFECTIVE_FROM_LESS_THAN_EXCECUTION_DATE",
							"Date effective from cannot be before connection execution date");
				}

			}
		}
		if (SWConstants.SUBMIT_APPLICATION_CONST
				.equals(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())
				|| SWConstants.APPROVE_CONNECTION.equalsIgnoreCase(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())
				|| SWConstants.ACTION_INITIATE.equalsIgnoreCase(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
			if (sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() == null
					|| sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() < 0
					|| sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() == 0) {
				errorMap.put("INVALID_DATE_EFFECTIVE_FROM", "Date effective from cannot be null or negative");
			}
		}
	}

}
