package org.egov.bpa.calculator.utils;

public class BPACalculatorConstants {

	

    public static final String MDMS_EGF_MASTER = "egf-master";

    public static final String MDMS_FINANCIALYEAR  = "FinancialYear";

    public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear[?(@.code==\"{}\")]";

    public static final String MDMS_STARTDATE  = "startingDate";

    public static final String MDMS_ENDDATE  = "endingDate";

    public static final String MDMS_CALCULATIONTYPE = "CalculationType";

    public static final String MDMS_CALCULATIONTYPE_PATH = "$.MdmsRes.BPA.CalculationType";

    public static final String MDMS_BPA_PATH = "$.MdmsRes.BPA";

    public static final String MDMS_BPA = "BPA";

    public static final String MDMS_CALCULATIONTYPE_FINANCIALYEAR= "financialYear";

    public static final String MDMS_CALCULATIONTYPE_FINANCIALYEAR_PATH = "$.MdmsRes.BPA.CalculationType[?(@.financialYear=='{}')]";

	public static final Object MDMS_CALCULATIONTYPE_SERVICETYPE = "serviceType";

	public static final Object MDMS_CALCULATIONTYPE_RISKTYPE = "riskType";

	public static final String MDMS_ROUNDOFF_TAXHEAD = "TL_ROUNDOFF";

	public static final String MDMS_CALCULATIONTYPE_AMOUNT = "amount";
	
	public static final String MDMS_CALCULATIONTYPE_APL_FEETYPE = "ApplicationFee";
	
	public static final String MDMS_CALCULATIONTYPE_SANC_FEETYPE = "SanctionFee";

	public static final String LOW_RISK_PERMIT_FEE_TYPE = "LOW_RISK_PERMIT_FEE";

	public static final String MDMS_CALCULATIONTYPE_LOW_SANC_FEETYPE = "Low_SanctionFee";

	public static final String MDMS_CALCULATIONTYPE_LOW_APL_FEETYPE = "Low_ApplicationFee";
	
	// Error messages in BPA Calculator
	
	public static final String PARSING_ERROR = "PARSING ERROR";
	
	public static final String INVALID_AMOUNT = "INVALID AMOUNT";
	
	public static final String INVALID_UPDATE = "INVALID UPDATE";
	
	public static final String INVALID_ERROR = "INVALID ERROR";
	
	public static final String INVALID_APPLICATION_NUMBER = "INVALID APPLICATION NUMBER";
	
	public static final String EDCR_ERROR = "EDCR_ERROR";
	
	public static final String CALCULATION_ERROR = "CALCULATION ERROR";
	
}
