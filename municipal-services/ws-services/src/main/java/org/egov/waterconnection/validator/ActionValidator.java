package org.egov.waterconnection.validator;


import java.util.HashMap;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.web.models.workflow.BusinessService;
import org.egov.waterconnection.workflow.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class ActionValidator {
	
	@Autowired
	private WorkflowService workflowService;

	/**
	 * Validate update request
	 * 
	 * @param request Water Connection Request
	 * @param businessService BusinessService
	 */
	public void validateUpdateRequest(WaterConnectionRequest request, BusinessService businessService, String applicationStatus) {
		validateDocumentsForUpdate(request);
		validateIds(request, businessService, applicationStatus);
	}

	/**
	 * Validate documents for water connection
	 * 
	 * @param request water connection request
	 */
	private void validateDocumentsForUpdate(WaterConnectionRequest request) {
		if (request.getWaterConnection().getProcessInstance().getAction().equalsIgnoreCase(WCConstants.ACTION_INITIATE)
				&& request.getWaterConnection().getDocuments() != null) {
			throw new CustomException("INVALID_STATUS",
					"Status cannot be INITIATE when application document are provided");
		}
	}
	
	/**
	 * Validate Id's if update is not in update-able state
	 * 
	 * @param request WaterConnectionRequest
	 * @param businessService BusinessService
	 */
	private void validateIds(WaterConnectionRequest request, BusinessService businessService, String applicationStatus) {
		WaterConnection connection = request.getWaterConnection();
		Map<String, String> errorMap = new HashMap<>();
		if (!workflowService.isStateUpdatable(applicationStatus, businessService)) {
			if (connection.getId() == null)
				errorMap.put("INVALID_UPDATE", "Id of waterConnection cannot be null");
			if (!CollectionUtils.isEmpty(connection.getDocuments())) {
				connection.getDocuments().forEach(document -> {
					if (document.getId() == null)
						errorMap.put("INVALID_UPDATE", "Id of document cannot be null");
				});
			}
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
}
