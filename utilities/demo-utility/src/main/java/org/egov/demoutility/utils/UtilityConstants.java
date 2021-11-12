package org.egov.demoutility.utils;

import java.util.Arrays;
import java.util.List;

public class UtilityConstants {
	
	public static final String  MESSAGE="Processing your request, you will get email with all details soon";
	
	public static final String  TENANTID="pg.cityb";
	public static final String  TENANTID_TOKEN="pg.citya";
	
	public static final String EMPLOYEED="EMPLOYED";

	public static final String DEFAULT_PASSWORD = "eGov@123";

	public static final String DOB = "662668200000";

	public static final String FATHERORHUSBAND = "TEST";

	public static final String BOUNDARY_TYPE = "City";
	
	public static final String BOUNDARY="pg.cityb";

	public static final String HIERARCHY ="REVENUE" ;

	public static final String Designantion = "DESIG_58";

	public static final String Department = "DEPT_2";

	public static final String LOCALITY = "SUN04";

	public static final String SOURCE = "WEB";

	public static final String MODEL = "1998";
	
	public static final String TYPE="MAHINDRA.BOLERO_PICKUP";
	
	public static final String VOLUME="1000";

	public static final String MUNICIPALRECORDS = "Municipal records";

	public static final String PERMANENT = "PERMANENT";
	
	public static final String SUCTION_TYPE="SEWER_SUCTION_MACHINE";
	
	public static final List<String> ROLE_1=Arrays.asList("CEMP", "TL_CEMP", "NOC_CEMP", "CSR", "WS_CEMP", "SW_CEMP",
			"FSM_COLLECTOR", "COLL_RECEIPT_CREATOR", "PT_CEMP");
	
	public static final List<String> ROLE_2=Arrays.asList("BPA_VERIFIER", "BPAREG_DOC_VERIFIER", "AIRPORT_AUTHORITY_APPROVER",
			"TL_DOC_VERIFIER", "NOC_DOC_VERIFIER", "GRO", "WS_DOC_VERIFIER", "SW_DOC_VERIFIER", "FSM_CREATOR_EMP",
			"FSM_VIEW_EMP", "FSM_EDITOR_EMP", "EGF_BILL_CREATOR", "EGF_VOUCHER_CREATOR", "EGF_PAYMENT_APPROVER",
			"PT_DOC_VERIFIER");
	
	public static final List<String> ROLE_3=Arrays.asList("BPA_FIELD_INSPECTOR", "BPA_NOC_VERIFIER", "TL_FIELD_INSPECTOR",
			"NOC_FIELD_INSPECTOR", "WS_FIELD_INSPECTOR", "SW_FIELD_INSPECTOR", "EGF_BILL_APPROVER",
			"EGF_VOUCHER_APPROVER", "EGF_PAYMENT_APPROVER", "PT_FIELD_INSPECTOR");
	
	public static final List<String> ROLE_4=Arrays.asList("BPA_APPROVER", "BPAREG_APPROVER", "TL_APPROVER", "NOC_APPROVER",
			"WS_APPROVER", "SW_APPROVER", "COLL_REMIT_TO_BANK", "PT_APPROVER");
	
	public static final List<String> ROLE_5=Arrays.asList("BPA_NOC_VERIFIER", "PGR_LME", "WS_CLERK", "SW_CLERK");
	
	public static final List<String> ROLE_6=Arrays.asList("STADMIN", "FSM_ADMIN", "EGF_ADMINISTRATOR", "EGF_REPORT_VIEW");

	public static final String EMPLOYEE = "EMPLOYEE";
	
	public static final String TEST="TEST";

	public static final String TENANT_CODE = "107";

	public static final String SUBJECT = "DIGIT USER CREDTINALS";
	
	public static StringBuffer EMAIL_STRATING_CONTENT=new StringBuffer("<html><head><style type=\"text/css\" media=\"screen\">table { border-collapse:collapse;border:1px solid;}  table td {border:1px solid #000000;}</style></head><body><h4> Hi, <br> <br> Thanks for registering for digit demo. Please find the below details for accessing modules.<br><br> URL: <u>https://staging.digit.org/employee</u> <br> <br> Default password for all users is : eGov@123 </h4>\r\n");
	
	public static String EMAIL_REGARDS="<p style=\"margin-right:100px\">Regards <br>Egov Foundation</p>";
	
	public static StringBuffer EMAIL_ENDING_CONTENT=new StringBuffer("</body></html>");
	

    public static final String PATTERN_NAME = "^[^\\\\$\\\"'<>?\\\\\\\\~`!@#$%^()+={}\\\\[\\\\]*,:;“”‘’]*$";


    public static final String PATTERN_GENDER = "^[a-zA-Z ]*$";
    public static final String PATTERN_MOBILE = "(^$|[0-9]{10})";
    public static final String PATTERN_CITY = "^[a-zA-Z. ]*$";
    public static final String PATTERN_TENANT = "^[a-zA-Z. ]*$";
    public static final List<String> NUMBERS=Arrays.asList("ONE","TWO","THREE","FOUR","FIVE","SIX");
	
	
	
	
	

	
	
	
}
