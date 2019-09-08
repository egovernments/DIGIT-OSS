package org.egov.boundary.util;

public class BoundaryConstants {

	public static final String INVALID_BOUNDARY_REQUEST_MESSAGE = "BoundaryRequest is invalid";
	public static final String INVALID_BOUNDARYRequest_REQUEST_MESSAGE = "BoundaryTypeRequest is invalid";
	public static final String INVALID_HIERARCHYtype_REQUEST_MESSAGE = "HierarchyType Request is invalid";

	public static final String BOUNDARY_NUMBER__MANDATORY_CODE = "boundary.0001";
	public static final String BOUNDARY_NUMBER_MANADATORY_FIELD_NAME = "boundaryNum";
	public static final String BOUNDARY_NUMBER_MANADATORY_ERROR_MESSAGE = "Boundary Number is required";

	public static final String BOUNDARY_NUMBER_TYPE__UNIQUE_CODE = "boundary.0002";
	public static final String BOUNDARY_NUMBER__TYPE_UNIQUE_FIELD_NAME = "boundaryNum And boundaryTypeId";
	public static final String BOUNDARY_NUMBER__TYPE_UNIQUE_ERROR_MESSAGE = "Combination of boundaryNum And boundaryTypeId Already Exist. ";

	public static final String TENANTID_MANDATORY_CODE = "boundary.0003";
	public static final String TENANTID_MANADATORY_FIELD_NAME = "tenantId";
	public static final String TENANTID_MANADATORY_ERROR_MESSAGE = "Tenant Id is required";

	public static final String BOUNDARY_NAME_MANDATORY_CODE = "boundary.0004";
	public static final String BOUNDARY_NAME_MANADATORY_FIELD_NAME = "name";
	public static final String BOUNDARY_NAME_MANADATORY_ERROR_MESSAGE = "Name is required";

	public static final String BOUNDARY_TYPE_MANDATORY_CODE = "boundary.0005";
	public static final String BOUNDARY_TYPE_MANADATORY_FIELD_NAME = "boundaryType";
	public static final String BOUNDARY_TYPE_MANADATORY_ERROR_MESSAGE = "boundaryType is Required";

	public static final String BOUNDARY_TYPE_CODE_INVALID_CODE = "boundary.0006";
	public static final String BOUNDARY_TYPE_CODE_INVALID_FIELD_NAME = "code";
	public static final String BOUNDARY_TYPE_CODE_INVALID_ERROR_MESSAGE = "BoundaryType Code Does Not Exist.";

	public static final String BOUNDARY_TYPE_CODE_MANDATORY_CODE = "boundary.0007";
	public static final String BOUNDARY_TYPE_CODE_MANDATORY_FIELD_NAME = "code";
	public static final String BOUNDARY_TYPE_CODE_MANDATORY_ERROR_MESSAGE = "BoundaryTypeCode is Required.";

	public static final String BOUNDARY_TYPE_INVALID_CODE = "boundary.0008";
	public static final String BOUNDARY_TYPE_INVALID_FIELD_NAME = "boundaryType";
	public static final String BOUNDARY_TYPE_INVALID_ERROR_MESSAGE = "boundaryType Does Not Exist.";

	public static final String BOUNDARY_PARENTYPE_CODE_INVALID_CODE = "boundary.0009";
	public static final String BOUNDARY_PARENTYPE_CODE_INVALID_FIELD_NAME = "code";
	public static final String BOUNDARY_PARENTYPE_CODE_INVALID_ERROR_MESSAGE = "Boundary ParentCode Does Not Exist.";

	public static final String HIERARCHYTYPE_NAME_MANDATORY_CODE = "boundary.0010";
	public static final String HIERARCHYTYPE_NAME_MANADATORY_FIELD_NAME = "name";
	public static final String HIERARCHYTYPE_NAME_MANADATORY_ERROR_MESSAGE = "HierarchyType Name is Required";

