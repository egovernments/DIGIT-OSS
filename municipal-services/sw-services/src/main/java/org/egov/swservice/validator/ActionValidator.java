package org.egov.swservice.validator;

import java.util.HashMap;
import java.util.Map;

import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.workflow.BusinessService;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
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
	 * @param request - Sewerage Connection Request
	 * @param businessService - BusinessService Object
	 */
	public void validateUpdateRequest(SewerageConnectionRequest request, BusinessService businessService, String applicationStatus) {
		validateDocumentsForUpdate(request);
		validateIds(request, businessService, applicationStatus);
	}

	/**
	 * Validate documents for water connection
	 * 
	 * @param request
	 *            Sewerage Connection Request
	 */
	private void validateDocumentsForUpdate(SewerageConnectionRequest request) {
		if (SWConstants.ACTION_INITIATE.equalsIgnoreCase(request.getSewerageConnection().getProcessInstance().getAction())
				&& request.getSewerageConnection().getDocuments() != null) {
			throw new CustomException("INVALID_STATUS",
					"Status cannot be INITIATE when application document are provided");
		}
	}

	/**
	 * Validate Id's if update is not in updatable state
	 * 
	 * @param request Sewerage Connection Request
	 * @param businessService BusinessService Object
	 */
	private void validateIds(SewerageConnectionRequest request, BusinessService businessService, String previousApplicationStatus) {
		Map<String, String> errorMap = new HashMap<>();
		if (!workflowService.isStateUpdatable(previousApplicationStatus, businessService)) {
			if (request.getSewerageConnection().getId() == null)
				errorMap.put("INVALID_UPDATE", "Id of sewerageConnection cannot be null");
			if (!CollectionUtils.isEmpty(request.getSewerageConnection().getDocuments())) {
				request.getSewerageConnection().getDocuments().forEach(document -> {
					if (document.getId() == null)
						errorMap.put("INVALID_UPDATE", "Id of document cannot be null");
				});
			}
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
}
