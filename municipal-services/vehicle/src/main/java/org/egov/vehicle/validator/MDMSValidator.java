package org.egov.vehicle.validator;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
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
	private Map<String, List<String>> mdmsResMap ;
	
		// TODO Auto-generated method stub
	public void validateMdmsData(VehicleRequest vehicleRequest, Object mdmsData) {

		this.mdmsResMap  = getAttributeValues(mdmsData);
		String[] masterArray = { Constants.VEHICLE_MAKE_MODEL , Constants.VEHICLE_SUCTION_TYPE};

		validateIfMasterPresent(masterArray,this.mdmsResMap);
	
		
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
		final Map<String, List<String>> mdmsResMap = new HashMap<>();
		modulepaths.forEach(modulepath -> {
			try {
				mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
			} catch (Exception e) {
				log.error("Error while fetvhing MDMS data", e);
				throw new CustomException(VehicleErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
						VehicleErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
			}
		});
		return mdmsResMap;
	}
	
	/**
	 * validate the existnance of provided property type in MDMS
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateVehicleType(String vehicleType ) throws CustomException{
		
		Map<String, String> errorMap = new HashMap<>();
		
		if( !this.mdmsResMap.get(Constants.VEHICLE_MAKE_MODEL).contains(vehicleType) ) {
			errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_TYPE," Vehicle Type is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	/**
	 * validate the existnance of provided property type in MDMS
	 * @param propertyType
	 * @throws CustomException
	 */
	public void validateSuctionType(String suctionType ) throws CustomException{
		
		Map<String, String> errorMap = new HashMap<>();
		
		if( !this.mdmsResMap.get(Constants.VEHICLE_SUCTION_TYPE).contains(suctionType) ) {
			errorMap.put(VehicleErrorConstants.INVALID_VEHICLE_SUCTION_TYPE," Vehicle SuctionType is invalid");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

}