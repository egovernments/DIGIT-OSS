package org.egov.vendor.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.repository.ServiceRequestRepository;
import org.egov.vendor.util.VendorConstants;
import org.egov.vendor.web.model.RequestInfoWrapper;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.vehicle.Vehicle;
import org.egov.vendor.web.model.vehicle.VehicleRequest;
import org.egov.vendor.web.model.vehicle.VehicleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VehicleService {

	@Autowired
	VendorConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;
	
	@SuppressWarnings("deprecation")
	public void manageVehicle(VendorRequest vendorRequest) {
		
		Vendor vendor = vendorRequest.getVendor();
		RequestInfo requestInfo = vendorRequest.getRequestInfo();
		List<Vehicle> reqVehicles= vendor.getVehicles();
		List<Vehicle> newVehicles = new ArrayList<Vehicle>();
		reqVehicles.forEach(reqVehicle->{
			
			if(!StringUtils.hasLength(reqVehicle.getId()) && StringUtils.hasLength(reqVehicle.getRegistrationNumber())) {
				
				List<Vehicle> vehicles = getVehicles(null,Arrays.asList(reqVehicle.getRegistrationNumber()) ,null,requestInfo, vendor.getTenantId());
				if( vehicles.size() >0 ) {
					newVehicles.add(vehicles.get(0));
					//TODO comparing search result and request vehicle and callig update is peding
				}else {
					newVehicles.add(createVehicle(reqVehicle, requestInfo));
				}
			}else {
				List<Vehicle> vehicles = getVehicles(Arrays.asList(reqVehicle.getId()),Arrays.asList(reqVehicle.getRegistrationNumber()) ,null,requestInfo, vendor.getTenantId());
				if( vehicles.size() >0 ) {
					newVehicles.add(vehicles.get(0));
					//TODO comparing search result and request vehicle and callig update is peding
				}else {
					newVehicles.add(createVehicle(reqVehicle, requestInfo));
				}
			}
		});
		
		vendorRequest.getVendor().getVehicles().clear();
		vendorRequest.getVendor().getVehicles().addAll(newVehicles);
		
	}
	
	
	/**
	 * 
	 * @param vehicleIds
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public List<Vehicle> getVehicles(List<String> vehicleIds,List<String> registrationNumbers,String vehicleType, RequestInfo requestInfo,String tenantId){
		List<Vehicle> vehicles = null;
		StringBuilder uri = new StringBuilder();
		uri.append(config.getVehicleHost()).append(config.getVehicleContextPath()).append(config.getVehicleSearchEndpoint()).append("?tenantId="+tenantId);
		if( !CollectionUtils.isEmpty(vehicleIds)) {
			uri.append("&ids="+String.join(",",vehicleIds)); 
		}
		if( !CollectionUtils.isEmpty(registrationNumbers)) {
			uri.append("&registrationNumber="+String.join(",", registrationNumbers));
		}
		
		if(StringUtils.hasLength(vehicleType)) {
			uri.append("&type="+vehicleType);
		}
		RequestInfoWrapper reqwraper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, reqwraper);
		VehicleResponse vehicleResponse = null;
		try {
			 vehicleResponse = mapper.convertValue(responseMap, VehicleResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in vehicle search response");
		}
		
		return  vehicleResponse.getVehicle();
	}
	
	private Vehicle createVehicle(Vehicle vehicle, RequestInfo requestInfo) {
		Vehicle newVehicle = null;
		StringBuilder uri = new StringBuilder();
		uri.append(config.getVehicleHost()).append(config.getVehicleContextPath()).append(config.getVehicleCreateEndpoint());
		VehicleRequest vehicleRequest = VehicleRequest.builder().RequestInfo(requestInfo).vehicle(vehicle).build();
		try {
			
			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, vehicleRequest);
			VehicleResponse vehicleResponse = mapper.convertValue(responseMap, VehicleResponse.class);
			if(vehicleResponse.getVehicle() != null && vehicleResponse.getVehicle().size() >0) {
				return vehicleResponse.getVehicle().get(0);
			}else {
				throw new CustomException(VendorConstants.COULD_NOT_CREATE_VEHICLE, "Could not create vehicle");
			}
			
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in userCall");
		}
		
		
		
	}

}
