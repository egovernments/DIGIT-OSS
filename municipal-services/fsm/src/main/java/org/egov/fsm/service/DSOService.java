package org.egov.fsm.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.fsm.web.model.dso.Vendor;
import org.egov.fsm.web.model.dso.VendorResponse;
import org.egov.fsm.web.model.vehicle.Vehicle;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DSOService {

	@Autowired
	private FSMConfiguration config;
	
	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	VehicleService vehicleService;
	
	public Vendor getVendor(String dsoId, String tenantId, String ownerId, String mobileNo, RequestInfo requestInfo) {
		
		StringBuilder uri  = new StringBuilder(config.getVendorHost()).append(config.getVendorContextPath())
				.append(config.getVendorSearchEndpoint()).append("?tenantId=").append(tenantId);
		if(!StringUtils.isEmpty(dsoId)) {
			uri.append("&ids=").append(dsoId);
		}
		
		if(!StringUtils.isEmpty(ownerId)) {
			uri.append("&ownerIds=").append(ownerId);
		}
		
		if(!StringUtils.isEmpty(mobileNo)) {
			uri.append("&mobileNumber=").append(mobileNo);
		}
		
		
		RequestInfoWrapper requestInfoWrpr = new RequestInfoWrapper();
		requestInfoWrpr.setRequestInfo(requestInfo);
		try {
			
			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, requestInfoWrpr);
			VendorResponse vendorResponse = mapper.convertValue(responseMap, VendorResponse.class);
			if(!CollectionUtils.isEmpty(vendorResponse.getVendor())) {
				return vendorResponse.getVendor().get(0);
			}else {
				return null;
			}
			
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in validateDSO");
		}
		
	}
	
	public void validateDSO(FSMRequest fsmRequest) {
		FSM fsm = fsmRequest.getFsm();
		Vendor vendor = this.getVendor(fsm.getDsoId(), fsm.getTenantId(), null, null, fsmRequest.getRequestInfo());
		if(vendor == null) {
			throw new CustomException(FSMErrorConstants.INVALID_DSO," DSO Does not belong to DSO!");
		}else {
			if( CollectionUtils.isEmpty(fsmRequest.getWorkflow().getAssignes())) {
				List<String> assignes = new ArrayList<String>();
				assignes.add(vendor.getOwner().getUuid());
				fsmRequest.getWorkflow().setAssignes(assignes);
			}else {
				if(fsmRequest.getWorkflow().getAssignes().size() >1) {
					throw new CustomException(FSMErrorConstants.INVALID_DSO," Cannot assign to multiple DSO's !");
				}else {
					if(!fsmRequest.getWorkflow().getAssignes().get(0).equalsIgnoreCase(vendor.getOwner().getUuid())) {
						throw new CustomException(FSMErrorConstants.INVALID_DSO," Assignee Does not belong to DSO!");
					}
				}
			}
			
		}
		
		if(!StringUtils.isEmpty(fsm.getVehicleId())) {
			vehicleService.validateVehicle(fsmRequest);
			Map<String, Vehicle> vehilceIdMap = vendor.getVehicles().stream().collect(Collectors.toMap(Vehicle::getId,Function.identity()));
			if(!CollectionUtils.isEmpty(vehilceIdMap) && vehilceIdMap.get(fsm.getVehicleId()) == null ) {
				throw new CustomException(FSMErrorConstants.INVALID_DSO_VEHICLE," Vehicle Does not belong to DSO!");
			}else {
				Vehicle vehicle = vehilceIdMap.get(fsm.getVehicleId());
				if(!vehicle.getType().equalsIgnoreCase(fsm.getVehicleType())) {
					throw new CustomException(FSMErrorConstants.INVALID_DSO_VEHICLE," Vehilce Type of FSM and vehilceType of the assigned vehicle does not match !");
				}
			}
		}
		
	}
}
