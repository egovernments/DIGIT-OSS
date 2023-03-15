package org.egov.userevent.utils;

import org.springframework.stereotype.Component;

@Component
public class ErrorConstants {
	
	public static final String MISSING_ROLE_USERID_CODE = "MEN_USERID_ROLECODE_MISSING";
	public static final String MISSING_ROLE_USERID_MSG = "User id, tenantid and rolecode are mandatory in the request info";
	
	public static final String MISSING_REQ_INFO_CODE = "MEN_REQ_INFO_MISSING";
	public static final String MISSING_REQ_INFO_MSG = "RequestInfo is mandatory in the request.";
	
	public static final String MISSING_USR_INFO_CODE = "MEN_USR_INFO_MISSING";
	public static final String MISSING_USR_INFO_MSG = "UserIndfo is mandatory within the RequestInfo.";
	
	public static final String EMPTY_RECEPIENT_CODE = "MEN_EMPTY_RECEPIENT";
	public static final String EMPTY_RECEPIENT_MSG = "toRoles and toUsers both cannot be empty, provide atleast one of them. "
			+ "Incase the event is addressed to everyone, send 'All' in toRoles";
	
	public static final String INVALID_EVENT_DATE_CODE = "MEN_INVALID_EVENT_DATE";
	public static final String INVALID_EVENT_DATE_MSG = "Date invalid, fromDate cannot be greater than toDate";
	
	public static final String INVALID_FROM_DATE_CODE = "MEN_INVALID_FROM_DATE";
	public static final String INVALID_FROM_DATE_MSG = "Date invalid, fromDate cannot be prior to the currentDate";
	
	public static final String INVALID_TO_DATE_CODE = "MEN_INVALID_TO_DATE";
	public static final String INVALID_TO_DATE_MSG = "Date invalid, toDate cannot be prior to the currentDate";
	
	public static final String INVALID_FROM_TO_DATE_CODE = "MEN_INVALID_FROM_TO_DATE";
	public static final String INVALID_FROM_TO_DATE_MSG = "Date invalid, fromDate and toDate cannot be prior to the currentDate";

	public static final String MEN_ERROR_FROM_MDMS_CODE = "MEN_ERROR_FROM_MDMS";
	public static final String MEN_ERROR_FROM_MDMS_MSG = "There was an error while fetching event masters from MDMS";
	
	public static final String MEN_NO_DATA_MDMS_CODE = "MEN_NO_DATA_MDMS";
	public static final String MEN_NO_DATA_MDMS_MSG = "MDMS data for eventTypes is missing!";
	
	public static final String MEN_INVALID_EVENTTYPE_CODE = "MEN_INVALID_EVENTTYPE";
	public static final String MEN_INVALID_EVENTTYPE_MSG = "The provided eventType is not valid.";
	
	public static final String MEN_UPDATE_MISSING_EVENTS_CODE = "MEN_UPDATE_MISSING_EVENTS";
	public static final String MEN_UPDATE_MISSING_EVENTS_MSG = "The events you're trying update are missing in the system.";
	
	public static final String MEN_INVALID_SEARCH_CRITERIA_CODE = "MEN_INVALID_SEARCH_CRITERIA";
	public static final String MEN_INVALID_SEARCH_CRITERIA_MSG = "Atleast one of the parameters is mandatory for searching events.";
	
	public static final String MEN_INVALID_SEARCH_COUNT_CRITERIA_CODE = "MEN_INVALID_SEARCH_COUNT_CRITERIA";
	public static final String MEN_INVALID_SEARCH_COUNT_CRITERIA_MSG = "Atleast one of the parameters is mandatory for fetching events or count of unread notifications.";
	
	public static final String MEN_UPDATE_EVENTDETAILS_MANDATORY_CODE = "MEN_UPDATE_EVENTDETAILS_MANDATORY";
	public static final String MEN_UPDATE_EVENTDETAILS_MANDATORY_MSG = "EventDetails are mandatory for this type of event.";
	
	public static final String MEN_UPDATE_COUNTEREVENT_CODE = "MEN_UPDATE_COUNTEREVENT";
	public static final String MEN_UPDATE_COUNTEREVENT_MSG = "You're trying to update a system generated counter event, which is not allowed.";
	
	public static final String MEN_CREATE_NAMEMANDATORY_CODE = "MEN_CREATE_NAMEMANDATORY";
	public static final String MEN_CREATE_NAMEMANDATOR_MSG = "Name of the event is mandatory.";
	
	public static final String MEN_CREATE_CATEGORYMANDATORY_CODE = "MEN_CREATE_CATEGORYMANDATORY";
	public static final String MEN_CREATE_CATEGORYMANDATORY_MSG = "Category of the event is mandatory.";
	
	public static final String MEN_INVALID_CATEGORYMANDATORY_CODE = "MEN_INVALID_CATEGORYMANDATORY";
	public static final String MEN_INVALID_CATEGORYMANDATORY_MSG = "Category of the event is invalid.";
	
	public static final String MEN_CREATE_BROADCAST_CODE = "MEN_CREATE_BROADCAST";
	public static final String MEN_CREATE_BROADCAST_MSG = "Broadcast messages should not contain any event details";
	
	public static final String MEN_INVALID_TOROLE_CODE = "MEN_INVALID_TOROLE";
	public static final String MEN_INVALID_TOROLE_MSG = "toRoles cannot contain special characters. format - USERTYPE.USERROLE";
	
	public static final String MEN_INVALID_TOROLE_ALL_CODE = "MEN_INVALID_TOROLE_ALL";
	public static final String MEN_INVALID_TOROLE_ALL_MSG = "toRoles cannot contain other values alongwith 'All', toUsers should be empty";
	
	public static final String MEN_INVALID_TOUSER_CODE = "MEN_INVALID_TOUSER";
	public static final String MEN_INVALID_TOUSER_MSG = "toUsers should only contain ids with the UUID type.";
	
	public static final String MEN_INVALID_ACTION_CANCEL_CODE = "MEN_INVALID_ACTION_CANCEL";
	public static final String MEN_INVALID_ACTION_CANCEL_MSG = "Cancelled events cannot be made ACTIVE or INACTIVE.";
	
	public static final String MEN_UPDATE_STATUS_NOTNULL_CODE = "MEN_UPDATE_STATUS_NOTNULL";
	public static final String MEN_UPDATE_STATUS_NOTNULL_MSG = "Status cannot be null while updating the event.";
	
	public static final String MEN_BROADCAST_ED_FD_MANDATORY_CODE = "MEN_BROADCAST_ED_FD_MANDATORY";
	public static final String MEN_BROADCAST_ED_FD_MANDATORY_MSG = "fromDate is mandatory for this type of event.";
	
}
