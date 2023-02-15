package org.egov.tl.util;

public class BPAConstants {

    // mdms master names
    public static final String TRADETYPE_TO_ROLEMAPPING = "TradeTypetoRoleMapping";

    public static final String MDMS_MODULE_BPAREGISTRATION = "StakeholderRegistraition";

    public static final String MDMS_BPAROLEPATH = "$.MdmsRes.StakeholderRegistraition.TradeTypetoRoleMapping.*.role";

    public static final String MDMS_ENDSTATEPATH = "$.MdmsRes.StakeholderRegistraition.TradeTypetoRoleMapping.*.endstate";

    public static final String PENDINGDOCVERIFICATION_STATUS = "PENDINGDOCVERIFICATION";

    public static final String APPROVED_STATUS = "APPROVED";

    public static final String ACTION_STATUS_PENDINGPAYMENT = "APPLY_PENDINGPAYMENT";

    public static final String ACTION_STATUS_PENDINGAPPROVAL = "FORWARD_PENDINGAPPROVAL";

    public static final String ACTION_STATUS_APPROVED = "APPROVE_APPROVED";

    public static final String ACTION_STATUS_REJECTED = "REJECT_REJECTED";

    public static final String ACTION_STATUS_INITIATED = "APPLY_INITIATED";

    public static final String ACTION_STATUS_INITIATED_PARTIAL = "NOWORKFLOW_INITIATED";

    public static final String MODULE = "rainmaker-bpareg";

    public static final String NOTIFICATION_PENDINGPAYMENT = "bpa.en.counter.pendingpayment";

    public static final String NOTIFICATION_APPROVED = "bpa.en.counter.approved";

    public static final String NOTIFICATION_REJECTED = "bpa.en.counter.rejected";

    public static final String NOTIFICATION_PENDINGAPPROVAL = "bpa.en.counter.pendingapproval";

    public static final String NOTIFICATION_PENDINGDOCVERIFICATION = "bpa.en.counter.pendingdocverification";

    public static final String NOTIFICATION_INITIATED = "bpa.en.counter.initiated";

    public static final String NOTIFICATION_PENDINGPAYMENT_EMAIL = "bpa.en.counter.pendingpayment.email";

    public static final String NOTIFICATION_APPROVED_EMAIL = "bpa.en.counter.approved.email";

    public static final String NOTIFICATION_REJECTED_EMAIL = "bpa.en.counter.rejected.email";

    public static final String NOTIFICATION_PENDINGAPPROVAL_EMAIL = "bpa.en.counter.pendingapproval.email";

    public static final String NOTIFICATION_PENDINGDOCVERIFICATION_EMAIL = "bpa.en.counter.pendingdocverification.email";

    public static final String NOTIFICATION_LOCALE = "en_IN";

    public static final String NOTIFICATION_INITIATED_EMAIL = "bpa.en.counter.initiated.email";

    public static final String TRADE_LOCALISATION_PREFIX = "TRADELICENSE_TRADETYPE_";

    public static final String  USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
    public static final String  USREVENTS_EVENT_NAME = "BPA Registration";
    public static final String  USREVENTS_EVENT_POSTEDBY = "SYSTEM-BPAREG";

    public static final String BUSINESS_SERVICE_BPAREG = "BPAREG";

    public static final String MDMS_MODULE_TENANT = "tenant";

    public static final String MDMS_TENANTS = "tenants";
}
