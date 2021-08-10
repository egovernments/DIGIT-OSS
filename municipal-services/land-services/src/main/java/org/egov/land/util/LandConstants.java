package org.egov.land.util;

import org.springframework.stereotype.Component;

@Component
public class LandConstants {

	// MDMS

	public static final String BPA_MODULE = "BPA";

	public static final String COMMON_MASTERS_MODULE = "common-masters";

	// mdms master names

	public static final String SERVICE_TYPE = "ServiceType";

	public static final String APPLICATION_TYPE = "ApplicationType";

	public static final String OCCUPANCY_TYPE = "OccupancyType";

	public static final String SUB_OCCUPANCY_TYPE = "SubOccupancyType";

	public static final String USAGES = "Usages";

	public static final String CalculationType = "CalculationType";

	public static final String DOCUMENT_TYPE_MAPPING = "DocTypeMapping";

	public static final String RISKTYPE_COMPUTATION = "RiskTypeComputation";

	public static final String DOCUMENT_TYPE = "DocumentType";

	public static final String OWNER_TYPE = "OwnerType";

	public static final String OWNERSHIP_CATEGORY = "OwnerShipCategory";

	public static final String CHECKLIST_NAME = "CheckList";

	public static final String INVALID_SEARCH = "INVALID SEARCH";

	public static final String CITIZEN = "CITIZEN";
	
	
	// Error Constants in land service 

	public static final String INVALID_ADDRESS = "INVALID ADDRESS";

	public static final String BOUNDARY_ERROR = "BOUNDARY ERROR";

	public static final String BOUNDARY_MDMS_DATA_ERROR = "BOUNDARY MDMS DATA ERROR";

	public static final String INVALID_BOUNDARY_DATA = "INVALID BOUNDARY DATA";

	public static final String OWNER_SEARCH_ERROR = "OWNER SEARCH ERROR";

	public static final String INVALID_TENANT = "INVALID TENANT";

	public static final String UPDATE_ERROR = "UPDATE ERROR";

	public static final String INVALID_ONWER_ERROR = "INVALID ONWER ERROR";

	public static final String ILLEGAL_ARGUMENT_EXCEPTION = "ILLEGAL ARGUMENT EXCEPTION";

	public static final String BPA_CREATE_USER = "BPA CREATE USER";

	public static final String BPA_DUPLICATE_DOCUMENT = "BPA_DUPLICATE_DOCUMENT";

	public static final String DUPLICATE_MOBILENUMBER_EXCEPTION = "DUPLICATE_MOBILENUMBER_EXCEPTION";
	
	//mdms path codes

	public static final Object BPA_JSONPATH_CODE = "$.MdmsRes.BPA";

	public static final String COMMON_MASTER_JSONPATH_CODE = "$.MdmsRes.common-masters";

	// error constants

	public static final String INVALID_TENANT_ID_MDMS_KEY = "INVALID TENANTID";

	public static final String INVALID_TENANT_ID_MDMS_MSG = "No data found for this tenentID";
	
	
	
}
