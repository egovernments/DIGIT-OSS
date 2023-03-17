package org.egov.vehicle.trip.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.repository.VehicleRepository;
import org.egov.vehicle.service.UserService;
import org.egov.vehicle.service.VehicleService;
import org.egov.vehicle.trip.querybuilder.VehicleTripQueryBuilder;
import org.egov.vehicle.trip.repository.VehicleTripRepository;
import org.egov.vehicle.trip.service.VehicleTripFSMService;
import org.egov.vehicle.trip.util.VehicleTripConstants;
import org.egov.vehicle.trip.web.model.PlantMapping;
import org.egov.vehicle.trip.web.model.VehicleTrip;
import org.egov.vehicle.trip.web.model.VehicleTripDetail;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.trip.web.model.VehicleTripResponse;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.egov.vehicle.util.VehicleUtil;
import org.egov.vehicle.validator.MDMSValidator;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.egov.vehicle.web.model.user.UserDetailResponse;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class VehicleTripValidator {

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

	@Autowired
	private VehicleTripFSMService vehicleTripFSMService;

	@Autowired
	private VehicleUtil util;

	@Autowired
	private MDMSValidator mdmsValidator;

	public void validateCreateOrUpdateRequest(VehicleTripRequest request) {

		request.getVehicleTrip().forEach(vehicleTrip -> {

			if (vehicleTrip.getTripDetails().get(0).getReferenceNo() != null) {
				vehicleTrip = vehicleTripDetailsValidation(vehicleTrip, request);

			} else {

				if (vehicleTrip.getTripStartTime() <= 0 || vehicleTrip.getTripEndTime() <= 0
						|| vehicleTrip.getTripStartTime() > vehicleTrip.getTripEndTime()) {
					throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR,
							"Trip Start and End Time are invalid: ");
				}

				if (vehicleTrip.getVolumeCarried() == null || vehicleTrip.getVolumeCarried() <= 0) {
					throw new CustomException(VehicleTripConstants.INVALID_VOLUME, "Invalid volume carried");
				}
				if (VehicleTripConstants.FSM_VEHICLE_TRIP_BUSINESSSERVICE
						.equalsIgnoreCase(vehicleTrip.getBusinessService())) {
					checkFstpMapCheck(vehicleTrip, request);

				}
			}
		});

	}

	private void checkFstpMapCheck(VehicleTrip vehicleTrip, VehicleTripRequest request) {
		PlantMapping plantMapping = vehicleTripFSMService.getPlantMapping(request.getRequestInfo(),
				vehicleTrip.getTenantId(), request.getRequestInfo().getUserInfo().getUuid());
		if (null != plantMapping && StringUtils.isNotEmpty(plantMapping.getPlantCode())) {

			Map<String, String> additionalDetails = vehicleTrip.getAdditionalDetails() != null
					? (Map<String, String>) vehicleTrip.getAdditionalDetails()
					: new HashMap<>();

			if (null != additionalDetails) {
				log.info(VehicleTripConstants.FSTP_PLANT_CODE + plantMapping.getPlantCode());
				additionalDetails.put(VehicleTripConstants.PLANT_CODE, plantMapping.getPlantCode());
				vehicleTrip.setAdditionalDetails(additionalDetails);
			} else {

				ObjectMapper mapper = new ObjectMapper();
				ObjectNode additionalDtlObjectNode = mapper.createObjectNode();
				additionalDtlObjectNode.set(VehicleTripConstants.PLANT_CODE,
						TextNode.valueOf(plantMapping.getPlantCode()));
				vehicleTrip.setAdditionalDetails(additionalDtlObjectNode);

			}

			log.info(VehicleTripConstants.FSTP_PLANT_CODE + plantMapping.getPlantCode());
		} else {
			log.error("Logged user to FSTP mapping doesn't exists. ");
			throw new CustomException(VehicleTripConstants.EMPLOYEE_FSTP_MAP_NOT_EXISTS,
					"Logged user to FSTP mapping doesn't exists.");
		}
	}

	private VehicleTrip vehicleTripDetailsValidation(VehicleTrip vehicleTrip, VehicleTripRequest request) {

		if (StringUtils.isEmpty(vehicleTrip.getTenantId())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "TenantId is mandatory");
		}
		if (vehicleTrip.getTenantId().split("\\.").length == 1) {
			throw new CustomException(VehicleTripConstants.INVALID_TENANT, " Invalid TenantId");
		}
		if (StringUtils.isEmpty(vehicleTrip.getBusinessService())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "Bussiness Service is mandatory");
		}
		if (vehicleTrip.getTripDetails() == null) {
			throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR,
					"atleast one trip detail is mandatory");
		}
		if (vehicleTrip.getVehicle() == null || StringUtils.isEmpty(vehicleTrip.getVehicle().getId())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "vehicleId is mandatory");
		} else {
			List<Vehicle> vehicles = vehicleService
					.search(VehicleSearchCriteria.builder().ids(Arrays.asList(vehicleTrip.getVehicle().getId()))
							.tenantId(vehicleTrip.getTenantId()).build(), request.getRequestInfo())
					.getVehicle();
			if (CollectionUtils.isEmpty(vehicles)) {
				throw new CustomException(VehicleTripConstants.INVALID_VEHICLE,
						"vehicle does not exists with id " + vehicleTrip.getVehicle().getId());
			} else {
				vehicleTrip.setVehicle(vehicles.get(0));
			}
		}

		if (vehicleTrip.getTripOwner() != null) {
			ownerExists(vehicleTrip);
		}

		if (vehicleTrip.getDriver() != null) {
			driverExists(vehicleTrip);
		}
		return vehicleTrip;
	}

	public void ownerExists(VehicleTrip vehicleTrip) {
		User owner = vehicleTrip.getTripOwner();
		UserDetailResponse userDetailResponse = null;
		org.egov.vehicle.web.model.user.User user = org.egov.vehicle.web.model.user.User.builder()
				.tenantId(owner.getTenantId()).build();
		BeanUtils.copyProperties(owner, user);
		userDetailResponse = userService.userExists(user);
		if (userDetailResponse == null || CollectionUtils.isEmpty(userDetailResponse.getUser())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "Invalid Trip owner");
		} else {
			userDetailResponse.getUser().forEach(userInfo -> {

				userInfo.getRoles().forEach(role -> {

					if (role.getCode().contains(VehicleTripConstants.FSM_DSO)) {
						BeanUtils.copyProperties(userInfo, owner);
					}

				});
			});
			vehicleTrip.setTripOwner(owner);
		}
	}

	public void driverExists(VehicleTrip vehicleTrip) {
		User driver = vehicleTrip.getDriver();
		UserDetailResponse userDetailResponse = null;
		org.egov.vehicle.web.model.user.User user = org.egov.vehicle.web.model.user.User.builder()
				.tenantId(driver.getTenantId()).build();
		BeanUtils.copyProperties(driver, user);
		userDetailResponse = userService.userExists(user);
		if (userDetailResponse == null || CollectionUtils.isEmpty(userDetailResponse.getUser())) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLELOG_ERROR, "Invalid Trip driver");
		} else {
			userDetailResponse.getUser().forEach(userInfo -> {

				userInfo.getRoles().forEach(role -> {

					if (role.getCode().contains(VehicleTripConstants.FSM_DRIVER)) {
						BeanUtils.copyProperties(userInfo, driver);
					}

				});
			});
			vehicleTrip.setDriver(driver);
		}
	}

	public void validateUpdateRecord(VehicleTripRequest request) {
		log.info("request: getWorkflow: action :: " + request.getWorkflow().getAction());
		if (request.getWorkflow().getAction().equalsIgnoreCase(VehicleTripConstants.READY_FOR_DISPOSAL)) {
			log.info("READY_FOR_DISPOSAL::");

			request.getVehicleTrip().forEach(vehicleTrip -> {
				checkVehicleLogExistance(vehicleTrip, request);

			});
		} else if (request.getWorkflow().getAction().equalsIgnoreCase(VehicleTripConstants.DISPOSE)) {
			log.info("DISPOSE::" + VehicleTripConstants.DISPOSE);
			ArrayList<String> ids = new ArrayList<>();

			request.getVehicleTrip().forEach(vehicleTrip -> {
				callBusinessServiceToDispose(vehicleTrip, request, ids);

			});

		} else if (request.getWorkflow().getAction().equalsIgnoreCase(VehicleTripConstants.DECLINEVEHICLE)) {
			log.info("DECLINEVEHICLE::" + VehicleTripConstants.DECLINEVEHICLE);
			request.getVehicleTrip().forEach(vehicleTrip -> {
				declineVechicleValidator(vehicleTrip, request);

			});

		} else if (VehicleTripConstants.UPDATE_ONLY_VEHICLE_TRIP_RECORD
				.equalsIgnoreCase(request.getWorkflow().getAction())) {
			log.info("UPDATE_ONLY_VEHICLE_TRIP_RECORD::" + VehicleTripConstants.UPDATE_ONLY_VEHICLE_TRIP_RECORD);
			request.getVehicleTrip().forEach(vehicleTrip -> {
				vehicleTrip.getTripDetails().forEach(tripDetail -> {
					if (tripDetail.getVolume() == null || tripDetail.getVolume() <= 0) {
						throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR,
								"Invalid Volume for  tripDetails referenceNo: " + tripDetail.getReferenceNo());
					}
				});

			});

		}
	}

	private void callBusinessServiceToDispose(VehicleTrip vehicleTrip, VehicleTripRequest request,
			ArrayList<String> ids) {
		ids.add(vehicleTrip.getVehicleId());
		VehicleSearchCriteria criteria = VehicleSearchCriteria.builder().ids(ids).build();
		Vehicle vehicle = repository.getVehicleData(criteria).getVehicle().get(0);
		if (vehicleTrip.getVolumeCarried() == null || vehicleTrip.getVolumeCarried() <= 0) {
			throw new CustomException(VehicleTripConstants.INVALID_VOLUME, "Invalid volume carried");
		} else if (vehicleTrip.getVolumeCarried() > vehicle.getTankCapacity()) {
			throw new CustomException(VehicleTripConstants.VOLUME_GRT_CAPACITY,
					"Waster collected is greater than vehicle Capcity");
		}
		if (vehicleTrip.getTripEndTime() <= 0) {
			throw new CustomException(VehicleTripConstants.INVALID_TRIP_ENDTIME, "Invalid Trip end time");
		}

		validateTripInOutTime(vehicleTrip, vehicleTrip.getTripDetails().get(0));

		if (VehicleTripConstants.FSM_VEHICLE_TRIP_BUSINESSSERVICE.equalsIgnoreCase(vehicleTrip.getBusinessService())) {
			PlantMapping plantMapping = vehicleTripFSMService.getPlantMapping(request.getRequestInfo(),
					vehicleTrip.getTenantId(), request.getRequestInfo().getUserInfo().getUuid());
			if (null != plantMapping && StringUtils.isNotEmpty(plantMapping.getPlantCode())) {

				validatePlantCode(vehicleTrip, plantMapping);

			} else {
				log.error("Logged user to FSTP mapping doesn't exists. ");
				throw new CustomException(VehicleTripConstants.EMPLOYEE_FSTP_MAP_NOT_EXISTS,
						"Logged user to FSTP mapping doesn't exists.");
			}
		}

	}

	private void validatePlantCode(VehicleTrip vehicleTrip, PlantMapping plantMapping) {
		Map<String, String> additionalDetails = vehicleTrip.getAdditionalDetails() != null
				? (Map<String, String>) vehicleTrip.getAdditionalDetails()
				: new HashMap<>();

		if (null != additionalDetails) {
			log.info(VehicleTripConstants.FSTP_PLANT_CODE + plantMapping.getPlantCode());
			additionalDetails.put(VehicleTripConstants.PLANT_CODE, plantMapping.getPlantCode());
			vehicleTrip.setAdditionalDetails(additionalDetails);
		} else {

			ObjectMapper mapper = new ObjectMapper();
			ObjectNode additionalDtlObjectNode = mapper.createObjectNode();
			additionalDtlObjectNode.set(VehicleTripConstants.PLANT_CODE, TextNode.valueOf(plantMapping.getPlantCode()));
			vehicleTrip.setAdditionalDetails(additionalDtlObjectNode);

		}
		log.info(VehicleTripConstants.FSTP_PLANT_CODE + plantMapping.getPlantCode());

	}

	private void declineVechicleValidator(VehicleTrip vehicleTrip, VehicleTripRequest request) {
		Map<String, String> additionalDetails = null;
		try {
			additionalDetails = vehicleTrip.getAdditionalDetails() != null
					? (Map<String, String>) vehicleTrip.getAdditionalDetails()
					: new HashMap<>();
		} catch (Exception e) {
			throw new CustomException(VehicleTripConstants.VEHICLE_COMMENT_NOT_EXIST, e.getMessage());
		}

		if (null != additionalDetails && additionalDetails.get("vehicleDeclineReason") == null) {
			throw new CustomException(VehicleTripConstants.INVALID_VEHICLE_DECLINE_REQUEST,
					"Vehicle Decline reason is mandatory ");
		}

		String tenantId = vehicleTrip.getTenantId().split("\\.")[0];
		Object mdmsData = util.mDMSCall(request.getRequestInfo(), tenantId);
		String vehicleDeclineReason = additionalDetails.get("vehicleDeclineReason");
		mdmsValidator.validateMdmsData(mdmsData);
		mdmsValidator.validateVehicleDeclineReason(vehicleDeclineReason);

		if (VehicleTripConstants.VEHICLE_DECLINE_REASON_OTHERS.equalsIgnoreCase(vehicleDeclineReason)
				&& additionalDetails.get("comments") == null) {
			throw new CustomException(VehicleTripConstants.VEHICLE_COMMENT_NOT_EXIST,
					"Comments is mandatory for Vehicle Decline reason others");

		}

	}

	private void checkVehicleLogExistance(VehicleTrip vehicleTrip, VehicleTripRequest request) {
		checkVehicleLogExistance(vehicleTrip, request);
		vehicleTrip.getTripDetails().forEach(tripDetail -> {
			validateStartTimeVolume(tripDetail);

		});

		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getVehicleLogExistQuery(vehicleTrip.getId(), preparedStmtList);
		int vehicleLogCount = vehicleTripRepository.getDataCount(query, preparedStmtList);
		log.info("vehicleLogCount :: " + vehicleLogCount);
		if (vehicleLogCount <= 0) {
			throw new CustomException(VehicleTripConstants.UPDATE_VEHICLELOG_ERROR,
					"VehicleLog Not found in the System" + request.getVehicleTrip());
		}

	}

	private void validateStartTimeVolume(VehicleTripDetail tripDetail) {
		if (tripDetail.getItemStartTime() <= 0 || tripDetail.getItemEndTime() <= 0
				|| tripDetail.getItemStartTime() > tripDetail.getItemEndTime()) {
			throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR,
					"trip Start and End Time are invalid for tripDetails referenceNo: " + tripDetail.getReferenceNo());
		}

		if (tripDetail.getVolume() == null || tripDetail.getVolume() <= 0) {
			throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR,
					"Invalid Volume for  tripDetails referenceNo: " + tripDetail.getReferenceNo());
		}
	}

	private void validateTripInOutTime(VehicleTrip requestVehicleTrip, VehicleTripDetail requestTripDetail) {

		VehicleTripSearchCriteria tripSearchCriteria = new VehicleTripSearchCriteria();
		String[] referenceNo = { requestTripDetail.getReferenceNo() };
		tripSearchCriteria.setRefernceNos(Arrays.asList(referenceNo));
		tripSearchCriteria.setTenantId(requestVehicleTrip.getTenantId());
		tripSearchCriteria.setApplicationStatus(Arrays.asList(VehicleTripConstants.VEHICLE_LOG_APPLICATION_DISPOSED));

		if (tripSearchCriteria.getRefernceNos() != null
				&& !CollectionUtils.isEmpty(tripSearchCriteria.getRefernceNos())) {

			List<String> tripIds = vehicleTripRepository.getTripFromRefrences(tripSearchCriteria.getRefernceNos());

			if (CollectionUtils.isEmpty(tripSearchCriteria.getIds())) {
				tripSearchCriteria.setIds(tripIds);
			} else {
				tripSearchCriteria.getIds().addAll(tripIds);
			}

		}

		VehicleTripResponse response = vehicleTripRepository.getVehicleLogData(tripSearchCriteria);

		if (response.getVehicleTrip() != null && !CollectionUtils.isEmpty(response.getVehicleTrip())) {
			response.getVehicleTrip().forEach(vehicletrip -> {
				if (requestVehicleTrip.getTripStartTime() <= vehicletrip.getTripEndTime()) {
					throw new CustomException(VehicleTripConstants.INVALID_TRIDETAIL_ERROR,
							"Current Trip Start time: " + requestVehicleTrip.getTripStartTime()
									+ "should be after the previous trip end time : "
									+ requestVehicleTrip.getTripEndTime());
				}
			});
		}
	}

	public void validateSearch(VehicleTripSearchCriteria criteria) {
		if (StringUtils.isEmpty(criteria.getTenantId())) {
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

		if (StringUtils.isEmpty(criteria.getBusinessService()) && !allowedParams.contains("businessService")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on businessService is not allowed");
		}

		if (CollectionUtils.isEmpty(criteria.getTripOwnerIds()) && !allowedParams.contains("tripOwnerIds")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on tripOwnerIds is not allowed");
		}

		if (CollectionUtils.isEmpty(criteria.getDriverIds()) && !allowedParams.contains("driverIds")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on driverIds is not allowed");
		}
		validateIdVehicleRefNoApplication(criteria, allowedParams);

	}

	private void validateIdVehicleRefNoApplication(VehicleTripSearchCriteria criteria, List<String> allowedParams) {
		if (CollectionUtils.isEmpty(criteria.getIds()) && !allowedParams.contains("ids")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on ids is not allowed");
		}

		if (CollectionUtils.isEmpty(criteria.getVehicleIds()) && !allowedParams.contains("vehicleIds")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on vehicleIds is not allowed");
		}

		if (CollectionUtils.isEmpty(criteria.getApplicationStatus()) && !allowedParams.contains("applicationStatus")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH,
					"Search on applicationStatus is not allowed");
		}

		if (CollectionUtils.isEmpty(criteria.getRefernceNos()) && !allowedParams.contains("refernceNos")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on refernceNos is not allowed");
		}

		if (CollectionUtils.isEmpty(criteria.getApplicationNos()) && !allowedParams.contains("applicationNos")) {
			throw new CustomException(VehicleTripConstants.INVALID_SEARCH, "Search on applicationNos is not allowed");
		}
	}

}