	public static final String HIERARCHYTYPE_CODE_MANDATORY_CODE = "boundary.0011";
	public static final String HIERARCHYTYPE_CODE_MANADATORY_FIELD_NAME = "code";
	public static final String HIERARCHYTYPE_CODE_MANADATORY_ERROR_MESSAGE = "HierarchyType Code is Required";

	public static final String HIERARCHYTYPE_NAME_TENANT_UNIQUE_CODE = "boundary.0012";
	public static final String HIERARCHYTYPE_NAME_TENANT_UNIQUE_FIELD_NAME = "name and tenant";
	public static final String HIERARCHYTYPE_NAME_TENANT_UNIQUE_ERROR_MESSAGE = "Combination Of Name and tenantId Already Exist.";

	public static final String BOUNDARYTYPE_NAME_MANDATORY_CODE = "boundary.0013";
	public static final String BOUNDARYTYPE_NAME_MANADATORY_FIELD_NAME = "name";
	public static final String BOUNDARYTYPE_NAME_MANADATORY_ERROR_MESSAGE = "BoundaryType Name is Required";

	public static final String BOUNDARYTYPE_HIERARCHY_MANDATORY_CODE = "boundary.0014";
	public static final String BOUNDARYTYPE_HIERARCHY_MANADATORY_FIELD_NAME = "hierarchy";
	public static final String BOUNDARYTYPE_HIERARCHY_MANADATORY_ERROR_MESSAGE = "BoundaryType Hierarchy is Required";

	public static final String BOUNDARYTYPE_HIERARCHYTYPE_MANDATORY_CODE = "boundary.0015";
	public static final String BOUNDARYTYPE_HIERARCHYTYPE_MANADATORY_FIELD_NAME = "hierarchyType";
	public static final String BOUNDARYTYPE_HIERARCHYTYPE_MANADATORY_ERROR_MESSAGE = "BoundaryType HierarchyType is Required";

	public static final String BOUNDARYTYPE_HIERARCHYTYPECODE_MANDATORY_CODE = "boundary.0016";
	public static final String BOUNDARYTYPE_HIERARCHYTYPECODE_MANADATORY_FIELD_NAME = "code";
	public static final String BOUNDARYTYPE_HIERARCHYTYPECODE_MANADATORY_ERROR_MESSAGE = "BoundaryType HierarchyTypeCode is Required";

	public static final String BOUNDARYTYPE_HIERARCHYTYPECODE_INVALID_CODE = "boundary.0017";
	public static final String BOUNDARYTYPE_HIERARCHYTYPECODE_INVALID_FIELD_NAME = "code";
	public static final String BOUNDARYTYPE_HIERARCHYTYPECODE_INVALID_ERROR_MESSAGE = "BoundaryType HierarchyTypeCode Does Not Exist.";

	public static final String BOUNDARYTYPE_PARENT_INVALID_CODE = "boundary.0018";
	public static final String BOUNDARYTYPE_PARENT_INVALID_FIELD_NAME = "id";
	public static final String BOUNDARYTYPE_PARENT_INVALID_ERROR_MESSAGE = "BoundaryType ParentCode Does Not Exist.";

	public static final String CROSSHIERARCHY_PARENT_MANDATORY_CODE = "boundary.0019";
	public static final String CROSSHIERARCHY_PARENT_MANADATORY_FIELD_NAME = "parent";
	public static final String CROSSHIERARCHY_PARENT_MANADATORY_ERROR_MESSAGE = "CrossHierarchy Parent is Required.";

	public static final String CROSSHIERARCHY_PARENTID_MANDATORY_CODE = "boundary.0020";
	public static final String CROSSHIERARCHY_PARENTID_MANADATORY_FIELD_NAME = "id";
	public static final String CROSSHIERARCHY_PARENTID_MANADATORY_ERROR_MESSAGE = "CrossHierarchy ParentId is Required.";

	public static final String CROSSHIERARCHY_PARENTID_INVALID_CODE = "boundary.0021";
	public static final String CROSSHIERARCHY_PARENTID_INVALID_FIELD_NAME = "id";
	public static final String CROSSHIERARCHY_PARENTID_INVALID_ERROR_MESSAGE = "CrossHierarchy ParentId Does Not Exist.";

