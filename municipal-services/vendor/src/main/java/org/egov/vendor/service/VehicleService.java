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
import org.egov.vendor.web.model.vehicle.VehicleSearchCriteria;
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
		
		if(!CollectionUtils.isEmpty(reqVehicles)) {
		
			reqVehicles.forEach(reqVehicle->{
			
			if(!StringUtils.hasLength(reqVehicle.getId()) && 
					StringUtils.hasLength(reqVehicle.getRegistrationNumber())) {
				
				VehicleSearchCriteria vehicleSearchCriteria=new VehicleSearchCriteria();
				vehicleSearchCriteria = VehicleSearchCriteria.builder()
						.registrationNumber(Arrays.asList(reqVehicle.getRegistrationNumber()))
						.tenantId(vendor.getTenantId())
						.status(Arrays.asList("ACTIVE")).build();
				
				List<Vehicle> vehicles = getVehicles(vehicleSearchCriteria,requestInfo);
				
				if( vehicles.size() >0 ) {
					vehicles.get(0).setVendorVehicleStatus(reqVehicle.getVendorVehicleStatus());
					newVehicles.add(vehicles.get(0));
					//TODO comparing search result and request vehicle and callig update is peding
				}else {
					Vehicle newVehicle=createVehicle(reqVehicle, requestInfo);
					newVehicle.setVendorVehicleStatus(reqVehicle.getVendorVehicleStatus());
					newVehicles.add(newVehicle);
				}
			}else {
				
				VehicleSearchCriteria vehicleSearchCriteria=new VehicleSearchCriteria();
				vehicleSearchCriteria = VehicleSearchCriteria.builder()
						.ids(Arrays.asList(reqVehicle.getId()))
						.registrationNumber(Arrays.asList(reqVehicle.getRegistrationNumber()))
						.tenantId(vendor.getTenantId()).build();
				
				List<Vehicle> vehicles = getVehicles(vehicleSearchCriteria,requestInfo);
				
				if( vehicles.size() >0 ) {
					Vehicle newVehicle=updateVehicle(reqVehicle, requestInfo);
					newVehicle.setVendorVehicleStatus(reqVehicle.getVendorVehicleStatus());
					newVehicles.add(newVehicle);
					//newVehicles.add(updateVehicle(reqVehicle, requestInfo));
					
				}else {
					throw new CustomException(VendorConstants.UPDATE_ERROR,
					 "Vendor vehicle details not found in the System" + vendorRequest.getVendor());
				}
			}
		});
		
			vendorRequest.getVendor().getVehicles().clear();
			vendorRequest.getVendor().getVehicles().addAll(newVehicles);
	}
		
		
		
	}
	
	
	/**
	 * @param vehicleIds
	 * @param registrationNumbers
	 * @param vehicleType
	 * @param vehicleCapacity
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public List<Vehicle> getVehicles(VehicleSearchCriteria vehicleSearchCriteria, RequestInfo requestInfo){
		
		StringBuilder uri = new StringBuilder();
		uri.append(config.getVehicleHost()).append(config.getVehicleContextPath())
				.append(config.getVehicleSearchEndpoint()).append("?tenantId=" + vehicleSearchCriteria.getTenantId());
		
		if( !CollectionUtils.isEmpty(vehicleSearchCriteria.getIds())) {
			uri.append("&ids="+String.join(",",vehicleSearchCriteria.getIds())); 
		}
		if( !CollectionUtils.isEmpty(vehicleSearchCriteria.getRegistrationNumber())) {
			uri.append("&registrationNumber="+String.join(",", vehicleSearchCriteria.getRegistrationNumber()));
		}
		
		if(StringUtils.hasLength(vehicleSearchCriteria.getVehicleType())) {
			uri.append("&type="+vehicleSearchCriteria.getVehicleType());
		}
		
		if(StringUtils.hasLength(vehicleSearchCriteria.getVehicleCapacity())) {
			uri.append("&tankCapacity="+vehicleSearchCriteria.getVehicleCapacity());
		}
		
		if( !CollectionUtils.isEmpty(vehicleSearchCriteria.getStatus())) {
			uri.append("&status="+String.join(",",vehicleSearchCriteria.getStatus())); 
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
	
	private Vehicle updateVehicle(Vehicle vehicle, RequestInfo requestInfo) {
		StringBuilder uri = new StringBuilder();
		uri.append(config.getVehicleHost()).append(config.getVehicleContextPath()).append(config.getVehicleUpdateEndpoint());
		VehicleRequest vehicleRequest = VehicleRequest.builder().RequestInfo(requestInfo).vehicle(vehicle).build();
		try {
			
			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, vehicleRequest);
			VehicleResponse vehicleResponse = mapper.convertValue(responseMap, VehicleResponse.class);
			if(vehicleResponse.getVehicle() != null && vehicleResponse.getVehicle().size() >0) {
				return vehicleResponse.getVehicle().get(0);
			}else {
				throw new CustomException(VendorConstants.UPDATE_VEHICLE_ERROR, "Could not Update vehicle");
			}
			
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in userCall");
		}
		
		
		
	}

}