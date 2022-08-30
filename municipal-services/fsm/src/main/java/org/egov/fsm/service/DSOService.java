package org.egov.fsm.service;

import java.util.ArrayList;
import java.util.Arrays;
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
import org.egov.fsm.web.model.dso.VendorSearchCriteria;
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
	
	public Vendor getVendor(VendorSearchCriteria vendorSearchCriteria,RequestInfo requestInfo) {
		
		StringBuilder uri = new StringBuilder(config.getVendorHost()).append(config.getVendorContextPath())
				.append(config.getVendorSearchEndpoint()).append("?tenantId=")
				.append(vendorSearchCriteria.getTenantId());

		if(!CollectionUtils.isEmpty(vendorSearchCriteria.getIds())) {
			
			uri.append("&ids="+String.join(",",vendorSearchCriteria.getIds())); 
			
		}
		
		if(!CollectionUtils.isEmpty(vendorSearchCriteria.getOwnerIds())) {
			uri.append("&ownerIds="+String.join(",",vendorSearchCriteria.getOwnerIds()));
			
		}
		
		if(!StringUtils.isEmpty(vendorSearchCriteria.getMobileNumber())) {
			uri.append("&mobileNumber=").append(vendorSearchCriteria.getMobileNumber());
		}
		

		if(!StringUtils.isEmpty(vendorSearchCriteria.getVehicleType())) {
			uri.append("&vehicleType=").append(vendorSearchCriteria.getVehicleType());
		}
		
		if(!StringUtils.isEmpty(vendorSearchCriteria.getVehicleCapacity())) {
			uri.append("&vehicleCapacity=").append(vendorSearchCriteria.getVehicleCapacity());
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
		
		VendorSearchCriteria vendorSearchCriteria=new VendorSearchCriteria();
		vendorSearchCriteria = VendorSearchCriteria.builder().ids(Arrays.asList(fsm.getDsoId()))
				.tenantId(fsm.getTenantId()).build();
				
		Vendor vendor = this.getVendor(vendorSearchCriteria,fsmRequest.getRequestInfo());
		
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
			}
			else {
				Vehicle vehicle = vehilceIdMap.get(fsm.getVehicleId());
				if (vehicle.getTankCapacity()!=null &&
						(vehicle.getTankCapacity() < Double.valueOf(fsm.getVehicleCapacity()))) {
					throw new CustomException(FSMErrorConstants.INVALID_DSO_VEHICLE,
							" Vehicle Capacity of the assigned vehicle is less than the tank capacity of FSM application !");
				}
	

			}
		}
		
	}
}
