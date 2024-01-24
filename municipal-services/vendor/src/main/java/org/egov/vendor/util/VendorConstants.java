package org.egov.vendor.util;

import org.springframework.stereotype.Component;

@Component
public class VendorConstants {

	private VendorConstants() {

	}

	public static final String VENDOR_MODULE_CODE = "VENDOR";

	// mdms master names
	public static final String SUCTION_TYPE = "SuctionType";
	public static final String VEHICLE_TYPE = "Type";
	public static final String MODEL = "Model";

	public static final String EMPLOYEE = "EMPLOYEE";
	public static final String VENDOR = "VENDOR";

	public static final String EMP_STATUS = "EMPLOYED";

	public static final String EMP_TYPE = "CONTRACT";

	public static final String JURIDICTION_HIERARAHY = "ADMIN";

	public static final String JURIDICTION_BOUNDARYTYPE = "City";

	public static final String ASSIGNMENT_DEPT = "DEPT_3";

	public static final String ASSIGNMENT_DESGNATION = "DESIG_17";

	public static final String COULD_NOT_CREATE_VEHICLE = "COULD_NOT_CREATE_VEHICLE";

	public static final String CITIZEN = "CITIZEN";

	public static final String AGENCY_TYPE = "AGENCY_TYPE";

	public static final String PAYMENT_PREFERENCE = "PAYMENT_PREFERENCE";

	public static final String VENDOR_JSONPATH_CODE = "$.MdmsRes.Vendor";

	public static final String VENDOR_AGENCY_TYPE = "AgencyType";

	public static final String VENDOR_PAYMENT_PREFERENCE = "PaymentPreference";

	public static final String VENDOR_MODULE = "Vendor";

	public static final String UPDATE_ERROR = "Update Error";

	public static final String UPDATE_VEHICLE_ERROR = "UPDATE_VEHICLE_ERROR";
	public static final String CREATED_DATE = "createdDate";
	public static final String LAST_MODIFIED_DATE = "lastModifiedDate";
	public static final String DOB = "dob";
	public static final String ACTIVE = "ACTIVE";
	public static final String ILLEGAL_ARGUMENT_EXCEPTION = "IllegalArgumentException";
	public static final String TENANT_ID_MANDATORY = "TenantId is mandatory in search";
	public static final String DISABLED = "DISABLED";
	public static final String FSM_DRIVER = "FSM_DRIVER";

}
