package org.egov.tlcalculator.utils;

import org.springframework.stereotype.Component;

@Component
public class ErrorConstants {
	
	public static final String MULTIPLE_TENANT_CODE = "MULTIPLE_TENANTS";
	public static final String MULTIPLE_TENANT_MSG = "All Billingslabs being created must belong to one single tenant";
	
	public static final String INVALID_TRADETYPE_CODE = "INVALID_TRADETYPE";
	public static final String INVALID_TRADETYPE_MSG = "The following TradeType is invalid";
	
	public static final String INVALID_ACCESSORIESCATEGORY_CODE = "INVALID_ACCESSORIESCATEGORY";
	public static final String INVALID_ACCESSORIESCATEGORY_MSG = "The following AccessoriesCategory is invalid";
	
	public static final String INVALID_STRUCTURETYPE_CODE = "INVALID_STRUCTURETYPE";
	public static final String INVALID_STRUCTURETYPE_MSG = "The following StructureType is invalid";
	
	public static final String INVALID_UOM_CODE = "INVALID_UOM";
	public static final String INVALID_UOM_MSG = "The following UOM is invalid";
	
	public static final String DUPLICATE_SLABS_CODE = "DUPLICATE_BILLINGSLABS";
	public static final String DUPLICATE_SLABS_MSG = "The following Billing slabs are already available in the system";
	
	public static final String INVALID_IDS_CODE = "INVALID_IDS_UPDATE";
	public static final String INVALID_IDS_MSG = "The following Billing slabs are not available in the system, IDS";
	
	public static final String INVALID_SLAB_CODE = "INVALID_SLAB";
	public static final String INVALID_SLAB_MSG = "Billing slab must contain either TradeType OR AccesoriesCategory, not both.";
	

}
