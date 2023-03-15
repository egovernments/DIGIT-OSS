package org.egov.vehicle.validator;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.vehicle.trip.util.VehicleTripConstants;
import org.egov.vehicle.util.Constants;
import org.egov.vehicle.util.VehicleErrorConstants;
import org.egov.vehicle.web.model.VehicleRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class MDMSValidator {
	private Map<String, List<String>> mdmsResMap;

	public void validateMdmsData(Object mdmsData) {

		this.mdmsResMap = getAttributeValues(mdmsData);
		String[] masterArray = { Constants.VEHICLE_MAKE_MODEL, Constants.VEHICLE_SUCTION_TYPE,
				Constants.VEHICLE_DECLINE_REASON, Constants.VEHICLE_OWNER_TYPE };

		validateIfMasterPresent(masterArray, this.mdmsResMap);

	}

	private void validateIfMasterPresent(String[] masterNames, Map<String, List<String>> codes) {
		Map<String, String> errorMap = new HashMap<>();
		for (String masterName : masterNames) {
			if (CollectionUtils.isEmpty(codes.get(masterName))) {
				errorMap.put("MDMS DATA ERROR ", "Unable to fetch " + masterName + " codes from MDMS");
			}
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	public Map<String, List<String>> getAttributeValues(Object mdmsData) {

		List<String> modulepaths = Arrays.asList(Constants.VEHICLE_JSONPATH_CODE);
		final Map<String, List<String>> respMsmsMap = new HashMap<>();
		modulepaths.forEach(modulepath -> {
			try {
				respMsmsMap.putAll(JsonPath.read(mdmsData, modulepath));
			} catch (Exception e) {
				log.error("Error while fetching MDMS data", e);
				throw new CustomException(VehicleErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
						VehicleErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
			}
		});
		return respMsmsMap;
	}

	/**
	 * validate the existnance of provided property type in MDMS
	 * 
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateVehicleType(VehicleRequest vehicleRequest) {
		String vehicleType = vehicleRequest.getVehicle().getType();
		Double capacity = vehicleRequest.getVehicle().getTankCapacity();
		Map<String, String> errorMap = new HashMap<>();

		List<String> vehicleModel = this.mdmsResMap.get(Constants.VEHICLE_MAKE_MODEL);
		@SuppressWarnings("unchecked")
		List<Map<String, String>> vehiclemap = JsonPath.parse(vehicleModel)
				.read(VehicleTripConstants.VEHICLE_TYPE + vehicleType + "')]");
		if (vehiclemap != null && !vehiclemap.isEmpty()) {
			Map<String, String> data = vehiclemap.get(0);
			if (!(data.get("code").equals(vehicleType))) {
				errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_TYPE, "Vehicle is invalid");
			}
			if (data.containsKey(VehicleTripConstants.CAPACITY)
					&& !(data.get(VehicleTripConstants.CAPACITY).equals(capacity))) {
				String tankCapacity = data.get(VehicleTripConstants.CAPACITY);
				vehicleRequest.getVehicle().setTankCapacity(Double.parseDouble(tankCapacity));
			}
		} else {
			errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_TYPE, "Vehicle Type is invalid");
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);

	}

	/**
	 * validate the existnance of provided property type in MDMS
	 * 
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateSuctionType(String suctionType) {

		Map<String, String> errorMap = new HashMap<>();

		if (!this.mdmsResMap.get(Constants.VEHICLE_SUCTION_TYPE).contains(suctionType)) {
			errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_SUCTION_TYPE, " Vehicle SuctionType is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	/**
	 * validate the existnance of provided property type in MDMS
	 * 
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateVehicleDeclineReason(String vehicleDeclineReason) {

		Map<String, String> errorMap = new HashMap<>();

		List<String> vehicleRejectionReason = this.mdmsResMap.get(Constants.VEHICLE_DECLINE_REASON);

		@SuppressWarnings("unchecked")
		List<Map<String, String>> vehicleRejectionReasonMap = JsonPath.parse(vehicleRejectionReason)
				.read(VehicleTripConstants.VEHICLE_TYPE + vehicleDeclineReason + "')]");
		if (vehicleRejectionReasonMap != null && !vehicleRejectionReasonMap.isEmpty()) {
			Map<String, String> data = vehicleRejectionReasonMap.get(0);
			if (!(data.get("code").equals(vehicleDeclineReason))) {
				errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_DECLINE_REASON, "Vehicle Decline Reason is invalid");
			}

		} else {
			errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_DECLINE_REASON, "Vehicle Decline Reason is invalid");
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	/**
	 * validate the existence of provided vehicleOwner in MDMS
	 * 
	 * @param vehicleOwner
	 * @throws CustomException
	 */
	public void validateVehicleOwner(String vehicleOwner) {

		Map<String, String> errorMap = new HashMap<>();

		List<String> vehicleOwners = this.mdmsResMap.get(Constants.VEHICLE_OWNER_TYPE);

		@SuppressWarnings("unchecked")
		List<Map<String, String>> vehicleOwnerMap = JsonPath.parse(vehicleOwners)
				.read(VehicleTripConstants.VEHICLE_TYPE + vehicleOwner + "')]");
		if (vehicleOwnerMap != null && !vehicleOwnerMap.isEmpty()) {
			Map<String, String> data = vehicleOwnerMap.get(0);
			if (!(data.get("code").equals(vehicleOwner))) {
				errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_OWNER, "Vehicle Owner is invalid");
			}

		} else {
			errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_OWNER, "Vehicle Owner is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

}