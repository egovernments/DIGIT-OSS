package org.egov.vehicle.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.vehicle.util.VehicleUtil;
import org.egov.vehicle.web.model.AuditDetails;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.egov.vehicle.web.model.user.User;
import org.egov.vehicle.web.model.user.UserDetailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EnrichmentService {

	@Autowired
	VehicleUtil util;
	
	@Autowired
	UserService userService;
	
    public void enrichVehicleCreateRequest(VehicleRequest vehicleRequest) {
        RequestInfo requestInfo = vehicleRequest.getRequestInfo();
        
        AuditDetails auditDetails = util.getAuditDetails(requestInfo.getUserInfo().getUuid(), true,null);
		vehicleRequest.getVehicle().setAuditDetails(auditDetails);
		vehicleRequest.getVehicle().setStatus(Vehicle.StatusEnum.ACTIVE);
		
        vehicleRequest.getVehicle().setId(UUID.randomUUID().toString());
        if( vehicleRequest.getVehicle().getOwner().getId() == null) {
        		vehicleRequest.getVehicle().getOwner().setId(Long.parseLong(UUID.randomUUID().toString()));
        }
        
    }
    
    public void enrichVehicleUpdateRequest(VehicleRequest vehicleRequest) {
        RequestInfo requestInfo = vehicleRequest.getRequestInfo();
        
		AuditDetails auditDetails = util.getAuditDetails(requestInfo.getUserInfo().getUuid(), false,
				vehicleRequest.getVehicle().getAuditDetails());
		vehicleRequest.getVehicle().setAuditDetails(auditDetails);
		if( vehicleRequest.getVehicle().getOwner().getId() == null) {
        		vehicleRequest.getVehicle().getOwner().setId(Long.parseLong(UUID.randomUUID().toString()));
        }
        
    }
    
	public void enrichSearchData(List<Vehicle> vehicleList,RequestInfo requestInfo) {
		
		List<String> accountIds = vehicleList.stream().map(Vehicle::getOwnerId).collect(Collectors.toList());
		VehicleSearchCriteria searchcriteria = VehicleSearchCriteria.builder().ownerId(accountIds).build();
		UserDetailResponse userDetailResponse = userService.getOwner(searchcriteria, requestInfo);
		encrichOwner(userDetailResponse,vehicleList);
	}


	/**
	 * enrich the applicant information in FSM
	 * @param userDetailResponse
	 * @param fsms
	 */
	private void encrichOwner(UserDetailResponse userDetailResponse, List<Vehicle> vehicles) {

		List<User> users = userDetailResponse.getUser();
		Map<String, User> userIdToApplicantMap = new HashMap<>();
		users.forEach(user -> userIdToApplicantMap.put(user.getUuid(), user));
		vehicles.forEach(vehicle -> {
			 vehicle.setOwner( userIdToApplicantMap.get(vehicle.getOwnerId()));
		});
	}

}
