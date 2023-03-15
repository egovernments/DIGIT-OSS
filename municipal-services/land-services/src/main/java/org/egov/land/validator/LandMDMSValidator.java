package org.egov.land.validator;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.land.util.LandConstants;
import org.egov.land.web.models.LandInfoRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class LandMDMSValidator {
	/**
	 * method to validate the mdms data in the request
	 *
	 * @param bpaRequest
	 */
	public void validateMdmsData(LandInfoRequest landRequest, Object mdmsData) {

		Map<String, String> errorMap = new HashMap<>();

		Map<String, List<String>> masterData = getAttributeValues(mdmsData);
		String[] masterArray = {
				LandConstants.OWNERSHIP_CATEGORY};

		validateIfMasterPresent(masterArray, masterData);

		landRequest.getLandInfo().getOwners().forEach(owner -> {
			if (owner.getOwnerType() == null) {
				owner.setOwnerType("NONE");
			}
		});
		if (!masterData.get(LandConstants.OWNERSHIP_CATEGORY).contains(landRequest.getLandInfo().getOwnershipCategory()))
			errorMap.put("INVALID OWNERSHIPCATEGORY",
					"The OwnerShipCategory '" + landRequest.getLandInfo().getOwnershipCategory() + "' does not exists");

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}

	

	public Map<String, List<String>> getAttributeValues(Object mdmsData) {

		List<String> modulepaths = Arrays.asList(LandConstants.COMMON_MASTER_JSONPATH_CODE);
		final Map<String, List<String>> mdmsResMap = new HashMap<>();
		modulepaths.forEach(modulepath -> {
			try {
				mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
			} catch (Exception e) {
				throw new CustomException(LandConstants.INVALID_TENANT_ID_MDMS_KEY,
						LandConstants.INVALID_TENANT_ID_MDMS_MSG);
			}
		});
		return mdmsResMap;
	}



	/**
	 * Validates if MasterData is properly fetched for the given MasterData
	 * names
	 * 
	 * @param masterNames
	 * @param codes
	 */
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
}
