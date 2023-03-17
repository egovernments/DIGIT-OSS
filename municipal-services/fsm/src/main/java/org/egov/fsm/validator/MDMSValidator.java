package org.egov.fsm.validator;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.fsm.plantmapping.util.PlantMappingConstants;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class MDMSValidator {
	private Map<String, Object> mdmsResMap;

	public void validateMdmsData1(Object mdmsData) {

		this.mdmsResMap = getAttributeValues(mdmsData);
		String[] masterArray = { FSMConstants.MDMS_PROPERTY_TYPE, FSMConstants.MDMS_APPLICATION_CHANNEL,
				FSMConstants.MDMS_SANITATION_TYPE, FSMConstants.MDMS_VEHICLE_MAKE_MODEL, FSMConstants.MDMS_PIT_TYPE,
				FSMConstants.MDMS_CONFIG, FSMConstants.MDMS_SLUM_NAME, FSMConstants.MDMS_APPLICATION_TYPE,
				FSMConstants.MDMS_PAYMENT_PREFERENCE, FSMConstants.MDMS_RECEIVED_PAYMENT };

		validateIfMasterPresent(masterArray, this.mdmsResMap);
	}

	private void validateIfMasterPresent(String[] masterNames, Map<String, Object> codes) {
		Map<String, String> errorMap = new HashMap<>();
		for (String masterName : masterNames) {
			if (codes.get(masterName) == null || CollectionUtils.isEmpty((Collection<?>) codes.get(masterName))) {
				errorMap.put("MDMS DATA ERROR ", "Unable to fetch " + masterName + " codes from MDMS");
			}
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	public Map<String, Object> getAttributeValues(Object mdmsData) {

		List<String> modulepaths = Arrays.asList(FSMConstants.FSM_JSONPATH_CODE, FSMConstants.VEHICLE_JSONPATH_CODE);
		final Map<String, Object> mdmsResMapResponse = new HashMap<>();
		modulepaths.forEach(modulepath -> {
			try {
				mdmsResMapResponse.putAll(JsonPath.read(mdmsData, modulepath));
			} catch (Exception e) {
				log.error("Error while fetvhing MDMS data", e);
				throw new CustomException(FSMErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
						FSMErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
			}
		});
		return mdmsResMapResponse;
	}

	/**
	 * validate the existnance of provided property type in MDMS
	 * 
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validatePropertyType(String propertyType) {

		Map<String, String> errorMap = new HashMap<>();

		if (!((List<String>) this.mdmsResMap.get(FSMConstants.MDMS_PROPERTY_TYPE)).contains(propertyType)) {
			errorMap.put(FSMErrorConstants.INVALID_PROPERTY_TYPE, " Property Type is invalid");
		}

		if (propertyType.split("\\.").length <= 1) {
			errorMap.put(FSMErrorConstants.INVALID_PROPERTY_TYPE,
					" Property Type And Sub property type Both are mandetory.");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	/**
	 * validate the existnance of provided ApplicationChannel in MDMS
	 * 
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateApplicationChannel(String applicationChannel) {

		Map<String, String> errorMap = new HashMap<>();

		if (!((List<String>) this.mdmsResMap.get(FSMConstants.MDMS_APPLICATION_CHANNEL)).contains(applicationChannel)) {
			errorMap.put(FSMErrorConstants.INVALID_APPLICATION_CHANNEL, " Application Channel is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	/**
	 * validate the existnance of provided SanitationType in MDMS
	 * 
	 * @param pitDetail
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateOnSiteSanitationType(String sanitationType) {

		Map<String, String> errorMap = new HashMap<>();
		List<Map<String, String>> pitMap = (List<Map<String, String>>) this.mdmsResMap.get(FSMConstants.MDMS_PIT_TYPE);
		List<Map<String, String>> pitItemMap = JsonPath.parse(pitMap)
				.read("$.[?(@.active==true && @.code=='" + sanitationType + "')]");
		if (pitItemMap.isEmpty()) {
			errorMap.put(FSMErrorConstants.INVALID_PIT_TYPE, " On Site PitType is invalid");
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	public void validateVehicleType(String vehicleType) {
		Map<String, String> errorMap = new HashMap<>();

		if (!((List<String>) this.mdmsResMap.get(FSMConstants.MDMS_VEHICLE_MAKE_MODEL)).contains(vehicleType)) {
			errorMap.put(FSMErrorConstants.INVALID_VEHICLE_TYPE, " VehicleType  is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);

	}

	public void validateMdmsData(Object mdmsData) {

		this.mdmsResMap = getAttributeValues(mdmsData);
		String[] masterArray = { PlantMappingConstants.MDMS_FSTP_PLANT_INFO };

		validateIfMasterPresent(masterArray, this.mdmsResMap);

	}

	public void validateFSTPPlantInfo(String plantCode, String tenantId) {
		Map<String, String> errorMap = new HashMap<>();
		List<Map<String, String>> plantMap = (List<Map<String, String>>) this.mdmsResMap
				.get(PlantMappingConstants.MDMS_FSTP_PLANT_INFO);
		List<Map<String, String>> fstpmap = JsonPath.parse(plantMap).read("$.[?(@.PlantCode=='" + plantCode + "')]");
		if (!fstpmap.isEmpty()) {
			Map<String, String> planMapData = fstpmap.get(0);
			if (!(planMapData.get("PlantCode").equals(plantCode)) || !(planMapData.get("ULBS").contains(tenantId))) {
				errorMap.put(FSMErrorConstants.INVALID_FSTP_CODE, "Invalid FSTP code");
			}
		} else {
			errorMap.put(FSMErrorConstants.INVALID_FSTP_CODE, "Invalid FSTP code");
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}


	public void validateReceivedPaymentType(String receivedPaymentType) {

		Map<String, String> errorMap = new HashMap<>();
		log.info("validateReceivedPaymentType:: " + receivedPaymentType);
		log.info("validateReceivedPaymentType mdmsResMap :: " + mdmsResMap);
		List<String> receivedPaymentModel = (List<String>) this.mdmsResMap.get(FSMConstants.MDMS_RECEIVED_PAYMENT);
		log.info("validateReceivedPaymentType receivedPaymentModel :: " + receivedPaymentModel);
		@SuppressWarnings("unchecked")
		List<Map<String, String>> receivedPaymentmap =  JsonPath.parse(receivedPaymentModel)
				.read("$.[?(@.code=='" + receivedPaymentType + "')]");
		if (!receivedPaymentmap.isEmpty()) {
			Map<String, String> data = receivedPaymentmap.get(0);
			if (!(data.get("code").equals(receivedPaymentType))) {
				errorMap.put(FSMErrorConstants.INVALID_RECEIVED_PAYMENT_TYPE, " Received payment type is invalid");
			}
		} else {
			errorMap.put(FSMErrorConstants.INVALID_RECEIVED_PAYMENT_TYPE, " Received payment type is invalid");
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

}
