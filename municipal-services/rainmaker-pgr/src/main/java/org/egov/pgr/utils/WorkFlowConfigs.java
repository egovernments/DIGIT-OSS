package org.egov.pgr.utils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 *  Utility Class to keep all the values related to workflow
 *  
 * @author kavi elrey
 *
 */
public class WorkFlowConfigs {

	public static final String ACTION_OPEN = "open";
	public static final String ACTION_ASSIGN = "assign";
	public static final String ACTION_CLOSE = "close";
	public static final String ACTION_REJECT = "reject";
	public static final String ACTION_RESOLVE = "resolve";
	public static final String ACTION_REOPEN = "reopen";
	public static final String ACTION_REASSIGN = "reassign";
	public static final String ACTION_REQUEST_FOR_REASSIGN = "requestforreassign";
	

	public static final String STATUS_OPENED = "open";
	public static final String STATUS_ASSIGNED = "assigned";
	public static final String STATUS_CLOSED = "closed";
	public static final String STATUS_REJECTED = "rejected";
	public static final String STATUS_RESOLVED = "resolved";
	public static final String STATUS_REASSIGN_REQUESTED = "reassignrequested";
	
	private WorkFlowConfigs() {}

	private static Map<String, String> actionStatusMap = prepareStatusMap();

	private static Map<String, List<String>> actionCurrentStatusMap = prepareActionCurrentStatusMap();

	private static Map<String, List<String>> roleActionMap = prepareRoleActionMap();
	
	private static Map<String, List<String>> mapOfStatusAndReceptors = prepareMapOfStatusAndNotificationReceptors();
	
	private static Map<String, List<String>> mapOfActionAndNotificationReceptors = prepareMapOfActionAndNotificationReceptors();



	private static Map<String, String> prepareStatusMap() {

		Map<String, String> map = new HashMap<>();
		map.put(ACTION_OPEN, STATUS_OPENED);
		map.put(ACTION_ASSIGN, STATUS_ASSIGNED);
		map.put(ACTION_CLOSE, STATUS_CLOSED);
		map.put(ACTION_REJECT, STATUS_REJECTED);
		map.put(ACTION_RESOLVE, STATUS_RESOLVED);
		map.put(ACTION_REOPEN, STATUS_OPENED);
		map.put(ACTION_REASSIGN, STATUS_ASSIGNED);
		map.put(ACTION_REQUEST_FOR_REASSIGN, STATUS_REASSIGN_REQUESTED);
		return map;
	}

	private static Map<String, List<String>> prepareActionCurrentStatusMap() {

		Map<String, List<String>> map = new HashMap<>();
		map.put(ACTION_ASSIGN, Arrays.asList(STATUS_OPENED));
		map.put(ACTION_CLOSE, Arrays.asList(STATUS_REJECTED, STATUS_RESOLVED));
		map.put(ACTION_REJECT, Arrays.asList(STATUS_ASSIGNED, STATUS_OPENED , STATUS_REASSIGN_REQUESTED));
		map.put(ACTION_RESOLVE, Arrays.asList(STATUS_ASSIGNED));
		map.put(ACTION_REOPEN, Arrays.asList(STATUS_REJECTED, STATUS_RESOLVED));
		map.put(ACTION_REASSIGN, Arrays.asList(STATUS_ASSIGNED , STATUS_REASSIGN_REQUESTED));
		map.put(ACTION_REQUEST_FOR_REASSIGN, Arrays.asList(STATUS_ASSIGNED));
		return map;
	}

	/**
	 * This map has the mapping between Role 'codes' and actions.
	 * @return
	 */
	private static Map<String, List<String>> prepareRoleActionMap() {

		Map<String, List<String>> map = new HashMap<>();
		map.put(PGRConstants.ROLE_EMPLOYEE, Arrays.asList(ACTION_RESOLVE, ACTION_REQUEST_FOR_REASSIGN));
		map.put(PGRConstants.ROLE_CITIZEN, Arrays.asList(ACTION_OPEN, ACTION_CLOSE, ACTION_REOPEN));
		map.put(PGRConstants.ROLE_GRO, Arrays.asList(ACTION_ASSIGN, ACTION_REJECT, ACTION_REASSIGN));
		map.put(PGRConstants.ROLE_DGRO, Arrays.asList(ACTION_ASSIGN, ACTION_REJECT, ACTION_REASSIGN));
		map.put(PGRConstants.ROLE_CSR, Arrays.asList(ACTION_OPEN, ACTION_CLOSE, ACTION_REOPEN));
		return map;
	}
	
	/**
	 * Mapping between the actors that are to receive notification and the status on which they do so.
	 * @return
	 */
	private static Map<String, List<String>> prepareMapOfStatusAndNotificationReceptors(){
		Map<String, List<String>> map = new HashMap<>();
		
		map.put(WorkFlowConfigs.STATUS_ASSIGNED, Arrays.asList(PGRConstants.ROLE_CITIZEN, PGRConstants.ROLE_EMPLOYEE));
		map.put(WorkFlowConfigs.STATUS_OPENED, Arrays.asList(PGRConstants.ROLE_CITIZEN));
		map.put(WorkFlowConfigs.STATUS_REJECTED, Arrays.asList(PGRConstants.ROLE_CITIZEN));
		map.put(WorkFlowConfigs.STATUS_RESOLVED, Arrays.asList(PGRConstants.ROLE_CITIZEN));
		map.put(WorkFlowConfigs.STATUS_CLOSED, Arrays.asList(PGRConstants.ROLE_EMPLOYEE));
		
		return map;
	}
	
	/**
	 * Mapping between the actors that are to receive notification and the action on which they do so.
	 * @return
	 */
	private static Map<String, List<String>> prepareMapOfActionAndNotificationReceptors(){
		Map<String, List<String>> map = new HashMap<>();
		
		map.put(WorkFlowConfigs.ACTION_REASSIGN, Arrays.asList(PGRConstants.ROLE_CITIZEN, PGRConstants.ROLE_EMPLOYEE));
		map.put(WorkFlowConfigs.ACTION_REOPEN, Arrays.asList(PGRConstants.ROLE_CITIZEN));
		
		return map;
	}
	
	public static Map<String, String> getActionStatusMap(){
		return actionStatusMap;
	}
	
	public static Map<String, List<String>> getActionCurrentStatusMap(){
		return actionCurrentStatusMap;
	}
	
	public static Map<String, List<String>> getRoleActionMap(){
		return roleActionMap;
	}
	
	public static Map<String, List<String>> getMapOfStatusAndReceptors(){
		return mapOfStatusAndReceptors;
	}
	
	public static Map<String, List<String>> getMapOfActionAndReceptors(){
		return mapOfActionAndNotificationReceptors;
	}
}