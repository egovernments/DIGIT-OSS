package org.egov.echallan.util;

import org.springframework.stereotype.Component;

@Component
public class ChallanConstants {

    public static final String STATUS_ACTIVE = "ACTIVE";

    public static final String STATUS_CANCELLED  = "CANCELLED";

    public static final String STATUS_PAID  = "PAID";
    

    public static final String KEY_ID = "id";

    public static final String KEY_FILESTOREID = "filestoreid";

    public static final String KEY_PDF_JOBS = "jobs";

    public static final String KEY_PDF_ENTITY_ID = "entityid";

    public static final String KEY_PDF_FILESTOREID = "filestoreids";
    
    public static final String KEY_NAME = "key";
    
	public static final String GL_CODE_JSONPATH_CODE = "$.MdmsRes.BillingService.GLCode[?(@.code==\"{}\")]";

	public static final String GL_CODE = "glcode";
	
	public static final String GL_CODE_MASTER = "GLCode";

	public static final String BILLING_SERVICE = "BillingService";

    public static final String TAXPERIOD_MASTER = "TaxPeriod";

    public static final String TAXPHEADCODE_MASTER = "TaxHeadMaster";

    public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.BillingService.TaxPeriod";

    public static final String MDMS_TAXHEADCODES_PATH = "$.MdmsRes.BillingService.TaxHeadMaster[?(@.service == '{}' && @.isRequired == true)].code";

    public static final String MDMS_STARTDATE  = "fromDate";

    public static final String MDMS_ENDDATE  = "toDate";

    public static final String HIERARCHY_CODE  = "REVENUE";

    public static final String BOUNDARY_TYPE  = "Locality";

    public static final String LOCALITY_CODE_PATH = "$.TenantBoundary.[*].boundary[?(@.label==\"Locality\")].code";

    // notification constants
    public static final String CHANNEL_NAME_SMS = "SMS";

    public static final String CHANNEL_NAME_EVENT = "EVENT";

    public static final String CHANNEL_NAME_EMAIL = "EMAIL";

    public static final String MODULE = "module";

    public static final String ACTION = "action";

    public static final String CHANNEL_LIST = "channelList";

    public static final String CHANNEL = "Channel";

    public static final String MCOLLECT_BUSINESSSERVICE = "MCOLLECT";

    public static final String CREATE_ACTION = "CREATE";
    public static final String UPDATE_ACTION = "UPDATE";
    public static final String CANCEL_ACTION = "CANCEL";
    public static final String PAYMENT_ACTION = "PAYMENT";

    public static final String CREATE_CODE = "echallan.create.sms";
    public static final String UPDATE_CODE = "echallan.update.sms";
    public static final String CANCEL_CODE = "echallan.cancel.sms";
    public static final String PAYMENT_CODE = "echallan.payment.sms";

    public static final String CREATE_CODE_INAPP = "echallan.create.inapp";
    public static final String UPDATE_CODE_INAPP = "echallan.update.inapp";
    public static final String CANCEL_CODE_INAPP = "echallan.cancel.inapp";
    public static final String PAYMENT_CODE_INAPP= "echallan.payment.inapp";

    public static final String CREATE_CODE_EMAIL = "echallan.create.email";
    public static final String UPDATE_CODE_EMAIL = "echallan.update.email";
    public static final String CANCEL_CODE_EMAIL = "echallan.cancel.email";
    public static final String PAYMENT_CODE_EMAIL = "echallan.payment.email";

    public static final String DOWNLOAD_RECEIPT_CODE = "DOWNLOAD RECEIPT";
    
    public static final String TOTAL_COLLECTION = "totalCollection";

    public static final String TOTAL_SERVICES = "totalServices";

    public ChallanConstants() {}

}
