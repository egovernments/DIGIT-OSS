package org.egov.vehicle.trip.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.trip.repository.VehicleTripRepository;
import org.egov.vehicle.trip.util.VehicleTripConstants;
import org.egov.vehicle.trip.validator.VehicleTripValidator;
import org.egov.vehicle.trip.web.model.VehicleTrip;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.trip.web.model.VehicleTripResponse;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.egov.vehicle.trip.web.model.workflow.BusinessService;
import org.egov.vehicle.trip.workflow.ActionValidator;
import org.egov.vehicle.trip.workflow.WorkflowIntegrator;
import org.egov.vehicle.trip.workflow.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VehicleTripService {
	
	@Autowired
	private VehicleTripRepository vehicleLogRepository;
	
	@Autowired
	private VehicleLogEnrichmentService vehicleLogEnrichmentService;
	
	@Autowired
	private VehicleTripValidator validator;
	
	@Autowired
	private ActionValidator actionValidator;
	

	@Autowired
	private WorkflowIntegrator wfIntegrator;
	
	@Autowired
	private WorkflowService workflowService;
    
    @Autowired
    private VehicleConfiguration config;
	
	public VehicleTrip create(VehicleTripRequest request) {
		if (request.getVehicleTrip() == null) {
			throw new CustomException(VehicleTripConstants.CREATE_VEHICLETRIP_ERROR, "vehicleTrip not found in the Request" + request.getVehicleTrip());
		}
		validator.validateCreateOrUpdateRequest(request);
		vehicleLogEnrichmentService.setInsertData(request);
		wfIntegrator.callWorkFlow(request);
		vehicleLogRepository.save(request);
		return request.getVehicleTrip();
	}
	
	public VehicleTrip update(VehicleTripRequest request) {
		if (request.getVehicleTrip() == null || StringUtils.isEmpty(request.getVehicleTrip().getId())) {
			throw new CustomException(VehicleTripConstants.UPDATE_VEHICLELOG_ERROR, "vehicleLogId not found in the Request" + request.getVehicleTrip());
		}
		
		BusinessService businessService = workflowService.getBusinessService(request.getVehicleTrip(), request.getRequestInfo(),
				VehicleTripConstants.FSM_VEHICLE_TRIP_BusinessService,null);
		
		actionValidator.validateUpdateRequest(request, businessService);
		
		validator.validateCreateOrUpdateRequest(request);
		validator.validateUpdateRecord(request);
		vehicleLogEnrichmentService.setUpdateData(request);
		
		wfIntegrator.callWorkFlow(request);

		vehicleLogEnrichmentService.postStatusEnrichment(request);
		
		vehicleLogRepository.update(request, workflowService.isStateUpdatable(request.getVehicleTrip().getApplicationStatus(), businessService)); 
		
		return request.getVehicleTrip();
	}
	
	public VehicleTripResponse search(VehicleTripSearchCriteria criteria, RequestInfo requestInfo) {
		validator.validateSearch(requestInfo, criteria);
		
		if(criteria.getRefernceNos() != null && !CollectionUtils.isEmpty(criteria.getRefernceNos())) {
			
			List<String> tripIds = vehicleLogRepository.getTripFromRefrences(criteria.getRefernceNos());
			if(CollectionUtils.isEmpty(tripIds)) {
				return VehicleTripResponse.builder().build();
			}else {
				if(CollectionUtils.isEmpty(criteria.getIds())) {
					criteria.setIds(tripIds);
				}else {
					criteria.getIds().addAll(tripIds);
				}					
			}
		}
		
		VehicleTripResponse response = vehicleLogRepository.getVehicleLogData(criteria);
		response.getVehicleTrip().forEach(trip->{
			trip.setTripDetails(vehicleLogRepository.getTrpiDetails(trip.getId()));
		});
		vehicleLogEnrichmentService.enrichSearch(response.getVehicleTrip(), requestInfo);
		return response;
	}

	public List<VehicleTrip> vehicleTripPlainSearch(@Valid VehicleTripSearchCriteria criteria,
			RequestInfo requestInfo) {
		List<VehicleTrip> vehicleLogList = getVehicleTripPlainSearch(criteria, requestInfo);
		return vehicleLogList;
	}

	private List<VehicleTrip> getVehicleTripPlainSearch(@Valid VehicleTripSearchCriteria criteria,
			RequestInfo requestInfo) {
		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
            criteria.setLimit(config.getMaxSearchLimit());

        List<String> ids = null;

        if(criteria.getIds() != null && !criteria.getIds().isEmpty())
            ids = criteria.getIds();
        else
            ids = vehicleLogRepository.fetchVehicleTripIds(criteria);

        if(ids.isEmpty())
            return Collections.emptyList();

        VehicleTripSearchCriteria VehicleTripcriteria = VehicleTripSearchCriteria.builder().tenantId(criteria.getTenantId()).ids(ids).build();;

        List<VehicleTrip> vehicleTripLogs = vehicleLogRepository.getVehicleTripPlainSearch(VehicleTripcriteria);
        vehicleTripLogs.forEach(trip->{
			trip.setTripDetails(vehicleLogRepository.getTrpiDetails(trip.getId()));
		});
        vehicleLogEnrichmentService.enrichSearch(vehicleTripLogs, requestInfo);
        return vehicleTripLogs;
	}
}
