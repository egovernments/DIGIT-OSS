package org.egov.pt.calculator.util;

import org.springframework.stereotype.Component;

@Component
public class BillingSlabConstants {
	
	public static final String MDMS_PT_MOD_NAME = "PropertyTax";
	public static final String MDMS_PROPERTYSUBTYPE_MASTER_NAME = "PropertySubType";
	public static final String MDMS_PROPERTYTYPE_MASTER_NAME = "PropertyType";
	public static final String MDMS_USAGEMINOR_MASTER_NAME = "UsageCategoryMinor";
	public static final String MDMS_USAGESUBMINOR_MASTER_NAME = "UsageCategorySubMinor";
	public static final String MDMS_USAGEDETAIL_MASTER_NAME = "UsageCategoryDetail";
	public static final String MDMS_USAGEMAJOR_MASTER_NAME = "UsageCategoryMajor";
	public static final String MDMS_SUBOWNERSHIP_MASTER_NAME = "SubOwnerShipCategory";
	public static final String MDMS_OWNERSHIP_MASTER_NAME = "OwnerShipCategory";
	public static final String MDMS_OCCUPANCYTYPE_MASTER_NAME = "OccupancyType";

	
	public static final String MDMS_PROPERTYTAX_JSONPATH = "$.MdmsRes.PropertyTax.";
	public static final String MDMS_CODE_JSONPATH = "$.*.code";
	
	public static final String ALL_PLACEHOLDER_BILLING_SLAB = "All";
	
	public static final String MDMS_DATA_NOT_FOUND_KEY  = "MDMS data couldn't be fetched. Skipping code validation.....";
	
	public static final String MDMS_DATA_NOT_FOUND_MESSAGE  = "MDMS data couldn't be fetched. Skipping code validation.....";


}
