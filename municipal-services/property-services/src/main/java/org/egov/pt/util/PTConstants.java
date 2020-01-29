package org.egov.pt.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class PTConstants {

    private PTConstants() {}


    public static final String PT_TYPE_VACANT = "VACANT";
    
    public static final String PT_TYPE_SHAREDPROPERTY = "SHAREDPROPERTY";
    
    public static final String JSONPATH_CODES = "$.MdmsRes.PropertyTax";

    public static final String MDMS_PT_MOD_NAME = "PropertyTax";

    public static final String MDMS_PT_PROPERTYTYPE = "PropertyType";
    
    public static final String MDMS_PT_USAGECATEGORY = "UsageCategory";

    public static final String MDMS_PT_PROPERTYSUBTYPE = "PropertySubType";

    public static final String MDMS_PT_OCCUPANCYTYPE = "OccupancyType";

    public static final String MDMS_PT_CONSTRUCTIONTYPE = "ConstructionType";

    public static final String MDMS_PT_CONSTRUCTIONSUBTYPE = "ConstructionSubType";

    public static final String MDMS_PT_OWNERSHIPCATEGORY = "OwnerShipCategory";

    public static final String MDMS_PT_SUBOWNERSHIP = "SubOwnerShipCategory";

    public static final String MDMS_PT_USAGEMAJOR = "UsageCategoryMajor";

    public static final String MDMS_PT_USAGEMINOR = "UsageCategoryMinor";

    public static final String MDMS_PT_USAGEDETAIL = "UsageCategoryDetail";

    public static final String MDMS_PT_USAGESUBMINOR = "UsageCategorySubMinor";

    public static final String MDMS_PT_OWNERTYPE = "OwnerType";

    public static final String MDMS_PT_EGF_MASTER = "egf-master";

    public static final String MDMS_PT_FINANCIALYEAR = "FinancialYear";

    public static final String JSONPATH_FINANCIALYEAR = "$.MdmsRes.egf-master";

    public static final String BOUNDARY_HEIRARCHY_CODE = "REVENUE";

    public static final String MODULE = "pt-services-v2";

    public static final String NOTIFICATION_LOCALE = "en_IN";

    public static final String NOTIFICATION_CREATE_CODE = "pt.property.en.create";

    public static final String NOTIFICATION_UPDATE_CODE = "pt.property.en.update";

    public static final String NOTIFICATION_EMPLOYEE_UPDATE_CODE = "pt.property.en.update.employee";

    public static final String NOTIFICATION_PAYMENT_ONLINE = "pt.payment.online";

    public static final String NOTIFICATION_PAYMENT_OFFLINE = "pt.payment.offline";

    public static final String NOTIFICATION_PAYMENT_FAIL = "pt.payment.fail";

    public static final String NOTIFICATION_OLDPROPERTYID_ABSENT = "pt.oldpropertyid.absent";
    
    public static final String ACTION_PAY = "PAY";
    
	public static final String  USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
	public static final String  USREVENTS_EVENT_NAME = "Property Tax";
	public static final String  USREVENTS_EVENT_POSTEDBY = "SYSTEM-PT";



	// Variable names for diff


    public static final String VARIABLE_ACTION = "action";

    public static final String VARIABLE_WFDOCUMENTS = "wfDocuments";

    public static final String VARIABLE_ACTIVE = "active";

    public static final String VARIABLE_USERACTIVE = "status";

    public static final String VARIABLE_CREATEDBY = "createdBy";

    public static final String VARIABLE_LASTMODIFIEDBY = "lastModifiedBy";

    public static final String VARIABLE_CREATEDTIME = "createdTime";

    public static final String VARIABLE_LASTMODIFIEDTIME = "lastModifiedTime";

    public static final String VARIABLE_OWNER = "ownerInfo";


    public static final List<String> FIELDS_TO_IGNORE = Collections.unmodifiableList(Arrays.asList(VARIABLE_ACTION,VARIABLE_WFDOCUMENTS,
            VARIABLE_CREATEDBY,VARIABLE_LASTMODIFIEDBY,VARIABLE_CREATEDTIME,VARIABLE_LASTMODIFIEDTIME));

    public static final List<String> FIELDS_FOR_OWNER_MUTATION = Collections.unmodifiableList(Arrays.asList("name","gender","fatherOrHusbandName"));

    public static final List<String> FIELDS_FOR_PROPERTY_MUTATION = Collections.unmodifiableList(Arrays.asList("propertyType","usageCategory","ownershipCategory","noOfFloors","landArea"));

    public static final String WORKFLOW_START_ACTION = "INITIATED";

    public static final String ASMT_WORKFLOW_CODE = "ASMT";

    public static final String ASMT_MODULENAME = "PT";

}
