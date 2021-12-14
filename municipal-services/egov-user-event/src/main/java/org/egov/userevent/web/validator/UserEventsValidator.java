package org.egov.userevent.web.validator;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.userevent.model.enums.Status;
import org.egov.userevent.service.MDMSService;
import org.egov.userevent.service.UserEventsService;
import org.egov.userevent.utils.ErrorConstants;
import org.egov.userevent.utils.UserEventsConstants;
import org.egov.userevent.web.contract.Event;
import org.egov.userevent.web.contract.EventRequest;
import org.egov.userevent.web.contract.EventSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserEventsValidator {

	@Autowired
	private MDMSService mdmsService;

	@Autowired
	private UserEventsService service;

	/**
	 * Validator to validate the create event request
	 * 
	 * @param request
	 */
	public void validateCreateEvent(EventRequest request, Boolean isCreate) {
		log.info("Validating the request......");
		Map<String, String> errorMap = new HashMap<>();
		validateRI(request.getRequestInfo(), errorMap);
		Set<String> eventTenants = request.getEvents().stream().map(Event :: getTenantId).collect(Collectors.toSet());
		if(eventTenants.size() != 1) {
			throw new CustomException("MEN_DIFF_TENANT_ERROR", "All events must belong to the same tenant");
		}
		Map<String, List<String>> eventMaster = mdmsService.fetchEventMasters(request.getRequestInfo(), request.getEvents().get(0).getTenantId());
		request.getEvents().forEach(event -> {
			validateEventData(request.getRequestInfo(), event, errorMap, eventMaster, isCreate);
		});
		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}

	}

	/**
	 * Validator to validate the update event request
	 * 
	 * @param request
	 */
	public void validateUpdateEvent(EventRequest request) {
		Map<String, String> errorMap = new HashMap<>();
		validateForUpdate(request, errorMap);
		validateCreateEvent(request, false);
	}

	/**
	 * Validator to validate the request for event search and count
	 * 
	 * @param requestInfo
	 * @param criteria
	 */
	public void validateSearch(RequestInfo requestInfo, EventSearchCriteria criteria) {
		Map<String, String> errorMap = new HashMap<>();
		//validateRI(requestInfo, errorMap);
		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}
	}

	/**
	 * Helper method that checks if the events to be updated are existing in the system.
	 * 
	 * @param request
	 * @param errorMap
	 */
	private void validateForUpdate(EventRequest request, Map<String, String> errorMap) {
		EventSearchCriteria criteria = new EventSearchCriteria();
		List<String> ids = request.getEvents().stream().map(Event::getId).collect(Collectors.toList());
		criteria.setIds(ids);
		List<Event> responseFromDB = service.searchEvents(request.getRequestInfo(), criteria, true).getEvents();
		if (responseFromDB.size() != request.getEvents().size()) {
			log.info("responseFromDB: "+responseFromDB.stream().map(Event::getId).collect(Collectors.toList()));
			log.info("request.getEvents(): "+request.getEvents().stream().map(Event::getId).collect(Collectors.toList()));
			
			errorMap.put(ErrorConstants.MEN_UPDATE_MISSING_EVENTS_CODE, ErrorConstants.MEN_UPDATE_MISSING_EVENTS_MSG);
		}
		Map<String, Event> dBEventsMap = responseFromDB.stream().collect(Collectors.toMap(Event::getId, Function.identity()));
		for (Event event : request.getEvents()) {
			if (null == event.getStatus()) {
				errorMap.put(ErrorConstants.MEN_UPDATE_STATUS_NOTNULL_CODE, ErrorConstants.MEN_UPDATE_STATUS_NOTNULL_MSG);
			}			
			if(null != event.getEventDetails()) {
				if(null != dBEventsMap.get(event.getId()).getEventDetails()) {
					if(!event.getEventDetails().getFromDate().equals(dBEventsMap.get(event.getId()).getEventDetails().getFromDate())) {
						if(event.getEventDetails().getFromDate() < new Date().getTime()) {
							errorMap.put(ErrorConstants.INVALID_FROM_DATE_CODE, ErrorConstants.INVALID_FROM_DATE_MSG);
						}
					}
					if(!event.getEventDetails().getToDate().equals(dBEventsMap.get(event.getId()).getEventDetails().getToDate())) {
						if(event.getEventDetails().getToDate() < new Date().getTime()) {
							errorMap.put(ErrorConstants.INVALID_TO_DATE_CODE, ErrorConstants.INVALID_TO_DATE_MSG);
						}	
					}
				}else {
					if(event.getEventDetails().getFromDate() < new Date().getTime() 
							|| event.getEventDetails().getToDate() < new Date().getTime()) {
						errorMap.put(ErrorConstants.INVALID_FROM_TO_DATE_CODE, ErrorConstants.INVALID_FROM_TO_DATE_MSG);
					}
				}
			}
		}
		validateActions(request.getEvents(), responseFromDB, errorMap);

		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}

	}

	/**
	 * Validates the actions performed on an event. As follows:
	 * 1. If the event is already in CANCELLED state, it cannot be made ACTIVE or INACTIVE.
	 * 2. for events of type EVENTSONGROUND, this method decides whether a counter events has to be generated based on the action.
	 * 
	 * @param reqEvents
	 * @param dbEvents
	 * @param errorMap
	 */
	private void validateActions(List<Event> reqEvents, List<Event> dbEvents, Map<String, String> errorMap) {
		Map<String, Status> mapOfIdAndCurrentState = dbEvents.stream()
				.collect(Collectors.toMap(Event::getId, Event::getStatus));
		reqEvents.forEach(event -> {
			if (event.getEventType().equals(UserEventsConstants.MEN_MDMS_EVENTSONGROUND_CODE)) {					
				if (mapOfIdAndCurrentState.get(event.getId()).equals(Status.CANCELLED)) {
					if (event.getStatus().equals(Status.INACTIVE) || event.getStatus().equals(Status.ACTIVE)) {
						errorMap.put(ErrorConstants.MEN_INVALID_ACTION_CANCEL_CODE,
								ErrorConstants.MEN_INVALID_ACTION_CANCEL_MSG);
					}
					if (event.getStatus().equals(Status.CANCELLED)) {
						event.setGenerateCounterEvent(false);
					}
				}
				if (mapOfIdAndCurrentState.get(event.getId()).equals(Status.INACTIVE)) {
					if (event.getStatus().equals(Status.INACTIVE)) {
						event.setGenerateCounterEvent(false);
					}

				}
			}
		});
	}

	/**
	 * Method to validate the necessary RI details.
	 * 
	 * @param requestInfo
	 * @param errorMap
	 */
	private void validateRI(RequestInfo requestInfo, Map<String, String> errorMap) {
		if (null != requestInfo) {
			if(null != requestInfo.getUserInfo()) {
				if ((StringUtils.isEmpty(requestInfo.getUserInfo().getUuid()))
						|| (CollectionUtils.isEmpty(requestInfo.getUserInfo().getRoles()))
						|| (StringUtils.isEmpty(requestInfo.getUserInfo().getTenantId()))) {
					errorMap.put(ErrorConstants.MISSING_ROLE_USERID_CODE, ErrorConstants.MISSING_ROLE_USERID_MSG);
				}
			}else {
				errorMap.put(ErrorConstants.MISSING_USR_INFO_CODE, ErrorConstants.MISSING_USR_INFO_MSG);
			}

		} else {
			errorMap.put(ErrorConstants.MISSING_REQ_INFO_CODE, ErrorConstants.MISSING_REQ_INFO_MSG);
		}
		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}

	}

	/**
	 * Does a sanity check on the event data entered as part of the create/update.
	 * 
	 * @param requestInfo
	 * @param event
	 * @param errorMap
	 */
	private void validateEventData(RequestInfo requestInfo, Event event, Map<String, String> errorMap, Map<String, List<String>> eventMaster, Boolean isCreate) {
		if (null != event.getEventDetails()) {
			if(null !=  event.getEventDetails().getFromDate() && null != event.getEventDetails().getToDate()) {
				if (event.getEventDetails().getFromDate() > event.getEventDetails().getToDate()) {
					errorMap.put(ErrorConstants.INVALID_EVENT_DATE_CODE, ErrorConstants.INVALID_EVENT_DATE_MSG);
				}
				if(isCreate) {
					if(event.getEventDetails().getFromDate() < new Date().getTime() 
							|| event.getEventDetails().getToDate() < new Date().getTime()) {
						errorMap.put(ErrorConstants.INVALID_FROM_TO_DATE_CODE, ErrorConstants.INVALID_FROM_TO_DATE_MSG);
					}
				}
			}
		}
		if(null != event.getRecepient()) {
			if (!CollectionUtils.isEmpty(event.getRecepient().getToRoles())) {
				if (event.getRecepient().getToRoles().contains(UserEventsConstants.ALL_KEYWORD)
						&& (event.getRecepient().getToRoles().size() > 1)) {
					if ((event.getRecepient().getToRoles().size() > 1)
							|| !CollectionUtils.isEmpty(event.getRecepient().getToUsers())) {
						errorMap.put(ErrorConstants.MEN_INVALID_TOROLE_ALL_CODE, ErrorConstants.MEN_INVALID_TOROLE_ALL_MSG);
					}
				}
				event.getRecepient().getToRoles().forEach(role -> {
					Pattern p = Pattern.compile(UserEventsConstants.REGEX_FOR_SPCHARS_EXCEPT_DOT);
					Matcher m = p.matcher(role);
					if (m.find()) {
						errorMap.put(ErrorConstants.MEN_INVALID_TOROLE_CODE, ErrorConstants.MEN_INVALID_TOROLE_MSG);
					}
				});
			}

			if (!CollectionUtils.isEmpty(event.getRecepient().getToUsers())) {
				event.getRecepient().getToUsers().forEach(user -> {
					try {
						UUID.fromString(user);
					} catch (Exception e) {
						errorMap.put(ErrorConstants.MEN_INVALID_TOUSER_CODE, ErrorConstants.MEN_INVALID_TOUSER_MSG);
					}
				});
			}
		}

		validateMDMSData(requestInfo, event, errorMap, eventMaster);
	}

	/**
	 * Fetches data from MDMS and performs validations based on the retrieved data.
	 * 
	 * @param requestInfo
	 * @param event
	 * @param errorMap
	 */
	private void validateMDMSData(RequestInfo requestInfo, Event event, Map<String, String> errorMap, Map<String, List<String>> eventMaster) {
		List<String> eventTypes = eventMaster.get(UserEventsConstants.MEN_MDMS_EVENTMASTER_CODE);
		List<String> eventCategories = eventMaster.get(UserEventsConstants.MEN_MDMS_EVENTCATEGORY_MASTER_CODE);
		if (!CollectionUtils.isEmpty(eventTypes) && !CollectionUtils.isEmpty(eventCategories)) {
			if (!eventTypes.contains(event.getEventType()))
				errorMap.put(ErrorConstants.MEN_INVALID_EVENTTYPE_CODE, ErrorConstants.MEN_INVALID_EVENTTYPE_MSG);
			else {
				if (event.getEventType().equals(UserEventsConstants.MEN_MDMS_EVENTSONGROUND_CODE)) {
					if(!StringUtils.isEmpty(event.getEventCategory())) {
						if(eventCategories.contains(event.getEventCategory())) {
							if (null == event.getEventDetails()) {
								errorMap.put(ErrorConstants.MEN_UPDATE_EVENTDETAILS_MANDATORY_CODE, ErrorConstants.MEN_UPDATE_EVENTDETAILS_MANDATORY_MSG);
							} else if (event.getEventDetails().isEmpty(event.getEventDetails())) {
								errorMap.put(ErrorConstants.MEN_UPDATE_EVENTDETAILS_MANDATORY_CODE, ErrorConstants.MEN_UPDATE_EVENTDETAILS_MANDATORY_MSG);
							}
							if (StringUtils.isEmpty(event.getName())) {
								errorMap.put(ErrorConstants.MEN_CREATE_NAMEMANDATORY_CODE, ErrorConstants.MEN_CREATE_NAMEMANDATOR_MSG);
							}
						}else {
							errorMap.put(ErrorConstants.MEN_INVALID_CATEGORYMANDATORY_CODE, ErrorConstants.MEN_INVALID_CATEGORYMANDATORY_MSG);
						}
						
					}else {
						errorMap.put(ErrorConstants.MEN_CREATE_CATEGORYMANDATORY_CODE, ErrorConstants.MEN_CREATE_CATEGORYMANDATORY_MSG);
					}
				}
				
				if(event.getEventType().equals(UserEventsConstants.MEN_MDMS_BROADCAST_CODE )) {
					if (StringUtils.isEmpty(event.getName())) {
						errorMap.put(ErrorConstants.MEN_CREATE_NAMEMANDATORY_CODE, ErrorConstants.MEN_CREATE_NAMEMANDATOR_MSG);
					}
					if (null == event.getEventDetails()) {
						errorMap.put(ErrorConstants.MEN_UPDATE_EVENTDETAILS_MANDATORY_CODE,
								ErrorConstants.MEN_UPDATE_EVENTDETAILS_MANDATORY_MSG);
					} else if (null == event.getEventDetails().getFromDate()) {
						errorMap.put(ErrorConstants.MEN_BROADCAST_ED_FD_MANDATORY_CODE, ErrorConstants.MEN_BROADCAST_ED_FD_MANDATORY_MSG);
					}
				}

			}
		} else {
			throw new CustomException(ErrorConstants.MEN_NO_DATA_MDMS_CODE, ErrorConstants.MEN_NO_DATA_MDMS_MSG);
		}
	}

}
