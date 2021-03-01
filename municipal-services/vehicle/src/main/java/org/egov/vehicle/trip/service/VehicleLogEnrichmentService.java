package org.egov.vehicle.trip.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.repository.VehicleRepository;
import org.egov.vehicle.service.UserService;
import org.egov.vehicle.trip.repository.IdGenRepository;
import org.egov.vehicle.trip.util.VehicleTripConstants;
import org.egov.vehicle.trip.web.model.VehicleTrip;
import org.egov.vehicle.trip.web.model.VehicleTripDetail;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.trip.web.model.Workflow;
import org.egov.vehicle.trip.web.model.idgen.IdResponse;
import org.egov.vehicle.util.VehicleUtil;
import org.egov.vehicle.web.model.AuditDetails;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.egov.vehicle.web.model.user.User;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VehicleLogEnrichmentService {

	@Autowired
	private IdGenRepository idGenRepository;

	@Autowired
	private VehicleUtil vehicleLogUtil;

	@Autowired
	private VehicleConfiguration config;
	@Autowired
	private UserService userService;

	
	@Autowired
	private VehicleRepository vehicleRepository;


	public void setInsertData(VehicleTripRequest request) {
		VehicleTrip vehicleTrip =request.getVehicleTrip();
		vehicleTrip.setId(UUID.randomUUID().toString());
		vehicleTrip.setStatus(VehicleTrip.StatusEnum.ACTIVE);
		setIdgenIds(request);
		vehicleTrip.setStatus(VehicleTrip.StatusEnum.ACTIVE);
		AuditDetails auditDetails = vehicleLogUtil.getAuditDetails(request.getRequestInfo().getUserInfo().getUuid(),
				true,null);
		vehicleTrip.setAuditDetails(auditDetails);
		vehicleTrip.getTripDetails().forEach(tripDetail->{
			tripDetail.setAuditDetails(auditDetails);
			tripDetail.setId(UUID.randomUUID().toString());
			tripDetail.setStatus(VehicleTripDetail.StatusEnum.ACTIVE);
		});
		if(vehicleTrip.getTripOwner() != null) {
			vehicleTrip.setTripOwnerId(vehicleTrip.getTripOwner().getUuid());
		}else {
			addTripOwner(vehicleTrip, request.getRequestInfo());
		}
		if(vehicleTrip.getDriver() != null) {
			vehicleTrip.setDriverId(vehicleTrip.getDriver().getUuid());
		}else {
			addTripDriverr(vehicleTrip,  request.getRequestInfo());
		}
		if(vehicleTrip.getVehicle() != null ) {

			vehicleTrip.setVehicleId(vehicleTrip.getVehicle().getId());
		}else {
			addVehicle(vehicleTrip);
		}
		
		if(request.getWorkflow() == null) {
			request.setWorkflow(Workflow.builder().action(VehicleTripConstants.ACTION_SCHEDULE).build());
		}
	}

	public void setUpdateData(VehicleTripRequest request) {
//		request.getVehicleTrip().setApplicationStatus(VehicleTripConstants.VEHICLE_LOG_APPLICATION_UPDATED_STATUS);
		AuditDetails auditDetails = vehicleLogUtil.getAuditDetails(request.getRequestInfo().getUserInfo().getUuid(),
				false,request.getVehicleTrip().getAuditDetails());
		request.getVehicleTrip().setAuditDetails(auditDetails);
		
		request.getVehicleTrip().getTripDetails().forEach(tripDetail->{
		
			 tripDetail.setAuditDetails(vehicleLogUtil.getAuditDetails(request.getRequestInfo().getUserInfo().getUuid(),
						false,tripDetail.getAuditDetails()));
		});
	}

	public void enrichSearch(List<VehicleTrip> vehicleLogList, RequestInfo requestInfo) {
		vehicleLogList.forEach(trip -> {
			addVehicle(trip);
			addTripOwner(trip,requestInfo);
			addTripDriverr(trip,requestInfo);
		});
	}



	private void addTripOwner(VehicleTrip trip, RequestInfo requestInfo) {
		
		User user = userService.getUser(trip.getTripOwnerId(), trip.getTenantId(), requestInfo);
		if(user != null) {
			org.egov.common.contract.request.User respUser = new org.egov.common.contract.request.User();
			BeanUtils.copyProperties(user, respUser);
			trip.setTripOwner(respUser);
		}
		
		
	}
	
	private void addTripDriverr(VehicleTrip trip, RequestInfo requestInfo) {
		
		User user = userService.getUser(trip.getDriverId(), trip.getTenantId(), requestInfo);
		if(user != null ) {
			org.egov.common.contract.request.User respUser = new org.egov.common.contract.request.User();
			BeanUtils.copyProperties(user, respUser);
			trip.setDriver(respUser);
		}
		
		
	}

	/**
	 * generate the applicationNo using the idGen serivce and populate
	 * 
	 * @param request
	 */
	private void setIdgenIds(VehicleTripRequest request) {
		RequestInfo requestInfo = request.getRequestInfo();
		String tenantId = request.getVehicleTrip().getTenantId();
		VehicleTrip vehicleLog = request.getVehicleTrip();

		List<String> applicationNumbers = getIdList(requestInfo, tenantId, config.getApplicationNoIdgenName(),
				config.getApplicationNoIdgenFormat(), 1);
		ListIterator<String> itr = applicationNumbers.listIterator();

		Map<String, String> errorMap = new HashMap<>();

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);

		vehicleLog.setApplicationNo(itr.next());
	}

	/**
	 * Generate the id
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @param idKey
	 * @param idformat
	 * @param count
	 * @return
	 */
	private List<String> getIdList(RequestInfo requestInfo, String tenantId, String idKey, String idformat, int count) {
		List<IdResponse> idResponses = idGenRepository.getId(requestInfo, tenantId, idKey, idformat, count)
				.getIdResponses();

		if (CollectionUtils.isEmpty(idResponses))
			throw new CustomException(VehicleTripConstants.IDGEN_ERROR, "No ids returned from idgen Service");

		return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
	}

	public void postStatusEnrichment(VehicleTripRequest request) {
		// TODO Auto-generated method stub
		
	}
	
	private void addVehicle(VehicleTrip trip) {
		VehicleSearchCriteria vsc = new VehicleSearchCriteria();
		List ids = new ArrayList<String>();
		ids.add(trip.getVehicleId());
		vsc.setIds(ids);
		List<Vehicle> vehicles = vehicleRepository.getVehicleData(vsc);
		if(!CollectionUtils.isEmpty(vehicles)) {
			trip.setVehicle(vehicles.get(0));
		}

	}

}
