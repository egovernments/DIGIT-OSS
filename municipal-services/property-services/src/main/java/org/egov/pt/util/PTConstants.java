package org.egov.pt.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class PTConstants {

    private PTConstants() {}


    public static final String PT_TYPE_VACANT = "VACANT";
    
    public static final String PT_TYPE_SHAREDPROPERTY = "SHAREDPROPERTY";
    
    public static final String PT_TYPE_BUILTUP = "BUILTUP";
    
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

    public static final String NOTIFICATION_LOCALE = "en_IN";

    public static final String NOTIFICATION_CREATE_CODE = "pt.property.en.create";

    public static final String NOTIFICATION_UPDATE_CODE = "pt.property.en.update";

    public static final String NOTIFICATION_EMPLOYEE_UPDATE_CODE = "pt.property.en.update.employee";

    public static final String NOTIFICATION_PAYMENT_ONLINE = "PT_NOTIFICATION_PAYMENT_ONLINE";

    public static final String NOTIFICATION_PAYMENT_OFFLINE = "PT_NOTIFICATION_PAYMENT_OFFILE";

    public static final String NOTIFICATION_PAYMENT_FAIL = "PT_NOTIFICATION_PAYMENT_FAIL";

    public static final String NOTIFICATION_PAYMENT_PARTIAL_OFFLINE = "PT_NOTIFICATION_PAYMENT_PARTIAL_OFFLINE";

    public static final String NOTIFICATION_PAYMENT_PARTIAL_ONLINE = "PT_NOTIFICATION_PAYMENT_PARTIAL_ONLINE";

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

    public static final String WORKFLOW_START_ACTION = "INITIATE";

    public static final String ASMT_WORKFLOW_CODE = "ASMT";

    public static final String ASMT_MODULENAME = "PT";

	public static final String CREATE_PROCESS_CONSTANT = "CREATE";
	
	public static final String UPDATE_PROCESS_CONSTANT = "UPDATE";
	
	public static final String MUTATION_PROCESS_CONSTANT = "MUTATION";
	
	public static final String PREVIOUS_PROPERTY_PREVIOUD_UUID = "previousPropertyUuid";
	
	
	/* notificaion constants */
	
	public static final String WF_STATUS_PAID = "PAID";
	
	public static final String WF_STATUS_PAYMENT_PENDING = "PAYMENT_PENDING";
	
	public static final String WF_STATUS_REJECTED = "REJECTED";
	
	public static final String WF_STATUS_CANCELLED = "CANCELLED";
	
	public static final String WF_STATUS_APPROVED = "APPROVED";
	
	public static final String WF_STATUS_OPEN = "OPEN";
	
	public static final String WF_NO_WORKFLOW = "NO_WORKFLOW";

	public static final String NOTIFICATION_MODULENAME = "rainmaker-pt";
	
	/* PT notif loc codes */
	
	public static final String WF_MT_STATUS_OPEN_CODE = "PT_NOTIF_WF_MT_OPEN";
	
	public static final String WF_MT_STATUS_CHANGE_CODE =  "PT_NOTIF_WF_MT_STATE_CHANGE";
	
	public static final String WF_MT_STATUS_PAYMENT_PENDING_CODE = "PT_NOTIF_WF_MT_PAYMENT_PENDING";
	
	public static final String WF_MT_STATUS_PAID_CODE =   "PT_NOTIF_WF_MT_PAID";
	
	public static final String WF_MT_STATUS_APPROVED_CODE =  "PT_NOTIF_WF_MT_APPROVED";
	
	public static final String MT_NO_WORKFLOW = "PT_NOTIF_WF_MT_NONE";
	
	/* update */
	public static final String WF_UPDATE_STATUS_OPEN_CODE  = "PT_NOTIF_WF_OPEN";
	
	public static final String WF_UPDATE_STATUS_CHANGE_CODE = "PT_NOTIF_WF_STATUS_CHANGE";
	
	public static final String WF_UPDATE_STATUS_APPROVED_CODE =   "PT_NOTIF_WF_APPROVED";
	
	public static final String UPDATE_NO_WORKFLOW = "PT_NOTIF_WF_UPDATE_NONE";
	
	public static final String CREATE_NOTIF_CODE = "PT_NOTIF_CREATE";
	
	
	/* ASSESSMENT CONSTANTS */
	
    public static final String WORKFLOW_SENDBACK_CITIZEN = "SENDBACKTOCITIZEN";

    public static final String ASSESSMENT_BUSINESSSERVICE = "ASMT";

	public static final String BILL_AMOUNT_PATH = "/Bill/0/totalAmount";

	public static final String BILL_NODEMAND_ERROR_CODE = "EG_BS_BILL_NO_DEMANDS_FOUND";



	
	
	//  NOTIFICATION PLACEHOLDER

    public static final String NOTIFICATION_OWNERNAME = "{OWNER_NAME}";

    public static final String NOTIFICATION_STATUS = "{STATUS}";
    
    public static final String NOTIFICATION_UPDATE_CREATE_REPLACE = "{update/create}";
    
    public static final String NOTIFICATION_UPDATED_CREATED_REPLACE = "{updated/created}";
    
    public static final String CREATE_STRING = "Create";
    
    public static final String UPDATE_STRING = "Update";
    
    public static final String CREATED_STRING = "Created";
    
    public static final String UPDATED_STRING = "Updated";

    public static final String PT_BUSINESSSERVICE = "PT";


    public static final String NOTIFICATION_PROPERTYID = "{PROPERTYID}";
    
    // PROPERTY & MUTATION
    public static final String NOTIFICATION_APPID =  "{APPID}";
    
    public static final String NOTIFICATION_CONSUMERCODE =  "{CONSUMERCODE}";
    
    public static final String NOTIFICATION_TENANTID =  "{TENANTID}";
    
    public static final String NOTIFICATION_PAY_LINK =  "{PAYLINK}";
    
    public static final String NOTIFICATION_PROPERTY_LINK =  "{PTURL}";
    
    public static final String NOTIFICATION_MUTATION_LINK =  "{MTURL}";
    
    public static final String NOTIFICATION_AMOUNT    =  "{AMOUNT}";
    
    // ASSESSMENT
    
    public static final String NOTIFICATION_ASSESSMENTNUMBER = "{ASSESSMENTNUMBER}";

    public static final String NOTIFICATION_FINANCIALYEAR = "{FINANCIALYEAR}";

    public static final String NOTIFICATION_ASSESSMENT_CREATE = "ASMT_CREATE";

    public static final String NOTIFICATION_ASSESSMENT_UPDATE = "ASMT_UPDATE";

    public static final String LOCALIZATION_ASMT_PREFIX = "ASMT_";

    public static final String NOTIFICATION_ASMT_PREFIX = "ASMT_MSG_";



    public static final String ONLINE_PAYMENT_MODE = "ONLINE";


}

