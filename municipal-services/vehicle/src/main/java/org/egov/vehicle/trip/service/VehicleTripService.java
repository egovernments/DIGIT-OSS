package org.egov.vehicle.trip.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.service.VehicleService;
import org.egov.vehicle.service.notification.NotificationService;
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
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleResponse;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
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

	@Autowired
	private NotificationService notificationService;

	@Autowired
	private VehicleService vehicleService;

	public List<VehicleTrip> create(VehicleTripRequest request) {

		if (CollectionUtils.isEmpty(request.getVehicleTrip())) {
			throw new CustomException(VehicleTripConstants.CREATE_VEHICLETRIP_ERROR,
					"vehicleTrip not found in the Request" + request.getVehicleTrip());
		}
		validator.validateCreateOrUpdateRequest(request);
		vehicleLogEnrichmentService.setInsertData(request);
		wfIntegrator.callWorkFlow(request);
		vehicleLogRepository.save(request);
		return request.getVehicleTrip();
	}

	public List<VehicleTrip> update(VehicleTripRequest request) {

		if (CollectionUtils.isEmpty(request.getVehicleTrip())) {
			throw new CustomException(VehicleTripConstants.UPDATE_VEHICLELOG_ERROR,
					"vehicleLogId not found in the Request" + request.getVehicleTrip());
		}

		BusinessService businessService = workflowService.getBusinessService(
				request.getVehicleTrip().get(0).getTenantId(), request.getRequestInfo(),
				VehicleTripConstants.FSM_VEHICLE_TRIP_BusinessService, null);

		if (!VehicleTripConstants.UPDATE_ONLY_VEHICLE_TRIP_RECORD.equalsIgnoreCase(request.getWorkflow().getAction())) {
			actionValidator.validateUpdateRequest(request, businessService);
		}

		validator.validateCreateOrUpdateRequest(request);
		validator.validateUpdateRecord(request);
		vehicleLogEnrichmentService.setUpdateData(request);

		if (!VehicleTripConstants.UPDATE_ONLY_VEHICLE_TRIP_RECORD.equalsIgnoreCase(request.getWorkflow().getAction())) {
			wfIntegrator.callWorkFlow(request);
		}

		request.getVehicleTrip().forEach(vehicleTrip -> {
			vehicleLogRepository.update(request.getRequestInfo(), vehicleTrip,
					workflowService.isStateUpdatable(vehicleTrip.getApplicationStatus(), businessService));
		});

		// SAN-800: Send SMS notification if the vehicle trip is declined
		if (VehicleTripConstants.DECLINEVEHICLE.equalsIgnoreCase(request.getWorkflow().getAction())) {
			notificationService.process(request);
		}
		return request.getVehicleTrip();
	}

	public VehicleTripResponse search(VehicleTripSearchCriteria criteria, RequestInfo requestInfo) {
		validator.validateSearch(requestInfo, criteria);

		if (criteria.getRefernceNos() != null && !CollectionUtils.isEmpty(criteria.getRefernceNos())) {

			List<String> tripIds = vehicleLogRepository.getTripFromRefrences(criteria.getRefernceNos());
			if (CollectionUtils.isEmpty(tripIds)) {
				return VehicleTripResponse.builder().build();
			} else {
				if (CollectionUtils.isEmpty(criteria.getIds())) {
					criteria.setIds(tripIds);
				} else {
					criteria.getIds().addAll(tripIds);
				}
			}
		}

		if (criteria.getRegistrationNumber() != null && !CollectionUtils.isEmpty(criteria.getRegistrationNumber())) {

			List<String> regNo = criteria.getRegistrationNumber();
			VehicleSearchCriteria vehicleSearchCriteria = new VehicleSearchCriteria();
			vehicleSearchCriteria.setTenantId(criteria.getTenantId());
			vehicleSearchCriteria.setRegistrationNumber(regNo);

			VehicleResponse vehicleResponse = vehicleService.search(vehicleSearchCriteria, requestInfo);
			if (vehicleResponse != null && !CollectionUtils.isEmpty(vehicleResponse.getVehicle())) {
				List<String> vehicleIdsList = new ArrayList<String>();
				vehicleResponse.getVehicle().forEach(vehicle -> {
					vehicleIdsList.add(vehicle.getId());
				});

				if (CollectionUtils.isEmpty(criteria.getVehicleIds())) {
					criteria.setVehicleIds(vehicleIdsList);
					;
				} else {
					criteria.getVehicleIds().addAll(vehicleIdsList);
				}

			}

		}

		VehicleTripResponse response = vehicleLogRepository.getVehicleLogData(criteria);
		response.getVehicleTrip().forEach(trip -> {
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

		if (criteria.getIds() != null && !criteria.getIds().isEmpty())
			ids = criteria.getIds();
		else
			ids = vehicleLogRepository.fetchVehicleTripIds(criteria);

		if (ids.isEmpty())
			return Collections.emptyList();

		VehicleTripSearchCriteria VehicleTripcriteria = VehicleTripSearchCriteria.builder()
				.tenantId(criteria.getTenantId()).ids(ids).build();
		;

		List<VehicleTrip> vehicleTripLogs = vehicleLogRepository.getVehicleTripPlainSearch(VehicleTripcriteria);
		vehicleTripLogs.forEach(trip -> {
			trip.setTripDetails(vehicleLogRepository.getTrpiDetails(trip.getId()));
		});
		vehicleLogEnrichmentService.enrichSearch(vehicleTripLogs, requestInfo);
		return vehicleTripLogs;
	}
}
