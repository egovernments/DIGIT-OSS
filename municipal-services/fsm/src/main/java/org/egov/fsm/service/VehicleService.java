package org.egov.fsm.service;

import java.util.LinkedHashMap;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.fsm.web.model.vehicle.Vehicle;
import org.egov.fsm.web.model.vehicle.VehicleResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VehicleService {

	
	@Autowired
	private FSMConfiguration config;
	
	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	public Vehicle getVehicle(String vehicleId, String tenantId, RequestInfo requestInfo) {
		
		StringBuilder uri  = new StringBuilder(config.getVehicleHost()).append(config.getVehicleContextPath())
				.append(config.getVehicleSearchEndpoint()).append("?tenantId=").append(tenantId).append("&ids=").append(vehicleId);
		
		RequestInfoWrapper requestInfoWrpr = new RequestInfoWrapper();
		requestInfoWrpr.setRequestInfo(requestInfo);
		try {
			
			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, requestInfoWrpr);
			VehicleResponse vehicleResponse = mapper.convertValue(responseMap, VehicleResponse.class);
			if(!CollectionUtils.isEmpty(vehicleResponse.getVehicle())) {
				return vehicleResponse.getVehicle().get(0);
			}else {
				return null;
			}
			
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in validateDSO");
		}
	}
	
	public Vehicle validateVehicle(FSMRequest fsmRequest) {
		FSM fsm = fsmRequest.getFsm();
		Vehicle vehicle = null;
		if(!StringUtils.isEmpty(fsm.getVehicleId())) {
			 vehicle = getVehicle(fsm.getVehicleId(), fsm.getTenantId(), fsmRequest.getRequestInfo());
			if(vehicle == null) {
				throw new CustomException(FSMErrorConstants.VEHICLE_NOT_FOUND," Vehicle Does not exists !");
			}
		}
		return vehicle;
		
	}
}
