package org.egov.tl.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class TLConstants {


    public static  final String businessService_TL = "TL";

    public static  final String businessService_BPA = "BPAREG";

    public static final String PROPERTY_JSONPATH = "$.Properties[0].propertyId";

    public static final String MODULE = "rainmaker-tl";

    public static final String NOTIFICATION_LOCALE = "en_IN";

    public static final String NOTIFICATION_INITIATED = "tl.en.counter.initiate";

    public static final String NOTIFICATION_APPLIED = "tl.en.counter.submit";

    public static final String NOTIFICATION_FIELD_INSPECTION = "tl.en.field.inspection";

    public static final String NOTIFICATION_PAYMENT_OWNER = "tl.en.counter.payment.successful.owner";

    public static final String NOTIFICATION_PAYMENT_PAYER = "tl.en.counter.payment.successful.payer";

    public static final String NOTIFICATION_PAID = "tl.en.counter.pending.approval";

    public static final String NOTIFICATION_APPROVED = "tl.en.counter.approved";

    public static final String NOTIFICATION_REJECTED = "tl.en.counter.rejected";

    public static final String NOTIFICATION_CANCELLED = "tl.en.counter.cancelled";

    public static final String NOTIFICATION_FIELD_CHANGED = "tl.en.edit.field.change";

    public static final String NOTIFICATION_OBJECT_ADDED = "tl.en.edit.object.added";

    public static final String NOTIFICATION_OBJECT_REMOVED = "tl.en.edit.object.removed";

    public static final String NOTIFICATION_OBJECT_MODIFIED = "tl.en.edit.object.modified";

    public static final String NOTIFICATION_SENDBACK_CITIZEN= "tl.en.sendback.citizen";

    public static final String NOTIFICATION_FORWARD_CITIZEN = "tl.en.forward.citizen";


    public static final String DEFAULT_OBJECT_MODIFIED_MSG = "Dear <1>,Your Trade License with application number <APPLICATION_NUMBER> was modified.";


    // MDMS

    public static final String TRADE_LICENSE_MODULE = "TradeLicense";

    public static final String TRADE_LICENSE_MODULE_CODE = "TL";

    public static final String COMMON_MASTERS_MODULE = "common-masters";


    // mdms master names

    public static final String OWNERSHIP_CATEGORY = "OwnerShipCategory";

    public static final String TRADE_TYPE = "TradeType";

    public static final String ACCESSORIES_CATEGORY = "AccessoriesCategory";

    public static final String STRUCTURE_TYPE = "StructureType";



    // mdms path codes

    public static final String TL_JSONPATH_CODE = "$.MdmsRes.TradeLicense";

    public static final String COMMON_MASTER_JSONPATH_CODE = "$.MdmsRes.common-masters";

    public static final String TRADETYPE_JSONPATH_CODE = "$.MdmsRes.TradeLicense.TradeType.*.code";

    public static final String TRADETYPE_JSONPATH_UOM = "$.MdmsRes.TradeLicense.TradeType.*.uom";

    public static final String ACCESSORY_JSONPATH_CODE = "$.MdmsRes.TradeLicense.AccessoriesCategory.*.code";

    public static final String ACCESSORY_JSONPATH_UOM = "$.MdmsRes.TradeLicense.AccessoriesCategory.*.uom";


    //FINANCIAL YEAR

    public static final String MDMS_EGF_MASTER = "egf-master";

    public static final String MDMS_FINANCIALYEAR  = "FinancialYear";

    public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear[?(@.code==\"{}\")]";

    public static final String MDMS_STARTDATE  = "startingDate";

    public static final String MDMS_ENDDATE  = "endingDate";

    // error constants

    public static final String INVALID_TENANT_ID_MDMS_KEY = "INVALID TENANTID";

    public static final String INVALID_TENANT_ID_MDMS_MSG = "No data found for this tenentID";



    // TL actions

    public static final String ACTION_INITIATE = "INITIATE";

    public static final String ACTION_APPLY  = "APPLY";

    public static final String ACTION_APPROVE  = "APPROVE";

    public static final String ACTION_REJECT  = "REJECT";

    public static final String TRIGGER_NOWORKFLOW  = "NOWORKFLOW";

    public static final String ACTION_CANCEL  = "CANCEL";

    public static final String ACTION_PAY  = "PAY";

    public static final String ACTION_ADHOC  = "ADHOC";


    public static final String STATUS_INITIATED = "INITIATED";

    public static final String STATUS_APPLIED  = "APPLIED";

    public static final String STATUS_APPROVED  = "APPROVED";

    public static final String STATUS_REJECTED  = "REJECTED";

    public static final String STATUS_FIELDINSPECTION  = "FIELDINSPECTION";

    public static final String STATUS_CANCELLED  = "CANCELLED";

    public static final String STATUS_PAID  = "PAID";

    public static final String BILL_AMOUNT_JSONPATH = "$.billResponse.Bill[0].totalAmount";


    // ACTION_STATUS combinations for notification

    public static final String ACTION_STATUS_INITIATED = "INITIATE_INITIATED";

    public static final String ACTION_STATUS_APPLIED  = "APPLY_APPLIED";

    public static final String ACTION_STATUS_APPROVED  = "APPROVE_PENDINGPAYMENT";

    public static final String ACTION_STATUS_REJECTED  = "REJECT_REJECTED";

    public static final String ACTION_STATUS_FIELDINSPECTION  = "FORWARD_FIELDINSPECTION";

    public static final String ACTION_CANCEL_CANCELLED  = "CANCEL_CANCELLED";

    public static final String ACTION_SENDBACKTOCITIZEN_FIELDINSPECTION  = "SENDBACKTOCITIZEN_CITIZENACTIONREQUIRED";

    public static final String ACTION_FORWARD_CITIZENACTIONREQUIRED  = "FORWARDTOEMPLOYEE_FIELDINSPECTION";


    public static final String ACTION_STATUS_PAID  = "PAID";


    public static final String VARIABLE_ACTION = "action";

    public static final String VARIABLE_WFDOCUMENTS = "wfDocuments";

    public static final String VARIABLE_ACTIVE = "active";

    public static final String VARIABLE_USERACTIVE = "userActive";

    public static final String VARIABLE_CREATEDBY = "createdBy";

    public static final String VARIABLE_LASTMODIFIEDBY = "lastModifiedBy";

    public static final String VARIABLE_CREATEDTIME = "createdTime";

    public static final String VARIABLE_LASTMODIFIEDTIME = "lastModifiedTime";
    
	public static final String  USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
	public static final String  USREVENTS_EVENT_NAME = "Trade License";
	public static final String  USREVENTS_EVENT_POSTEDBY = "SYSTEM-TL";

	public static final String CITIZEN_SENDBACK_ACTION = "SENDBACKTOCITIZEN";


    public static final List<String> FIELDS_TO_IGNORE = Collections.unmodifiableList(Arrays.asList(VARIABLE_ACTION,VARIABLE_WFDOCUMENTS,
            VARIABLE_CREATEDBY,VARIABLE_LASTMODIFIEDBY,VARIABLE_CREATEDTIME,VARIABLE_LASTMODIFIEDTIME));


    public TLConstants() {}




}
