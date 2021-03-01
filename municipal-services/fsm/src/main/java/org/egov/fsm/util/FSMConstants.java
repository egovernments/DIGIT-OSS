package org.egov.fsm.util;

import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.stereotype.Component;

@Component
public class FSMConstants {


	// MDMS

	public static final String EMPLOYEE="Employee";
	
	public static final String FSM_MODULE = "FSM";

	public static final String FSM_BusinessService = "FSM";

	public static final String FSM_MODULE_CODE = "FSM";

	public static final String VEHICLE_MODULE_CODE = "Vehicle";

	public static final String COMMON_MASTERS_MODULE = "common-masters";
	
	public static final String PROPERTY_MASTER_MODULE="PropertyTax";

	public static final String NOTIFICATION_LOCALE = "en_IN";
	
	public static final String FSM_PAY_BUSINESS_SERVICE="FSM.TRIP_CHARGES";
	
	public static final String DRAFT="DRAFT";
	public static final String APPLICATION_CHANNEL_SOURCE="ONLINE";
	public static final String SANITATION_TYPE_SINGLE_PIT="CONVENTIONAL_SINGLE_PIT";

	// mdms path codes

	public static final String FSM_JSONPATH_CODE = "$.MdmsRes.FSM";

	public static final String VEHICLE_JSONPATH_CODE = "$.MdmsRes.Vehicle";
	public static final String COMMON_MASTER_JSONPATH_CODE = "$.MdmsRes.common-masters";
	public static final String REQ_CHECKLIST_PATH="$.MdmsRes.FSM.CheckList[?(@.required==true)]"; 

	public static final String FSM_SLUM_OVERRIDE_ALLOWED = "$.MdmsRes.FSM.Config[?(@.active==true && @.code==\"slumName\" && @.override==true )]";
	public static final String FSM_TRIP_AMOUNT_OVERRIDE_ALLOWED = "$.MdmsRes.FSM.Config[?(@.active==true && @.code==\"additionalDetails.tripAmount\" && @.override==true )]";
	public static final String FSM_NO_OF_TRIPS_AMOUNT_OVERRIDE_ALLOWED = "$.MdmsRes.FSM.Config[?(@.active==true && @.code==\"noOfTrips\" && @.override==true )]";
	public static final String SLUM_CODE_PATH="$.MdmsRes.FSM.Slum[?(@.active==true && @.locality==\"{1}\" && @.code==\"{2}\")]";
	
	
	// mdms master names

	public static final String MDMS_PROPERTY_TYPE = "PropertyType";
    public static final String MDMS_APPLICATION_CHANNEL = "ApplicationChannel";
    public static final String MDMS_SANITATION_TYPE = "SanitationType";
    public static final String MDMS_PIT_TYPE = "PitType";
	public static final String MDMS_CHECKLIST = "CheckList";
	public static final String MDMS_CONFIG = "Config";
	public static final String MDMS_VEHICLE_MAKE_MODEL = "VehicleMakeModel";
	public static final String MDMS_SLUM_NAME = "Slum";
	public static final String MDMS_VEHICLE_TYPE = "VehicleType";


	// FINANCIAL YEAR

	public static final String MDMS_EGF_MASTER = "egf-master";

	public static final String MDMS_FINANCIALYEAR = "FinancialYear";

	public static final String MDMS_FINACIALYEAR_PATH = "$.MdmsRes.egf-master.FinancialYear[?(@.code==\"{}\")]";
	
	public static final String MDMS_FSM_CONFIG_ALLOW_MODIFY = "$.MdmsRes.FSM.Config[?(@.code==\"ALLOW_MODIFY\" && @.WFState==\"%s\")].override.*";

	public static final String MDMS_STARTDATE = "startingDate";

	public static final String MDMS_ENDDATE = "endingDate";



	

	public static final String USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
	public static final String USREVENTS_EVENT_NAME = "FSM";
	public static final String USREVENTS_EVENT_POSTEDBY = "SYSTEM-FSM";
	public static final String SEARCH_MODULE = "rainmaker-common";
	
	
	

	public static final String FILESTOREID = "fileStoreId";


	public static final String CITIZEN = "CITIZEN";
	public static final String FSM_EDITOR_EMP = "FSM_EDITOR_EMP";
	
	public static final String ACTION_SENDBACKTOCITIZEN = "SEND_BACK_TO_CITIZEN";
	
	public static final String WF_ACTION_APPLY = "APPLY";
	public static final String WF_ACTION_CREATE ="CREATE";
	public static final String WF_ACTION_SUBMIT="SUBMIT";
	public static final String WF_ACTION_ASSIGN_DSO="ASSIGN";
	public static final String WF_ACTION_DSO_ACCEPT="DSO_ACCEPT";
	
	public static final String APPLICATION_FEE ="APPLICATION_FEE";

	public static final String PIT_TYPE_DIAMETER = "dd";
	public static final String PIT_TYPE_LDB = "lbd";

	public static final String ROLE_FSM_DSO = "FSM_DSO";

	public static final String WF_ACTION_COMPLETE = "COMPLETED";

	public static final String WF_ACTION_SUBMIT_FEEDBACK = "SUBMIT_FEEDBACK";

	public static final String WF_ACTION_ADDITIONAL_PAY_REQUEST = "ADDITIONAL_PAY_REQUEST";

	public static final String WF_ACTION_REJECT = "REJECT";

	public static final String WF_ACTION_CANCEL = "CANCEL";

	public static final String WF_ACTION_SEND_BACK = "SENDBACK";

	public static final String WF_ACTION_DSO_REJECT = "DSO_REJECT";
	


	public static final String WF_STATUS_CREATED = "CREATED";
	public static final String APPLICATION_CHANNEL_TELEPONE="TELEPHONE";
	public static final String SMS_NOTIFICATION_PREFIX="FSM_SMS_";
	public static final String  WF_STATUS_PENDING_APPL_FEE_PAYMENT="PENDING_APPL_FEE_PAYMENT";

	public static final String CHECK_LIST_SINGLE_SELECT = "SINGLE_SELECT";
	public static final String CHECK_LIST_MULTI_SELECT = "MULTI_SELECT";

	public static final String VEHICLETRIP_BUSINESSSERVICE_NAME = "FSM_VEHICLE_TRIP";

	public static final String TRIP_READY_FOR_DISPOSAL = "READY_FOR_DISPOSAL";
	
	public static final String PIT_DETAIL = "pitDetail";
	
	public static final ArrayList<String> pitDetailList= new ArrayList<String>( Arrays.asList("height", "length", "width", "diameter", "distanceFromRoad") );

	public static final String RECEIPT_KEY = "fsm-receipt";



	


}