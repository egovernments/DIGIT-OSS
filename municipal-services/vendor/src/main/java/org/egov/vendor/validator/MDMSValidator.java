package org.egov.vendor.validator;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.vendor.util.VendorConstants;
import org.egov.vendor.util.VendorErrorConstants;
import org.egov.vendor.web.model.VendorRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class MDMSValidator {

	private Map<String, List<String>> mdmsResMap;

	// TODO Auto-generated method stub
	public void validateMdmsData(Object mdmsData) {

		this.mdmsResMap = getAttributeValues(mdmsData);
		String[] masterArray = { VendorConstants.VENDOR_AGENCY_TYPE, VendorConstants.VENDOR_PAYMENT_PREFERENCE};

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

		List<String> modulepaths = Arrays.asList(VendorConstants.VENDOR_JSONPATH_CODE);
		final Map<String, List<String>> mdmsResMap = new HashMap<>();
		modulepaths.forEach(modulepath -> {
			try {
				mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
			} catch (Exception e) {
				log.error("Error while fetching MDMS data", e);
				throw new CustomException(VendorErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
						VendorErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
			}
		});
		return mdmsResMap;
	}
	
	/**
	 * validate the existence of provided agency type in MDMS
	 * @param agencyType
	 * @throws CustomException
	 */
	public void validateAgencyType(VendorRequest vendorRequest ) throws CustomException{
		String agencyType = vendorRequest.getVendor().getAgencyType();
		Map<String, String> errorMap = new HashMap<>();
	
		List<String> vendorModel =  this.mdmsResMap.get(VendorConstants.VENDOR_AGENCY_TYPE);
		@SuppressWarnings("unchecked")
		List<Map<String, String>> vendormap = (List<Map<String, String>>) JsonPath.parse(vendorModel)
				.read("$.[?(@.code=='" + agencyType + "')]");
		if (vendormap != null && vendormap.size() > 0) {
			Map<String, String> Data = vendormap.get(0);
			if (!(Data.get("code").equals(agencyType))) {
				errorMap.put(VendorErrorConstants.INVALID_AGENCY_TYPE, "Agency Type is invalid");
			}
		} else {
			errorMap.put(VendorErrorConstants.INVALID_AGENCY_TYPE, "Agency Type is invalid");
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
		
	}
	
	/**
	 * validate the existence of provided Payment Preference in MDMS
	 * @param paymentPreference
	 * @throws CustomException
	 */
	public void validatePaymentPreference(VendorRequest vendorRequest ) throws CustomException{
		String paymentPreference = vendorRequest.getVendor().getPaymentPreference();
		Map<String, String> errorMap = new HashMap<>();
	
		List<String> vendorModel =  this.mdmsResMap.get(VendorConstants.VENDOR_PAYMENT_PREFERENCE);
		@SuppressWarnings("unchecked")
		List<Map<String, String>> vendormap = (List<Map<String, String>>) JsonPath.parse(vendorModel)
				.read("$.[?(@.code=='" + paymentPreference + "')]");
		if (vendormap != null && vendormap.size() > 0) {
			Map<String, String> Data = vendormap.get(0);
			if (!(Data.get("code").equals(paymentPreference))) {
				errorMap.put(VendorErrorConstants.INVALID_PAYMENT_PREFERENCE, "Payment Preference is invalid");
			}
		} else {
			errorMap.put(VendorErrorConstants.INVALID_PAYMENT_PREFERENCE, "Payment Preference is invalid");
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
}
