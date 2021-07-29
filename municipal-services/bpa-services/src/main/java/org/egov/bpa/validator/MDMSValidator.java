package org.egov.bpa.validator;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.bpa.util.BPAConstants;
import org.egov.bpa.util.BPAErrorConstants;
import org.egov.bpa.web.model.BPARequest;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class MDMSValidator {

	/**
	 * method to validate the mdms data in the request
	 *
	 * @param bpaRequest
	 */
	public void validateMdmsData(BPARequest bpaRequest, Object mdmsData) {

		Map<String, List<String>> masterData = getAttributeValues(mdmsData);
		String[] masterArray = { BPAConstants.SERVICE_TYPE, BPAConstants.APPLICATION_TYPE,
				BPAConstants.OWNERSHIP_CATEGORY, BPAConstants.OWNER_TYPE, BPAConstants.OCCUPANCY_TYPE,
				BPAConstants.SUB_OCCUPANCY_TYPE, BPAConstants.USAGES };

		validateIfMasterPresent(masterArray, masterData);
	}


	/**
	 * Fetches all the values of particular attribute as map of field name to
	 * list
	 *
	 * takes all the masters from each module and adds them in to a single map
	 *
	 * note : if two masters from different modules have the same name then it
	 *
	 * will lead to overriding of the earlier one by the latest one added to the
	 * map
	 *
	 * @return Map of MasterData name to the list of code in the MasterData
	 *
	 */
	public Map<String, List<String>> getAttributeValues(Object mdmsData) {

		List<String> modulepaths = Arrays.asList(BPAConstants.BPA_JSONPATH_CODE,
				BPAConstants.COMMON_MASTER_JSONPATH_CODE);
		final Map<String, List<String>> mdmsResMap = new HashMap<>();
		modulepaths.forEach(modulepath -> {
			try {
				mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
			} catch (Exception e) {
				throw new CustomException(BPAErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
						BPAErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
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
