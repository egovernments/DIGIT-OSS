package org.egov.pt.calculator.util;

import org.springframework.stereotype.Component;

@Component
public class BillingSlabConstants {
	
	
	public static final String MDMS_PT_MOD_NAME = "PropertyTax";
	public static final String MDMS_CONSTRUCTIONTYPE_MASTER_NAME = "ConstructionType";
	public static final String MDMS_ROADTYPE_MASTER_NAME = "RoadType";
	public static final String MDMS_PROPERTYTYPE_MASTER_NAME = "PropertyType";

	public static final String MDMS_PROPERTYTAX_JSONPATH = "$.MdmsRes.PropertyTax.";
	public static final String MDMS_CODE_JSONPATH = "$.*.code";
		
	public static final String MDMS_DATA_NOT_FOUND_KEY  = "MDMS data couldn't be fetched. Skipping code validation.....";
	
	public static final String MDMS_DATA_NOT_FOUND_MESSAGE  = "MDMS data couldn't be fetched. Skipping code validation.....";


}