	public static final String CROSSHIERARCHY_CHILD_MANDATORY_CODE = "boundary.0022";
	public static final String CROSSHIERARCHY_CHILD_MANADATORY_FIELD_NAME = "child";
	public static final String CROSSHIERARCHY_CHILD_MANADATORY_ERROR_MESSAGE = "CrossHierarchy child is Required.";

	public static final String CROSSHIERARCHY_CHILDID_MANDATORY_CODE = "boundary.0023";
	public static final String CROSSHIERARCHY_CHILDID_MANADATORY_FIELD_NAME = "id";
	public static final String CROSSHIERARCHY_CHILDID_MANADATORY_ERROR_MESSAGE = "CrossHierarchy ChildId is Required.";

	public static final String CROSSHIERARCHY_CHILDID_INVALID_CODE = "boundary.0024";
	public static final String CROSSHIERARCHY_CHILDID_INVALID_FIELD_NAME = "id";
	public static final String CROSSHIERARCHY_CHILDID_INVALID_ERROR_MESSAGE = "CrossHierarchy ChildId Does Not Exist.";

	public static final String CROSSHIERARCHY_PARENTTYPEID_INVALID_CODE = "boundary.0025";
	public static final String CROSSHIERARCHY_PARENTTYPEID_INVALID_FIELD_NAME = "id";
	public static final String CROSSHIERARCHY_PARENTTYPEID_INVALID_ERROR_MESSAGE = "CrossHierarchy ParentTypeId Does Not Exist.";

	public static final String CROSSHIERARCHY_CHILDTYPEID_INVALID_CODE = "boundary.0026";
	public static final String CROSSHIERARCHY_CHILDTYPEID_INVALID_FIELD_NAME = "id";
	public static final String CROSSHIERARCHY_CHILDTYPEID_INVALID_ERROR_MESSAGE = "CrossHierarchy ChildTypeId Does Not Exist.";
	
	public static final String HIERARCHY_TYPE_INVALID_CODE = "boundary.0027";
	public static final String HIERARCHY_TYPE_INVALID_FIELD_NAME = "hierarchyType";
	public static final String HIERARCHY_TYPE_INVALID_ERROR_MESSAGE = "hierarchyType Does Not Exist.";
	
	public static final String BOUNDARY_CODE_MANDATORY_CODE = "boundary.0028";
	public static final String BOUNDARY_CODE_MANADATORY_FIELD_NAME = "code";
	public static final String BOUNDARY_CODE_MANADATORY_ERROR_MESSAGE = "Code is required";
	
	public static final String HIERARCHYTYPE_CODE_TENANT_UNIQUE_CODE = "boundary.0029";
	public static final String HIERARCHYTYPE_CODE_TENANT_UNIQUE_FIELD_NAME = "code and tenant";
	public static final String HIERARCHYTYPE_CODE_TENANT_UNIQUE_ERROR_MESSAGE = "Combination Of code and tenantId Already Exist.";
	
	public static final String BOUNDARY_CODE_TENANT_UNIQUE_CODE = "boundary.0030";
	public static final String BOUNDARY_CODE_TENANT_UNIQUE_FIELD_NAME = "code and tenant";
	public static final String BOUNDARY_CODE_TENANT_UNIQUE_ERROR_MESSAGE = "Combination Of code and tenantId Already Exist.";
	
	public static final String BOUNDARYTYPE_CODE_TENANT_UNIQUE_CODE = "boundary.0030";
	public static final String BOUNDARYTYPE_CODE_TENANT_UNIQUE_FIELD_NAME = "code and tenant";
	public static final String BOUNDARYTYPE_CODE_TENANT_UNIQUE_ERROR_MESSAGE = "Combination Of code and tenantId Already Exist.";
	
