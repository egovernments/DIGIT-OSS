package org.egov.tlcalculator.utils;

public class TLCalculatorConstants {


    public static final String MDMS_EGF_MASTER = "egf-master";

    public static final String MDMS_FINANCIALYEAR  = "FinancialYear";

    public static final String MDMS_TAXPERIOD  = "TaxPeriod";

    public static final String MDMS_BILLINGSERVICE  = "BillingService";

    public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear[?(@.code==\"{}\")]";

    public static final String MDMS_TL_RENEWAL_TAX_PERIODS = "$.MdmsRes.BillingService.TaxPeriod[?(@.financialYear==\"{}\")]";

    public static final String MDMS_STARTDATE  = "startingDate";

    public static final String MDMS_ENDDATE  = "endingDate";

    public static final String MDMS_CALCULATIONTYPE = "CalculationType";

    public static final String MDMS_CALCULATIONTYPE_PATH = "$.MdmsRes.TradeLicense.CalculationType";

    public static final String MDMS_TRADELICENSE_PATH = "$.MdmsRes.TradeLicense";

    public static final String MDMS_TRADELICENSE = "TradeLicense";

    public static final String MDMS_CALCULATIONTYPE_FINANCIALYEAR= "financialYear";

    public static final String MDMS_CALCULATIONTYPE_TRADETYPE= "tradeType";

    public static final String MDMS_CALCULATIONTYPE_ACCESSORY= "accessory";

    public static final String MDMS_CALCULATIONTYPE_FINANCIALYEAR_PATH = "$.MdmsRes.TradeLicense.CalculationType[?(@.financialYear=='{}')]";

    public static final String MDMS_ROUNDOFF_TAXHEAD= "TL_ROUNDOFF";

    public static final String businessService_TL="TL";
    public static final String BILLINGSLAB_KEY = "calculationDescription";

    //TL types

    public static final String APPLICATION_TYPE_RENEWAL = "RENEWAL";

    public static final String APPLICATION_TYPE_NEW = "NEW";


    public static final String businessService_BPA="BPAREG";
}
