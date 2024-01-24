package org.egov.vendor.util;

import org.springframework.stereotype.Component;

@Component
public class VendorErrorConstants {

	private VendorErrorConstants() {

	}

	public static final String INVALID_SEARCH = "INVALID SEARCH";
	public static final String INVALID_ADDRES = "INVALID ADDRESS";
	public static final String INVALID_OWNER_ERROR = "INVALID_OWNER_INFO";
	public static final String INVALID_DRIVER_ERROR = "INVALID_DRIVER_INFO";
	public static final String ALREADY_VENDOR_EXIST = "VENDOR_ALREADY_EXIST";
	public static final String VENDOR_ERROR_MESSAGE = "Vendor already exist with mobile number";
	public static final String INVALID_AGENCY_TYPE = "INVALID_AGENCY_TYPE";
	public static final String INVALID_PAYMENT_PREFERENCE = "INVALID_PAYMENT_PREFERENCE";
	public static final String INVALID_TENANT_ID_MDMS_KEY = "INVALID_TENANT_ID_MDMS_KEY";
	public static final String INVALID_TENANT_ID_MDMS_MSG = "INVALID_TENANT_ID_MDMS_MSG";
	public static final String INVALID_OWNER_ERROR_MESSAGE = "Dob, relationShip, relation ship name and gender are mandaotry !";
	public static final String MOBILE_NUMBER_ALREADY_EXIST = "MOBILE_NUMBER_ALREADY_EXIST";
}
