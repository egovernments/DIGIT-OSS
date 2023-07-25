package org.egov.vehicle.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.vehicle.repository.VehicleRepository;
import org.egov.vehicle.trip.web.model.VehicleTripDetail;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.egov.vehicle.util.VehicleErrorConstants;
import org.egov.vehicle.util.VehicleUtil;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class VehicleInboxService {

	@Autowired
    private VehicleUtil util;
	
	@Autowired
	private VehicleRepository vehicleRepository;
	
	public List<Map<String, Object>> fetchStatusCount(VehicleSearchCriteria vehicleSearchCriteria) {
		
		List<Map<String, Object>> fsmApplicationList = new ArrayList<Map<String,Object>>();
		
		if (vehicleSearchCriteria.getTenantId().split("\\.").length == 1) {
			throw new CustomException(VehicleErrorConstants.INVALID_TENANT, " Tenant is not available");
		}
		
		fsmApplicationList = vehicleRepository.fetchStatusCount(vehicleSearchCriteria);
		return fsmApplicationList;
    } 
	
	public List<VehicleTripDetail> fetchTripDetails(VehicleTripSearchCriteria vehicleTripSearchCriteria) {
		
		if (vehicleTripSearchCriteria.getTenantId().split("\\.").length == 1) {
			throw new CustomException(VehicleErrorConstants.INVALID_TENANT, " Tenant is not available");
		}
		
		List<VehicleTripDetail> vehicleTripDetailList = vehicleRepository.fetchVehicleTripDetailsByReferenceNo(vehicleTripSearchCriteria);
		if(null == vehicleTripDetailList)
			return new ArrayList<>();
		
		return vehicleTripDetailList;
		
    }
	
}
