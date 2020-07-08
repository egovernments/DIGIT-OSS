package org.egov.bpa.workflow;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.bpa.util.BPAConstants;
import org.egov.bpa.web.model.BPA;
import org.egov.bpa.web.model.BPARequest;
import org.egov.bpa.web.model.workflow.Action;
import org.egov.bpa.web.model.workflow.BusinessService;
import org.egov.bpa.web.model.workflow.State;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;


@Component
public class ActionValidator {


	private WorkflowService workflowService;

	@Autowired
	public ActionValidator(WorkflowService workflowService) {
		this.workflowService = workflowService;
	}

	/**
	 * Validates create request
	 * 
	 * @param request
	 *            The BPA Create request
	 */
	public void validateCreateRequest(BPARequest request) {
		Map<String, String> errorMap = new HashMap<>();

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	/**
	 * Validates the update request
	 * 
	 * @param request
	 *            The BPA update request
	 */
	public void validateUpdateRequest(BPARequest request, BusinessService businessService) {
		validateRoleAction(request,businessService);
//		validateAction(request);
		validateIds(request, businessService);
	}

	/**
	 * Validates if the role of the logged in user can perform the given action
	 * 
	 * @param request
	 *            The bpa create or update request
	 */
	private void validateRoleAction(BPARequest request, BusinessService businessService) {
		BPA bpa = request.getBPA();
		Map<String, String> errorMap = new HashMap<>();
		RequestInfo requestInfo = request.getRequestInfo();
//		}
		State state = workflowService.getCurrentStateObj(bpa.getStatus(), businessService);
		if(state != null ) {
			List<Action> actions = state.getActions();
			List<Role> roles = requestInfo.getUserInfo().getRoles();
			List<String> validActions = new LinkedList<>();
			
			roles.forEach(role -> {
				actions.forEach(action -> {
					if (action.getRoles().contains(role.getCode())) {
						validActions.add(action.getAction());
					}
				});
			});

			if (!validActions.contains(bpa.getWorkflow().getAction())) {
				errorMap.put("UNAUTHORIZED UPDATE", "The action cannot be performed by this user");
			}
		}else {
			errorMap.put("UNAUTHORIZED UPDATE", "No workflow state configured for the current status of the application");
		}
		
		if (!errorMap.isEmpty()) {
			throw new CustomException(errorMap);
		}
			
	}

	/**
	 * Validates if the any new object is added in the request
	 * 
	 * @param request
	 *            The bpa update request
	 */
	private void validateIds(BPARequest request, BusinessService businessService) {
		Map<String, String> errorMap = new HashMap<>();
		BPA bpa = request.getBPA();
		
		if( !workflowService.isStateUpdatable(bpa.getStatus(), businessService)) {
			if(bpa.getId() == null) {
				errorMap.put(BPAConstants.INVALID_UPDATE, "Id of Application cannot be null");
			}
			
			 if(!CollectionUtils.isEmpty(bpa.getDocuments())){
				 bpa.getDocuments().forEach(document -> {
                     if(document.getId()==null)
                         errorMap.put(BPAConstants.INVALID_UPDATE, "Id of applicationDocument cannot be null");
                 });
             }
			
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}


}
