package org.egov.fsm.validator;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class MDMSValidator {
	private Map<String, Object> mdmsResMap ;
	
		// TODO Auto-generated method stub
	public void validateMdmsData(FSMRequest fsmRequest, Object mdmsData) {

		this.mdmsResMap  = getAttributeValues(mdmsData);
		String[] masterArray = { FSMConstants.MDMS_PROPERTY_TYPE, FSMConstants.MDMS_APPLICATION_CHANNEL, FSMConstants.MDMS_SANITATION_TYPE, FSMConstants.MDMS_VEHICLE_MAKE_MODEL, FSMConstants.MDMS_PIT_TYPE,FSMConstants.MDMS_CONFIG,FSMConstants.MDMS_SLUM_NAME };

		validateIfMasterPresent(masterArray,this.mdmsResMap);
	
		
	}
	private void validateIfMasterPresent(String[] masterNames, Map<String, Object> codes) {
		Map<String, String> errorMap = new HashMap<>();
		for (String masterName : masterNames) {
			if (codes.get(masterName) ==null || CollectionUtils.isEmpty((Collection<?>) codes.get(masterName))) {
				errorMap.put("MDMS DATA ERROR ", "Unable to fetch " + masterName + " codes from MDMS");
			}
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	public Map<String, Object> getAttributeValues(Object mdmsData) {

		List<String> modulepaths = Arrays.asList(FSMConstants.FSM_JSONPATH_CODE,FSMConstants.VEHICLE_JSONPATH_CODE);
		final Map<String, Object> mdmsResMap = new HashMap<>();
		modulepaths.forEach(modulepath -> {
			try {
				mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
			} catch (Exception e) {
				log.error("Error while fetvhing MDMS data", e);
				throw new CustomException(FSMErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
						FSMErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
			}
		});
		return mdmsResMap;
	}
	
	/**
	 * validate the existnance of provided property type in MDMS
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validatePropertyType(String propertyType ) throws CustomException{
		
		Map<String, String> errorMap = new HashMap<>();
		
		if( !((List<String>) this.mdmsResMap.get(FSMConstants.MDMS_PROPERTY_TYPE)).contains(propertyType) ) {
			errorMap.put(FSMErrorConstants.INVALID_PROPERTY_TYPE," Property Type is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	/**
	 * validate the existnance of provided ApplicationChannel  in MDMS
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateApplicationChannel(String applicationChannel ) throws CustomException{
		
		Map<String, String> errorMap = new HashMap<>();
		
		if( !((List<String>) this.mdmsResMap.get(FSMConstants.MDMS_APPLICATION_CHANNEL)).contains(applicationChannel) ) {
			errorMap.put(FSMErrorConstants.INVALID_APPLICATION_CHANNEL," Application Channel is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	/**
	 * validate the existnance of provided SanitationType in MDMS
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateOnSiteSanitationType(String sanitationType ) throws CustomException{
		
		Map<String, String> errorMap = new HashMap<>();
		
		if( !((List<String>) this.mdmsResMap.get(FSMConstants.MDMS_PIT_TYPE)).contains(sanitationType) ) {
			errorMap.put(FSMErrorConstants.INVALID_PIT_TYPE," On Site PitType is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	public void validateVehicleType(String vehicleType) {
		Map<String, String> errorMap = new HashMap<>();
		
		if( !((List<String>) this.mdmsResMap.get(FSMConstants.MDMS_VEHICLE_MAKE_MODEL)).contains(vehicleType) ) { 
			errorMap.put(FSMErrorConstants.INVALID_VEHICLE_TYPE," VehicleType  is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
		
	}

}