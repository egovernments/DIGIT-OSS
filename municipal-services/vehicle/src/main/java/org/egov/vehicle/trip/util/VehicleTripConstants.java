package org.egov.vehicle.trip.util;

import org.springframework.stereotype.Component;

@Component
public class VehicleTripConstants {
	
	//Error Constants
	public static final String INVALID_VEHICLELOG_ERROR = "INVALID_VEHICLETRIP_ERROR";
	public static final String CREATE_VEHICLETRIP_ERROR = "CREATE_VEHICLETRIP_ERROR";	
	public static final String UPDATE_VEHICLELOG_ERROR = "UPDATE_VEHICLETRIP_ERROR";
	public static final String INVALID_TENANT = "INVALID TENANT";
	public static final String INVALID_DSO = "INVALID DSO";
	public static final String INVALID_VEHICLE = "INVALID VEHICLE";
	public static final String INVALID_APPLICATION_NOS = "INVALID APPLICATION NUMBER/NUMBERS";
	public static final String IDGEN_ERROR = "IDGEN ERROR";
	public static final String INVALID_SEARCH = "INVALID SEARCH";
	
	//VehicleLog Application Status Constants
	public static final String VEHICLE_LOG_APPLICATION_CREATED_STATUS = "SCHEDULED";
	public static final String VEHICLE_LOG_APPLICATION_UPDATED_STATUS = "UPDATED";
	public static final String INVALID_TRIDETAIL_ERROR = "INVALID_TRIDETAIL_ERROR";
	public static final String READY_FOR_DISPOSAL ="READY_FOR_DISPOSAL";
	public static final String DISPOSE ="DISPOSE";
	public static final String PARSING_ERROR = "PARSING_ERROR";
	public static final String INVALID_UPDATE = "INVALID_UPDATE";
	public static final String FSM_VEHICLE_TRIP_BusinessService = "FSM_VEHICLE_TRIP";
	public static final String EG_FSM_WF_ERROR_KEY_NOT_FOUND = "EG_FSM_WF_ERROR_KEY_NOT_FOUND";
	public static final String EG_WF_ERROR = "EG_WF_ERROR";
	public static final String INVALID_VOLUME = "INVALID_VOLUME";
	public static final String INVALID_TRIP_ENDTIME = "INVALID_TRIP_ENDTIME";
	public static final String ACTION_SCHEDULE = "SCHEDULE";
}
