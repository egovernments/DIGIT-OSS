package org.egov.tl.util;

public class BPAConstants {

    // mdms master names
    public static final String TRADETYPE_TO_ROLEMAPPING = "TradeTypetoRoleMapping";

    public static final String MDMS_MODULE_BPAREGISTRATION = "StakeholderRegistraition";

    public static final String MDMS_BPAROLEPATH = "$.MdmsRes.StakeholderRegistraition.TradeTypetoRoleMapping.*.role";

    public static final String MDMS_ENDSTATEPATH = "$.MdmsRes.StakeholderRegistraition.TradeTypetoRoleMapping.*.endstate";

    public static final String ACTION_STATUS_PENDINGPAYMENT = "APPLY_PENDINGPAYMENT";

    public static final String ACTION_STATUS_PENDINGAPPROVAL = "FORWARD_PENDINGAPPROVAL";

    public static final String ACTION_STATUS_APPROVED = "APPROVE_APPROVED";

    public static final String ACTION_STATUS_REJECTED = "REJECT_REJECTED";

    public static final String MODULE = "rainmaker-bpareg";

    public static final String NOTIFICATION_PENDINGPAYMENT = "bpa.en.counter.pendingpayment";

    public static final String NOTIFICATION_APPROVED = "bpa.en.counter.approved";

    public static final String NOTIFICATION_REJECTED = "bpa.en.counter.rejected";

    public static final String NOTIFICATION_PENDINGAPPROVAL = "bpa.en.counter.pendingapproval";


    public static final String NOTIFICATION_PENDINGDOCVERIFICATION = "bpa.en.counter.pendingdocverification";

    public static final String TRADE_LOCALISATION_PREFIX = "TRADELICENSE_TRADETYPE_";

    public static final String  USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
    public static final String  USREVENTS_EVENT_NAME = "BPA Registration";
    public static final String  USREVENTS_EVENT_POSTEDBY = "SYSTEM-BPAREG";

}
