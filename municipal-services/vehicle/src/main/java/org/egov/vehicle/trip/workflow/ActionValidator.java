package org.egov.vehicle.trip.workflow;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.trip.util.VehicleTripConstants;
import org.egov.vehicle.trip.web.model.VehicleTrip;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.trip.web.model.workflow.Action;
import org.egov.vehicle.trip.web.model.workflow.BusinessService;
import org.egov.vehicle.trip.web.model.workflow.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ActionValidator {


	private WorkflowService workflowService;

	@Autowired
	public ActionValidator(WorkflowService workflowService) {
		this.workflowService = workflowService;
	}

	

	/**
	 * Validates the update request
	 * 
	 * @param request
	 *            The FSM update request
	 */
	public void validateUpdateRequest(VehicleTripRequest request, BusinessService businessService) {
		validateRoleAction(request,businessService);
//		validateAction(request);
		validateIds(request, businessService);
	}

	/**
	 * Validates if the role of the logged in user can perform the given action
	 * 
	 * @param request
	 *            The fsm create or update request
	 */
	private void validateRoleAction(VehicleTripRequest request, BusinessService businessService) {
		
		request.getVehicleTrip().forEach(trip->{
						
			Map<String, String> errorMap = new HashMap<>();
			RequestInfo requestInfo = request.getRequestInfo();
			State state = workflowService.getCurrentStateObj(trip.getApplicationStatus(), businessService);
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

				if (!validActions.contains(request.getWorkflow().getAction())) {
					errorMap.put("UNAUTHORIZED UPDATE", "The action cannot be performed by this user");
				}
			}else {
				errorMap.put("UNAUTHORIZED UPDATE", "No workflow state configured for the current status of the application");
			}
			
			if (!errorMap.isEmpty()) {
				throw new CustomException(errorMap);
			}

		});		
	}

	/**
	 * Validates if the any new object is added in the request
	 * 
	 * @param request
	 *            The fsm update request
	 */
	private void validateIds(VehicleTripRequest request, BusinessService businessService) {
			request.getVehicleTrip().forEach(trip->{
				
				Map<String, String> errorMap = new HashMap<>();
				if( !workflowService.isStateUpdatable(trip.getApplicationStatus(), businessService)) {
					if(trip.getId() == null) {
						errorMap.put(VehicleTripConstants.INVALID_UPDATE, "Id of Application cannot be null");
					}
					
				}
				if (!errorMap.isEmpty())
					throw new CustomException(errorMap);
			});
			
	}


}
