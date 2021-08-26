package org.egov.tlcalculator.utils;

import java.math.BigDecimal;

public class TLCalculatorConstants {


    public static final String MDMS_EGF_MASTER = "egf-master";

    public static final String MDMS_FINANCIALYEAR  = "FinancialYear";

    public static final String MDMS_TAXPERIOD  = "TaxPeriod";

    public static final String MDMS_BILLINGSERVICE  = "BillingService";

    public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear[?(@.code==\"{}\" && @.module == 'TL')]";

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

    public static final String REBATE_MASTER = "Rebate";

    public static final String PENANLTY_MASTER = "Penalty";

    public static final String FROMFY_FIELD_NAME = "fromFY";

    public static final String STARTING_DATE_APPLICABLES = "startingDay";

    public static final String ENDING_DATE_APPLICABLES = "endingDay";

    public static final String MAX_AMOUNT_FIELD_NAME = "maxAmount";

    public static final String MIN_AMOUNT_FIELD_NAME = "minAmount";

    public static final String FLAT_AMOUNT_FIELD_NAME = "flatAmount";

    public static final String RATE_FIELD_NAME = "rate";

    public static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    public static final Long TIMEZONE_OFFSET = 19800000l;


}
