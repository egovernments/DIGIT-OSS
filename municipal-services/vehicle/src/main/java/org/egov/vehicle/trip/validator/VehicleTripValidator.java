package org.egov.vehicle.trip.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.repository.VehicleRepository;
import org.egov.vehicle.service.UserService;
import org.egov.vehicle.service.VehicleService;
import org.egov.vehicle.trip.querybuilder.VehicleTripQueryBuilder;
import org.egov.vehicle.trip.repository.VehicleTripRepository;
import org.egov.vehicle.trip.util.VehicleTripConstants;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.egov.vehicle.web.model.user.UserDetailResponse;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class VehicleTripValidator {

//	@Autowired
//	private DSOService dsoService;

	@Autowired
	private VehicleService vehicleService;

	@Autowired
	private VehicleTripRepository vehicleTripRepository;

	@Autowired
	private VehicleTripQueryBuilder queryBuilder;
	
    @Autowired
    private VehicleRepository repository;

	@Autowired
	private UserService userService;
	
	@Autowired
	private VehicleConfiguration config;

	public void validateCreateOrUpdateRequest(VehicleTripRequest request) {
		if (StringUtils.isEmpty(request.getVehicleTrip().getTenantId())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "TenantId is mandatory");
		}
		if (request.getVehicleTrip().getTenantId().split("\\.").length == 1) {
			throw new CustomException(VehicleTripConstants.INVALID_TENANT, " Invalid TenantId");
		}
		if (request.getVehicleTrip().getVehicle() == null  || StringUtils.isEmpty(request.getVehicleTrip().getVehicle().getId())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "vehicleId is mandatory");
		}else {
			List<Vehicle> vehicles = vehicleService.search(VehicleSearchCriteria.builder().ids(Arrays.asList(request.getVehicleTrip().getVehicle().getId())).tenantId(request.getVehicleTrip().getTenantId()).build(), request.getRequestInfo()).getVehicle();
			if(CollectionUtils.isEmpty(vehicles)) {
				throw new CustomException(VehicleTripConstants.INVALID_VEHICLE, "vehicle does not exists with id "+ request.getVehicleTrip().getVehicle().getId());
			}else {
				request.getVehicleTrip().setVehicle(vehicles.get(0));
			}
		}
		
		if (StringUtils.isEmpty(request.getVehicleTrip().getBusinessService())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "bussinessService is mandaotry");
		}
		if(request.getVehicleTrip().getTripOwner() != null) {
			ownerExists(request,request.getRequestInfo());
		}
		
		if(request.getVehicleTrip().getDriver() != null) {
			driverExists(request, request.getRequestInfo());
		}
		
		if(request.getVehicleTrip().getTripDetails() ==null || CollectionUtils.isEmpty(request.getVehicleTrip().getTripDetails())) {
			throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR, "atleast one trip detail is mandatory");
		}
		
	
		
		
		
	}

	public void ownerExists(VehicleTripRequest request, RequestInfo requestInfo) {
		User owner = request.getVehicleTrip().getTripOwner();
		UserDetailResponse userDetailResponse = null;
		org.egov.vehicle.web.model.user.User user = org.egov.vehicle.web.model.user.User.builder().tenantId(owner.getTenantId()).build();
		BeanUtils.copyProperties(owner,user);
		userDetailResponse = userService.userExists(user, requestInfo);
		if (userDetailResponse == null && CollectionUtils.isEmpty(userDetailResponse.getUser())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "Invalid Trip owner");
		}else {
			BeanUtils.copyProperties(userDetailResponse.getUser().get(0),owner);
			request.getVehicleTrip().setTripOwner(owner);
		}
	}
	
	public void driverExists(VehicleTripRequest request, RequestInfo requestInfo) {
		User driver = request.getVehicleTrip().getDriver();
		UserDetailResponse userDetailResponse = null;
		org.egov.vehicle.web.model.user.User user = org.egov.vehicle.web.model.user.User.builder().tenantId(driver.getTenantId()).build();
		BeanUtils.copyProperties(driver,user);
		userDetailResponse = userService.userExists(user, requestInfo);
		if (userDetailResponse == null && CollectionUtils.isEmpty(userDetailResponse.getUser())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "Invalid Trip driver");
		}else {
			BeanUtils.copyProperties(userDetailResponse.getUser().get(0),driver);
			request.getVehicleTrip().setDriver(driver);
		}
	}
	
	public void validateUpdateRecord(VehicleTripRequest request) {
		
		// TODO: below vlaidation is required while marking the vehicleTrip for ReadyForDispoal
		if( request.getWorkflow().getAction().equalsIgnoreCase(VehicleTripConstants.READY_FOR_DISPOSAL)) {
			request.getVehicleTrip().getTripDetails().forEach(tripDetail->{
				
				if(tripDetail.getItemStartTime() <=0 || tripDetail.getItemEndTime() <= 0 || tripDetail.getItemStartTime() > tripDetail.getItemEndTime()) {
					throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR, "trip Start and End Time are invliad for tripDetails referenceNo: " + tripDetail.getReferenceNo());
				}
				
				if(tripDetail.getVolume() == null  || tripDetail.getVolume() <= 0) {
					throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR, "Invalid Volume for  tripDetails referenceNo: " + tripDetail.getReferenceNo());
				}
			});
			List<Object> preparedStmtList = new ArrayList<>();
			String query = queryBuilder.getVehicleLogExistQuery(request.getVehicleTrip().getId(), preparedStmtList);
			int vehicleLogCount = vehicleTripRepository.getDataCount(query, preparedStmtList);
			if(vehicleLogCount <= 0) {
				throw new CustomException(VehicleTripConstants.UPDATE_VEHICLELOG_ERROR, "VehicleLog Not found in the System" + request.getVehicleTrip());
			}
		} else if( request.getWorkflow().getAction().equalsIgnoreCase(VehicleTripConstants.DISPOSE)) {
			ArrayList ids = new ArrayList<String>();
			ids.add(request.getVehicleTrip().getVehicleId());
			VehicleSearchCriteria criteria = VehicleSearchCriteria.builder().ids(ids).build();
			Vehicle vehicle = repository.getVehicleData(criteria).getVehicle().get(0);
			if(request.getVehicleTrip().getVolumeCarried() == null  || request.getVehicleTrip().getVolumeCarried() <= 0 ) {
				throw new CustomException(VehicleTripConstants.INVALID_VOLUME, "Invalid volume carried");
			}else if(request.getVehicleTrip().getVolumeCarried() > vehicle.getTankCapacity()) {
				throw new CustomException(VehicleTripConstants.VOLUME_GRT_CAPACITY, "Waster collected is greater than vehicle Capcity");
			}
				
				
				
				if(request.getVehicleTrip().getTripEndTime() <= 0) {
				throw new CustomException(VehicleTripConstants.INVALID_TRIP_ENDTIME, "Invalid Trip end time");
			}
		}
		
		
	}

	
	
	public void validateSearch(RequestInfo requestInfo, VehicleTripSearchCriteria criteria) {
		if(StringUtils.isEmpty(criteria.getTenantId())) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "TenantId is mandatory in search");
		}
		String allowedParamStr = config.getAllowedVehicleLogSearchParameters();
		if (StringUtils.isEmpty(allowedParamStr) && !criteria.isEmpty())
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "No search parameters are expected");
		else {
			List<String> allowedParams = Arrays.asList(allowedParamStr.split(","));
			validateSearchParams(criteria, allowedParams);
		}
	}
	
	
	private void validateSearchParams(VehicleTripSearchCriteria criteria, List<String> allowedParams) {

		if (criteria.getOffset() != null && !allowedParams.contains("offset"))
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on offset is not allowed");

		if (criteria.getLimit() != null && !allowedParams.contains("limit"))
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on limit is not allowed");
		
		if (StringUtils.isEmpty(criteria.getBusinessService())&& !allowedParams.contains("businessService")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on businessService is not allowed");
		}
		
		if (CollectionUtils.isEmpty(criteria.getTripOwnerIds())&& !allowedParams.contains("tripOwnerIds")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on tripOwnerIds is not allowed");
		}
		
		if (CollectionUtils.isEmpty(criteria.getDriverIds())&& !allowedParams.contains("driverIds")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on driverIds is not allowed");
		}
		
		if (CollectionUtils.isEmpty(criteria.getIds())&& !allowedParams.contains("ids")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on ids is not allowed");
		}
		
		if (CollectionUtils.isEmpty(criteria.getVehicleIds())&& !allowedParams.contains("vehicleIds")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on vehicleIds is not allowed");
		}
		
		if (CollectionUtils.isEmpty(criteria.getApplicationStatus())&& !allowedParams.contains("applicationStatus")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on applicationStatus is not allowed");
		}
		
		if (CollectionUtils.isEmpty(criteria.getRefernceNos())&& !allowedParams.contains("refernceNos")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on refernceNos is not allowed");
		}
		
		if (CollectionUtils.isEmpty(criteria.getApplicationNos())&& !allowedParams.contains("applicationNos")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on applicationNos is not allowed");
		}
	}

}