	public static final String BOUNDARYTYPE_CODE_MANDATORY_CODE = "boundary.0028";
	public static final String BOUNDARYTYPE_CODE_MANADATORY_FIELD_NAME = "code";
	public static final String BOUNDARYTYPE_CODE_MANADATORY_ERROR_MESSAGE = "Boundary Type Code is required";
	
	
	public static final String BOUNDARY_CREATE_EXCEPTION_MSG = "Boundary couldn't be created";
	public static final String BOUNDARY_CREATE_EXCEPTION_DESC = "creation of Boundary failed!";
	
	public static final String BOUNDARY_UPDATE_EXCEPTION_MSG = "Boundary couldn't be update";
	public static final String BOUNDARY_UPDATE_EXCEPTION_DESC = "update of Boundary failed!";
	
	public static final String BOUNDARYTYPE_CREATE_EXCEPTION_MSG = "BoundaryType couldn't be created";
	public static final String BOUNDARYTYPE_CREATE_EXCEPTION_DESC = "creation of BoundaryType failed!";
	
	public static final String BOUNDARYTYPE_UPDATE_EXCEPTION_MSG = "BoundaryType couldn't be created";
	public static final String BOUNDARYTYPE_UPDATE_EXCEPTION_DESC = "creation of BoundaryType failed!";
	
	public static final String HIERARCHYTYPE_CREATE_EXCEPTION_MSG = "HierarchyType couldn't be created";
	public static final String HIERARCHYTYPE_CREATE_EXCEPTION_DESC = "creation of HierarchyType failed!";
	
	public static final String HIERARCHYTYPE_UPDATE_EXCEPTION_MSG = "HierarchyType couldn't be created";
	public static final String HIERARCHYTYPE_UPDATE_EXCEPTION_DESC = "creation of HierarchyTypee failed!";
	
	public static final String CROSSHIERARCHY_CREATE_EXCEPTION_MSG = "CrossHierarchy couldn't be created";
	public static final String CROSSHIERARCHY_CREATE_EXCEPTION_DESC = "creation of CrossHierarchy failed!";
	
	public static final String CROSSHIERARCHY_UPDATE_EXCEPTION_MSG = "CrossHierarchy couldn't be created";
	public static final String CROSSHIERARCHY_UPDATE_EXCEPTION_DESC = "creation of CrossHierarchy failed!";

    public static final String GEO_MODULE_NAME = "LOCATION-GEO";
    public static final String GEO_MASTER_NAME = "Geography";

    public static final String GEOGRAPHY_SEARCH_MDMS_SERVICE_UNAVAILABLE_MSG = "GEOGRAPHY_SEARCH_MDMS_SERVICE_UNAVAILABLE";
    public static final String SEARCH_MDMS_SERVICE_UNAVAILABLE_DESC =
            "MDMS Service is unavailable";

    public static final String TENANT_SEARCH_STATE_MISMATCH = "TENANT_SEARCH_STATE_MISMATCH";
    public static final String TENANT_SEARCH_STATE_MISMATCH_DESC = "Attempting to raise a complaint from a different " +
            "state module";

    public static final String TENANT_SEARCH_TENANT_MAPPING_NOT_FOUND = "TENANT_SEARCH_TENANT_MAPPING_NOT_FOUND";
    public static final String TENANT_SEARCH_TENANT_MAPPING_NOT_FOUND_DESC = "Unable to find mapping in MDMS " +
            "for provided lat / lng ";

    public static final String TENANT_SEARCH_GMAPS_NO_RESP = "TENANT_SEARCH_GMAPS_NO_RESP";
    public static final String TENANT_SEARCH_GMAPS_NO_RESP_DESC = "GMAPS could not resolve provided lat / lng";

    public static final String GMAPS_API_KEY = System.getenv("GMAPS_API_KEY");

    public static final String TENANT_MODULE_NAME = "tenant";
    public static final String TENANT_MASTER_NAME = "tenants";

    public static final String TENANT_SEARCH_MDMS_SERVICE_UNAVAILABLE_MSG = "TENANT_SEARCH_MDMS_SERVICE_UNAVAILABLE";



}
