package org.egov.userevent.utils;

import org.springframework.stereotype.Component;

@Component
public class UserEventsConstants {
	
	public static final String MEN_MDMS_MODULE_CODE = "mseva";	
	public static final String MEN_MDMS_EVENTMASTER_CODE = "EventTypes";
	public static final String MEN_MDMS_EVENTCATEGORY_MASTER_CODE = "EventCategories";
	public static final String MEN_MDMS_EVENTMASTER_FILTER = "$.[?(@.active==true)].code";
	public static final String MEN_MDMS_EVENTCATEGORY_MASTER_FILTER = "$.[?(@.active==true)].code";
	public static final String MEN_MDMS_EVENTMASTER_CODES_JSONPATH = "$.MdmsRes." + MEN_MDMS_MODULE_CODE + "." + MEN_MDMS_EVENTMASTER_CODE;
	public static final String MEN_MDMS_EVENTCATEGORY_MASTER_CODES_JSONPATH = "$.MdmsRes." + MEN_MDMS_MODULE_CODE + "." + MEN_MDMS_EVENTCATEGORY_MASTER_CODE;

	
	public static final String MEN_MDMS_EVENTSONGROUND_CODE = "EVENTSONGROUND";	
	public static final String MEN_MDMS_BROADCAST_CODE = "BROADCAST";
	public static final String MEN_MDMS_SYSTEMGENERATED_CODE = "SYSTEMGENERATED"; 
 
	public static  final String SURVEY_EVENT_NAME = "New Survey";
	public static  final String DOCUMENT_EVENT_NAME = "New Document";

	public static final String[] VALID_ROLES_FOR_SEARCH = {"EMPLOYEE"};

	public static final String REGEX_FOR_SPCHARS_EXCEPT_DOT = "[$&+,:;=\\\\\\\\?@#|/'<>^()%!-]";	
	public static final String REGEX_FOR_UUID = "[/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/]";
	public static final String ALL_KEYWORD = "All";	
	
	public static final String[] INTEGRATED_MODULES = {"SYSTEM-PT", "SYSTEM-PGR", "SYSTEM-TL", "SYSTEM-FIRENOC"};
	
	public static final String LOCALIZATION_MODULE_NAME = "egov-user-events";
	public static final String LOCALIZATION_CODES_JSONPATH = "$.messages.*.code";
	public static final String LOCALIZATION_MSGS_JSONPATH = "$.messages.*.message";
	public static final String LOCALIZATION_COUNTEREVENT_ONDELETE_CODE = "egovuserevents.notification.counterevent.ondelete";
	public static final String LOCALIZATION_COUNTEREVENT_ONDELETE_DEF_MSG = "<event_name> has been deleted. Please remove from your calendar.";
	public static final String LOCALIZATION_COUNTEREVENT_ONUPDATE_CODE = "egovuserevents.notification.counterevent.onupdate";
	public static final String LOCALIZATION_COUNTEREVENT_ONUPDATE_DEF_MSG = "Details of <event_name> have been updated.";



	
	


	
	

}
