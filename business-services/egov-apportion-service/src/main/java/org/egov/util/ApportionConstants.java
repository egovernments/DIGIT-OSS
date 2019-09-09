package org.egov.util;

import org.springframework.stereotype.Component;

@Component
public class ApportionConstants {

    public static final String DEFAULT = "DEFAULT";

    public static final String MDMS_BILLING_SERVICE = "BillingService";

    public static final String MDMS_TAXHEAD  = "TaxHeadMaster";

    public static final String ADVANCE_TAXHEAD_JSONPATH_CODE = "$.MdmsRes.BillingService.TaxHeadMaster[?(@.category=='ADVANCE_COLLECTION' && @.service==\"{}\")].code";


    public ApportionConstants() {
    }
}
