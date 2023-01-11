package org.egov.tl.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class TLConstants {


    public static  final String businessService_TL = "TL";

    public static  final String businessService_DIRECT_RENEWAL = "DIRECTRENEWAL";
    
    public static  final String businessService_EDIT_RENEWAL = "EDITRENEWAL";

    public static  final String businessService_BPA = "BPAREG";

    public static final String PROPERTY_JSONPATH = "$.Properties[0].propertyId";

    public static final String MODULE = "rainmaker-tl";

    public static final String NOTIFICATION_LOCALE = "en_IN";

    public static final String RENEWAL_NOTIFICATION_INITIATED = "tl.renew.en.counter.initiate";

    public static final String RENEWAL_NOTIFICATION_INITIATED_EMAIL = "tl.renew.en.counter.initiate.email";

    public static final String RENEWAL_NOTIFICATION_APPLIED = "tl.renew.en.counter.submit";

    public static final String RENEWAL_NOTIFICATION_APPLIED_EMAIL  = "tl.renew.en.counter.submit.email";

    public static final String RENEWAL_NOTIFICATION_FIELD_INSPECTION = "tl.renew.en.field.inspection";

    public static final String RENEWAL_NOTIFICATION_FIELD_INSPECTION_EMAIL = "tl.renew.en.field.inspection.email";

    public static final String RENEWAL_NOTIFICATION_PENDINGAPPROVAL = "tl.renew.en.pending.approval";

    public static final String RENEWAL_NOTIFICATION_PENDINGAPPROVAL_EMAIL = "tl.renew.en.pending.approval.email";

    public static final String RENEWAL_NOTIFICATION_REJECTED = "tl.renew.en.counter.rejected";

    public static final String RENEWAL_NOTIFICATION_REJECTED_EMAIL = "tl.renew.en.counter.rejected.email";

    public static final String RENEWAL_NOTIFICATION_APPROVED = "tl.renew.en.counter.approved";

    public static final String RENEWAL_NOTIFICATION_APPROVED_EMAIL = "tl.renew.en.counter.approved.email";

    public static final String NOTIFICATION_INITIATED = "tl.en.counter.initiate";

    public static final String NOTIFICATION_INITIATED_EMAIL = "tl.en.counter.initiate.email";

    public static final String NOTIFICATION_APPLIED = "tl.en.counter.submit";

    public static final String NOTIFICATION_APPLIED_EMAIL = "tl.en.counter.submit.email";

    public static final String NOTIFICATION_FIELD_INSPECTION = "tl.en.field.inspection";

    public static final String NOTIFICATION_PENDING_APPROVAL = "tl.en.pending.approval";

    public static final String NOTIFICATION_PENDING_APPROVAL_EMAIL = "tl.en.pending.approval.email";

    public static final String NOTIFICATION_FIELD_INSPECTION_EMAIL = "tl.en.field.inspection.email";

    public static final String NOTIFICATION_PAYMENT_OWNER = "tl.en.counter.payment.successful.owner";

    public static final String NOTIFICATION_PAYMENT_OWNER_EMAIL = "tl.en.counter.payment.successful.owner.email";

    public static final String NOTIFICATION_RENEWAL_PAYMENT_OWNER = "tl.en.counter.renewal.payment.successful.owner";

    public static final String NOTIFICATION_RENEWAL_PAYMENT_OWNER_EMAIL = "tl.en.counter.renewal.payment.successful.owner.email";

    public static final String NOTIFICATION_PAYMENT_PAYER = "tl.en.counter.payment.successful.payer";

    public static final String NOTIFICATION_PAYMENT_PAYER_EMAIL = "tl.en.counter.payment.successful.payer.email";

    public static final String NOTIFICATION_RENEWAL_PAYMENT_PAYER = "tl.en.counter.renewal.payment.successful.payer";

    public static final String NOTIFICATION_RENEWAL_PAYMENT_PAYER_EMAIL = "tl.en.counter.renewal.payment.successful.payer.email";

    public static final String NOTIFICATION_PAID = "tl.en.counter.pending.approval";

    public static final String NOTIFICATION_PAID_EMAIL = "tl.en.counter.pending.approval.email";

    public static final String NOTIFICATION_APPROVED = "tl.en.counter.approved";

    public static final String NOTIFICATION_APPROVED_EMAIL = "tl.en.counter.approved.email";

    public static final String NOTIFICATION_REJECTED = "tl.en.counter.rejected";

    public static final String NOTIFICATION_REJECTED_EMAIL = "tl.en.counter.rejected.email";

    public static final String NOTIFICATION_CANCELLED = "tl.en.counter.cancelled";

    public static final String NOTIFICATION_EXPIRED = "tl.en.counter.expire";

    public static final String NOTIFICATION_EXPIRED_EMAIL = "tl.en.counter.expire.email";

    public static final String NOTIFICATION_MANUAL_EXPIRED = "tl.en.counter.manual.expire";

    public static final String NOTIFICATION_MANUAL_EXPIRED_EMAIL = "tl.en.counter.manual.expire.email";

    public static final String NOTIFICATION_CANCELLED_EMAIL = "tl.en.counter.cancelled.email";

    public static final String NOTIFICATION_FIELD_CHANGED = "tl.en.edit.field.change";

    public static final String NOTIFICATION_FIELD_CHANGED_EMAIL = "tl.en.edit.field.change.email";

    public static final String NOTIFICATION_OBJECT_ADDED = "tl.en.edit.object.added";

    public static final String NOTIFICATION_OBJECT_ADDED_EMAIL = "tl.en.edit.object.added.email";

    public static final String NOTIFICATION_OBJECT_REMOVED = "tl.en.edit.object.removed";

    public static final String NOTIFICATION_OBJECT_REMOVED_EMAIL = "tl.en.edit.object.removed.email";


    public static final String NOTIFICATION_OBJECT_MODIFIED = "tl.en.edit.object.modified";

    public static final String NOTIFICATION_OBJECT_MODIFIED_EMAIL = "tl.en.edit.object.modified.email";

    public static final String NOTIFICATION_OBJECT_RENEW_MODIFIED = "tl.en.edit.object.renew.modified";

    public static final String NOTIFICATION_OBJECT_RENEW_MODIFIED_EMAIL = "tl.en.edit.object.renew.modified.email";

    public static final String NOTIFICATION_SENDBACK_CITIZEN= "tl.en.sendback.citizen";

    public static final String NOTIFICATION_SENDBACK_CITIZEN_EMAIL = "tl.en.sendback.citizen.email";

    public static final String NOTIFICATION_FORWARD_CITIZEN = "tl.en.forward.citizen";

    public static final String NOTIFICATION_FORWARD_CITIZEN_EMAIL = "tl.en.forward.citizen.email";

    public static final String NOTIFICATION_TL_REMINDER = "tl.en.reminder";

    public static final String NOTIFICATION_TL_REMINDER_EMAIL = "tl.en.reminder.email";

    //Property tagged
    public static final String NOTIFICATION_PROPERTY_TAGGED = "tl.en.counter.property.owner.tagged";

    public static final String NOTIFICATION_PROPERTY_TAGGED_EMAIL = "tl.en.counter.property.owner.tagged.email";

    public static final String NOTIFICATION_PROPERTY_CREATED = "tl.en.counter.property.owner.created";

    public static final String NOTIFICATION_PROPERTY_CREATED_EMAIL = "tl.en.counter.property.owner.created.email";

    public static final String PROPERTY_ID = "propertyId";

    public static final String NOTIF_PROPERTY_OWNER_NAME_KEY = "{PROPERTY_OWNER_NAME}";

    public static final List<String> NOTIFICATION_CODES = Collections.unmodifiableList(Arrays.asList(
            NOTIFICATION_INITIATED_EMAIL,  RENEWAL_NOTIFICATION_INITIATED,RENEWAL_NOTIFICATION_INITIATED_EMAIL, RENEWAL_NOTIFICATION_APPLIED, RENEWAL_NOTIFICATION_FIELD_INSPECTION, RENEWAL_NOTIFICATION_PENDINGAPPROVAL,
            RENEWAL_NOTIFICATION_REJECTED,RENEWAL_NOTIFICATION_APPROVED,NOTIFICATION_INITIATED,NOTIFICATION_APPLIED,NOTIFICATION_FIELD_INSPECTION,
            NOTIFICATION_PAYMENT_OWNER,NOTIFICATION_RENEWAL_PAYMENT_OWNER,NOTIFICATION_PAYMENT_PAYER,NOTIFICATION_RENEWAL_PAYMENT_PAYER,
            NOTIFICATION_PAID,NOTIFICATION_APPROVED,NOTIFICATION_REJECTED,NOTIFICATION_CANCELLED,NOTIFICATION_FIELD_CHANGED,NOTIFICATION_OBJECT_ADDED,
            NOTIFICATION_OBJECT_REMOVED,NOTIFICATION_OBJECT_MODIFIED,NOTIFICATION_OBJECT_RENEW_MODIFIED,NOTIFICATION_SENDBACK_CITIZEN,
            NOTIFICATION_FORWARD_CITIZEN,NOTIFICATION_TL_REMINDER,NOTIFICATION_TL_REMINDER_EMAIL,NOTIFICATION_FORWARD_CITIZEN_EMAIL,NOTIFICATION_SENDBACK_CITIZEN_EMAIL,
            NOTIFICATION_OBJECT_RENEW_MODIFIED_EMAIL,NOTIFICATION_OBJECT_MODIFIED_EMAIL,NOTIFICATION_OBJECT_REMOVED_EMAIL,NOTIFICATION_OBJECT_ADDED_EMAIL,NOTIFICATION_FIELD_CHANGED_EMAIL,
            NOTIFICATION_CANCELLED_EMAIL,NOTIFICATION_REJECTED_EMAIL,NOTIFICATION_APPROVED_EMAIL,NOTIFICATION_PAID_EMAIL,NOTIFICATION_RENEWAL_PAYMENT_PAYER_EMAIL,
            NOTIFICATION_RENEWAL_PAYMENT_OWNER_EMAIL,NOTIFICATION_PAYMENT_PAYER_EMAIL,NOTIFICATION_PAYMENT_OWNER_EMAIL,NOTIFICATION_FIELD_INSPECTION_EMAIL,
            NOTIFICATION_APPLIED_EMAIL,RENEWAL_NOTIFICATION_APPROVED_EMAIL,RENEWAL_NOTIFICATION_APPLIED_EMAIL,RENEWAL_NOTIFICATION_FIELD_INSPECTION_EMAIL,
            RENEWAL_NOTIFICATION_PENDINGAPPROVAL_EMAIL,RENEWAL_NOTIFICATION_REJECTED_EMAIL,NOTIFICATION_PENDING_APPROVAL,NOTIFICATION_PENDING_APPROVAL_EMAIL,
            NOTIFICATION_EXPIRED,NOTIFICATION_EXPIRED_EMAIL,NOTIFICATION_MANUAL_EXPIRED,NOTIFICATION_MANUAL_EXPIRED_EMAIL,NOTIFICATION_PROPERTY_TAGGED,NOTIFICATION_PROPERTY_TAGGED_EMAIL,NOTIFICATION_PROPERTY_CREATED,NOTIFICATION_PROPERTY_CREATED_EMAIL));



    public static final String DEFAULT_OBJECT_MODIFIED_MSG = "Dear {1},Your Trade License with application number {APPLICATION_NUMBER} was modified.";

    public static final String DEFAULT_OBJECT_RENEWAL_MODIFIED_MSG = "Dear {1},Your Renewal Trade License with application number {APPLICATION_NUMBER} was modified.";


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
    
    public static final String REMINDER_JSONPATH = "$.MdmsRes.TradeLicense.ReminderPeriods";
    
    public static final String REMINDER_PERIODS = "ReminderPeriods";


    //FINANCIAL YEAR

    public static final String MDMS_EGF_MASTER = "egf-master";

    public static final String MDMS_FINANCIALYEAR  = "FinancialYear";

    public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear[?(@.code==\"{}\")]";
    
    public static final String MDMS_CURRENT_FINANCIAL_YEAR = "$.MdmsRes.egf-master.FinancialYear[?(@.module==\"{}\")]";

    public static final String MDMS_TL_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear";

    public static final String MDMS_TL_FINACIALYEAR_START_DATE = "$.MdmsRes.egf-master.FinancialYear[?(@.startingDate==\"{}\")]";

    public static final String MDMS_STARTDATE  = "startingDate";

    public static final String MDMS_ENDDATE  = "endingDate";
    
    public static final String MDMS_FIN_YEAR_RANGE = "finYearRange";
    
    public static final String TENANT_ID = "tenantId";

    public static final String REMINDER_INTERVAL = "reminderInterval";
    
    //TL types

    public static final String APPLICATION_TYPE_RENEWAL = "RENEWAL";

    public static final String APPLICATION_TYPE_NEW = "NEW";
    
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

    public static final String ACTION_EXPIRE  = "EXPIRE";
    
    public static final String ACTION_MANUALLYEXPIRE = "MANUALEXPIRE";

    public static final String STATUS_INITIATED = "INITIATED";

    public static final String STATUS_APPLIED  = "APPLIED";

    public static final String STATUS_APPROVED  = "APPROVED";

    public static final String STATUS_REJECTED  = "REJECTED";

    public static final String STATUS_FIELDINSPECTION  = "FIELDINSPECTION";

    public static final String STATUS_CANCELLED  = "CANCELLED";

    public static final String STATUS_PAID  = "PAID";
    
    public static final String STATUS_EXPIRED="EXPIRED";
    
    public static final String STATUS_MANUALLYEXPIRED = "MANUALEXPIRED";

    public static final String BILL_AMOUNT_JSONPATH = "$.Bill[0].totalAmount";


    // ACTION_STATUS combinations for notification

    public static final String ACTION_STATUS_INITIATED = "INITIATE_INITIATED";

    public static final String ACTION_STATUS_APPLIED  = "APPLY_APPLIED";

    public static final String ACTION_STATUS_APPROVED  = "APPROVE_PENDINGPAYMENT";

    public static final String ACTION_STATUS_RENEWAL_APPROVED  = "APPROVE_PENDINGPAYMENT";

    public static final String ACTION_STATUS_RENEWAL_INITIATE_APPROVED  = "INITIATE_PENDINGPAYMENT";

    public static final String ACTION_STATUS_REJECTED  = "REJECT_REJECTED";

    public static final String ACTION_STATUS_FIELDINSPECTION  = "FORWARD_FIELDINSPECTION";

    public static final String ACTION_STATUS_PENDINGAPPROVAL  = "FORWARD_PENDINGAPPROVAL";

    public static final String ACTION_CANCEL_CANCELLED  = "CANCEL_CANCELLED";

    public static final String ACTION_SENDBACKTOCITIZEN_FIELDINSPECTION  = "SENDBACKTOCITIZEN_CITIZENACTIONREQUIRED";

    public static final String ACTION_FORWARD_CITIZENACTIONREQUIRED  = "FORWARDTOEMPLOYEE_FIELDINSPECTION";

    public static final String ACTION_STATUS_PAID  = "PAID";

    public static final String VARIABLE_ACTION = "action";

    public static final String VARIABLE_STATUS = "status";

    public static final String VARIABLE_ISSUED_DATE = "issuedDate";

    public static final String VARIABLE_WFDOCUMENTS = "wfDocuments";

    public static final String VARIABLE_ACTIVE = "active";

    public static final String VARIABLE_USERACTIVE = "userActive";

    public static final String VARIABLE_CREATEDBY = "createdBy";

    public static final String VARIABLE_LASTMODIFIEDBY = "lastModifiedBy";

    public static final String VARIABLE_CREATEDTIME = "createdTime";

    public static final String VARIABLE_LASTMODIFIEDTIME = "lastModifiedTime";

    public static final String VARIABLE_LASTMODIFIEDDATE = "lastModifiedDate";

    public static final String VARIABLE_COMMENT = "comment";
    
	public static final String  USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
	public static final String  USREVENTS_EVENT_NAME = "Trade License";
	public static final String  USREVENTS_EVENT_POSTEDBY = "SYSTEM-TL";

	public static final String CITIZEN_SENDBACK_ACTION = "SENDBACKTOCITIZEN";
	
	
	public static final String TL_ACTION_INITIATE = "INITIATE";



    public static final List<String> FIELDS_TO_IGNORE = Collections.unmodifiableList(Arrays.asList(VARIABLE_ACTION,VARIABLE_WFDOCUMENTS,
            VARIABLE_CREATEDBY,VARIABLE_LASTMODIFIEDBY,VARIABLE_CREATEDTIME,VARIABLE_LASTMODIFIEDTIME,VARIABLE_STATUS,VARIABLE_LASTMODIFIEDDATE,VARIABLE_ISSUED_DATE,VARIABLE_COMMENT));




    public static final String NOTIF_OWNER_NAME_KEY = "{OWNER_NAME}";

    public static final String NOTIF_TRADE_NAME_KEY = "{TRADE_NAME}";

    public static final String NOTIF_TRADE_LICENSENUMBER_KEY = "{LICENSE_NUMBER}";

    public static final String NOTIF_EXPIRY_DATE_KEY = "{EXPIRY_DATE}";

    public static final String validityPeriodMap = "$.MdmsRes.TradeLicense.TradeType[?(@.code==\"{}\")].validityPeriod";

    public static final String JOB_SMS_REMINDER = "REMINDER";

    public static final String JOB_EXPIRY = "EXPIRY";

    public static final String DEFAULT_WORKFLOW = "NewTL";

    public static final String PAYMENT_LINK_PLACEHOLDER="{PAYMENT_LINK}";

    public static final String CHANNEL_NAME_SMS = "SMS";

    public static final String CHANNEL_NAME_EVENT = "EVENT";

    public static final String CHANNEL_NAME_EMAIL = "EMAIL";

    public static final String MODULENAME = "module";

    public static final String ACTION = "action";

    public static final String CHANNEL_LIST = "channelList";

    public static final String CHANNEL_NAMES = "channelNames";

    public static final String CHANNEL = "Channel";

    public static final String TL_BUSINESSSERVICE = "TL";

    //Expired notification
    public static final String ACTION_STATUS_EXPIRED = "EXPIRE_EXPIRED";

    public static final String ACTION_STATUS_MANUAL_EXPIRED = "MANUALEXPIRE_MANUALEXPIRED";


    //property related
    public static final String SALUTATION_MR = "Mr. ";

    public static final String SALUTATION_MS = "Ms. ";

    public static final String GENDER_MALE = "Male";

    public static final String NOTIF_TRADE_PROPERTY_ID_KEY = "{PROPERTY_ID}";

    public static final String NOTIF_TENANT_KEY = "XYZ";

    public static final String PROPERTY_JSON_KEY = "Properties";
    
    public static final String ISSUED_COUNT = "issuedCount";
    
    public static final String RENEWED_COUNT = "renewedCount";

    public static final String BILLINGSLAB_TRADETYPE_JSONPATH_CODE = "$.billingSlab.*.tradeType";

    public static final String BILLINGSLAB_TRADETYPE_JSONPATH_UOM = "$.billingSlab.*.uom";

    public static final String BILLINGSLAB_ACCESSORY_JSONPATH_CODE = "$.billingSlab.*.accessoryCategory";

    public static final String BILLINGSLAB_ACCESSORY_JSONPATH_UOM = "$.billingSlab.*.uom";

    public TLConstants() {}

    public static final String TENANTS_JSONPATH = "$.MdmsRes.tenant.tenants";

}
