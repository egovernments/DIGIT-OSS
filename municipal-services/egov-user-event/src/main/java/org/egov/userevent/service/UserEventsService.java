/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.userevent.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.userevent.config.PropertiesManager;
import org.egov.userevent.model.AuditDetails;
import org.egov.userevent.model.LATWrapper;
import org.egov.userevent.model.LastAccesDetails;
import org.egov.userevent.model.RecepientEvent;
import org.egov.userevent.model.enums.Status;
import org.egov.userevent.producer.UserEventsProducer;
import org.egov.userevent.repository.UserEventRepository;
import org.egov.userevent.utils.ResponseInfoFactory;
import org.egov.userevent.utils.UserEventsConstants;
import org.egov.userevent.utils.UserEventsUtils;
import org.egov.userevent.web.contract.Event;
import org.egov.userevent.web.contract.EventRequest;
import org.egov.userevent.web.contract.EventResponse;
import org.egov.userevent.web.contract.EventSearchCriteria;
import org.egov.userevent.web.contract.NotificationCountResponse;
import org.egov.userevent.web.validator.UserEventsValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@Service
public class UserEventsService {

	@Autowired
	private PropertiesManager properties;

	@Autowired
	private UserEventsProducer producer;

	@Autowired
	private ResponseInfoFactory responseInfo;

	@Autowired
	private UserEventsValidator validator;

	@Autowired
	private UserEventRepository repository;

	@Autowired
	private UserEventsUtils utils;

	@Autowired
	private LocalizationService localizationService;

	/**
	 * Service method to create events Enriches the request and produces it on the
	 * queue for persister to pick.
	 * 
	 * @param request
	 * @return
	 */
	public EventResponse createEvents(EventRequest request, Boolean isCounterEvent) {
		if (!isCounterEvent)
			validator.validateCreateEvent(request, true);
		log.info("enriching and storing the event......");
		enrichCreateEvent(request);
		producer.push(properties.getSaveEventsPersisterTopic(), request);
		request.getEvents().forEach(event -> event.setRecepientEventMap(null));
		return EventResponse.builder()
				.responseInfo(responseInfo.createResponseInfoFromRequestInfo(request.getRequestInfo(), true))
				.events(request.getEvents()).build();
	}

	/**
	 * Service method to update the events. Enriches the request and produces it on
	 * the queue for persister to pick. This method also creates counter events the
	 * following scenario: 1. When an ACTIVE event is made INACTIVE or CANCELLED.
	 * (Counter event on delete) 2. When details an event irrespective of what
	 * status does it have, are updated. (Counter event on update)
	 * 
	 * @param request
	 * @return
	 */
	public EventResponse updateEvents(EventRequest request) {
		validator.validateUpdateEvent(request);
		log.info("enriching and updating the event......");
		enrichUpdateEvent(request);
		List<Event> counterEvents = new ArrayList<>();
		request.getEvents().forEach(event -> {
			Boolean isCounterEventReq = true;
			if (event.getEventType().equals(UserEventsConstants.MEN_MDMS_EVENTSONGROUND_CODE)
					&& (null == event.getGenerateCounterEvent() || event.getGenerateCounterEvent())) {
				Event counterEvent = buildCounterEvents(request.getRequestInfo(), event, isCounterEventReq);
				if (null != counterEvent) {
					counterEvents.add(counterEvent);
				}
			}
		});
		if (!CollectionUtils.isEmpty(counterEvents)) {
			EventRequest req = EventRequest.builder().requestInfo(request.getRequestInfo()).events(counterEvents)
					.build();
			log.info("Generating counter events.....");
			createEvents(req, true);
		}
		producer.push(properties.getUpdateEventsPersisterTopic(), request);
		request.getEvents().forEach(event -> {
			event.setRecepientEventMap(null);
			event.setGenerateCounterEvent(null);
		});

		return EventResponse.builder()
				.responseInfo(responseInfo.createResponseInfoFromRequestInfo(request.getRequestInfo(), true))
				.events(request.getEvents()).build();
	}

	/**
	 * Builds counter event on update or delete of an event.
	 * 
	 * 
	 * @param requestInfo
	 * @param event
	 * @param isCounterEventReq
	 * @return
	 */
	private Event buildCounterEvents(RequestInfo requestInfo, Event event, Boolean isCounterEventReq) {
		String description = null;
		Event counterEvent = new Event();
		String tenanId = properties.getIsLocalizationStateLevel() ? event.getTenantId().split("\\.")[0]
				: event.getTenantId();
		Map<String, String> localisedMsgs = localizationService.getLocalisedMessages(requestInfo, tenanId, "en_IN",
				UserEventsConstants.LOCALIZATION_MODULE_NAME);
		if (event.getStatus().equals(Status.INACTIVE) || event.getStatus().equals(Status.CANCELLED)) {
			if (null != event.getEventDetails().getFromDate()
					&& new Date().getTime() < event.getEventDetails().getFromDate()) {
				description = localisedMsgs.get(UserEventsConstants.LOCALIZATION_COUNTEREVENT_ONDELETE_CODE)
						.replace("<event_name>", event.getName());
			} else {
				isCounterEventReq = false;
			}
		} else {
			description = localisedMsgs.get(UserEventsConstants.LOCALIZATION_COUNTEREVENT_ONUPDATE_CODE)
					.replace("<event_name>", event.getName());
		}
		if (isCounterEventReq) {
			counterEvent.setActions(event.getActions());
			counterEvent.setEventCategory(event.getEventCategory());
			counterEvent.setEventDetails(event.getEventDetails());
			counterEvent.setReferenceId(event.getId());
			counterEvent.setName(description);
			counterEvent.setEventType(event.getEventType());
			counterEvent.setRecepient(event.getRecepient());
			counterEvent.setSource(event.getSource());
			counterEvent.setTenantId(event.getTenantId());
			counterEvent.setRecepientEventMap(event.getRecepientEventMap());
			counterEvent.setDescription(event.getDescription());
		} else {
			counterEvent = null;
		}

		return counterEvent;
	}

	/**
	 * Service method to search all the events. This method is used to perform
	 * normal search and also as a helper method during validation of the upate
	 * flow.
	 * 
	 * @param requestInfo
	 * @param criteria
	 * @param isUpdate
	 * @return
	 */
	public EventResponse searchEvents(RequestInfo requestInfo, EventSearchCriteria criteria, Boolean isUpdate) {
		validator.validateSearch(requestInfo, criteria);
		log.info("Searching events......");
		List<Event> events = new ArrayList<>();
		Integer totalCount = 0;
		if (!isUpdate) {
			enrichSearchCriteria(requestInfo, criteria);
			events = repository.fetchEvents(criteria);
			totalCount = repository.fetchTotalEventCount(criteria);
			searchPostProcessor(requestInfo, events);
			if (null != criteria.getIsCitizenSearch()) {
				if (criteria.getIsCitizenSearch())
					events = citizenSearchPostProcessor(events, criteria);
			}
		} else {
			events = repository.fetchEvents(criteria);
			totalCount = repository.fetchTotalEventCount(criteria);
		}


		if(requestInfo.getUserInfo().getType().equalsIgnoreCase("SYSTEM")){
			events = getFilterEventsforOpenSearch(events);
			totalCount = events.size();
		}


		return EventResponse.builder().responseInfo(responseInfo.createResponseInfoFromRequestInfo(requestInfo, true))
				.events(events).totalCount(totalCount).build();
	}

	public List<Event> getFilterEventsforOpenSearch(List<Event> events){
		List<Event> filterEvents = new ArrayList<>();
		for(Event event: events){
			if(event.getEventType().equalsIgnoreCase(UserEventsConstants.MEN_MDMS_EVENTSONGROUND_CODE))
				filterEvents.add(event);
			else if(event.getEventType().equalsIgnoreCase(UserEventsConstants.MEN_MDMS_BROADCAST_CODE))
				filterEvents.add(event);
			else if(event.getEventType().equalsIgnoreCase(UserEventsConstants.MEN_MDMS_SYSTEMGENERATED_CODE)){
				if(event.getName().equalsIgnoreCase(UserEventsConstants.SURVEY_EVENT_NAME) || event.getName().equalsIgnoreCase(UserEventsConstants.DOCUMENT_EVENT_NAME))
					filterEvents.add(event);
			}
			else
				continue;
		}
		return filterEvents;
	}

	/**
	 * Deduplicates all the EVENTSONGROUND which have a counter event generated.
	 * However, if the request is specifically for EVENTSONGROUND, then all the
	 * events and counter-events are returned. Sort on fromDate for EVENTSONGROUND,
	 * for others sort on createddate.
	 * 
	 * @param events
	 * @param criteria
	 */
	public List<Event> citizenSearchPostProcessor(List<Event> events, EventSearchCriteria criteria) {
		events = events.stream()
				.filter(obj -> (obj.getEventType().equals(UserEventsConstants.MEN_MDMS_BROADCAST_CODE)
						&& obj.getStatus().equals(Status.ACTIVE))
						|| (obj.getEventType().equals(UserEventsConstants.MEN_MDMS_EVENTSONGROUND_CODE)
								|| obj.getEventType().equals(UserEventsConstants.MEN_MDMS_SYSTEMGENERATED_CODE)))
				.collect(Collectors.toList()); // Everything except inactive BROADCASTs by default.

		if (!CollectionUtils.isEmpty(criteria.getEventTypes())) {
			Set<String> types = criteria.getEventTypes().stream().collect(Collectors.toSet());
			if (types.size() == 1 && types.contains(UserEventsConstants.MEN_MDMS_EVENTSONGROUND_CODE)) {
				Collections.sort(events, Event.getFromDateComparatorForEvents()); // on fromDate - custom comparator.
			} // searching for only EVENTSONGROUND which returns events and their
				// counter-events with a different sorted order.
		} else {
			List<Event> counterEvents = events.stream().filter(obj -> !StringUtils.isEmpty(obj.getReferenceId()))
					.collect(Collectors.toList());
			List<String> refIds = counterEvents.stream().map(Event::getReferenceId).collect(Collectors.toList());
			events.forEach(event -> {
				if (!refIds.contains(event.getId()))
					counterEvents.add(event);
			});
			events = counterEvents;
			Collections.sort(events, Event.getCreatedDateComparator()); // on createdDate - custom comparator.
		} // default CITIZEN search which de-duplicates and returns in default sort order.

		return events;

	}

	/**
	 * This method performs certain post processing activities on the searc result:
	 * 1. Finds all the events in the search result that have toDate prior to currentDate and marks them inactive
	 * 2. The inactive marking is done through an update call just before returning the search result.
	 * 3. Uses lazy update logic instead of a cron job to set events to inactive when they have already occured.
	 * 
	 * @param requestInfo
	 * @param events
	 * @return
	 */
	public void searchPostProcessor(RequestInfo requestInfo, List<Event> events){
		List<Event> eventsTobeUpdated = new ArrayList<>();
		events.forEach(event -> {
			Boolean tobeAdded = false;
			if(null != event.getEventDetails() && !event.getStatus().equals(Status.CANCELLED)) {
				if(event.getEventType().equals(UserEventsConstants.MEN_MDMS_BROADCAST_CODE)) {				
					if(null != event.getEventDetails().getFromDate()) {
						if((event.getEventDetails().getFromDate() <= utils.getTomorrowsEpoch()) && event.getStatus().equals(Status.INACTIVE)) {
							event.setStatus(Status.ACTIVE);
							tobeAdded = true;
						}
					}
					if(null != event.getEventDetails().getToDate() ) {
						if((event.getEventDetails().getToDate() < utils.getTomorrowsEpoch() && event.getStatus().equals(Status.ACTIVE))) {
							event.setStatus(Status.INACTIVE);
							tobeAdded = true;
						}
					}
					
					if((null != event.getEventDetails().getFromDate()) && (null != event.getEventDetails().getToDate())) {
						if(event.getEventDetails().getFromDate().equals(event.getEventDetails().getToDate())) {
							Long dateInSecs = event.getEventDetails().getFromDate() / 1000;
							Long currDateInSecs = new Date().getTime() / 1000;
							if((((dateInSecs - 86400) < currDateInSecs) && (currDateInSecs < dateInSecs)) && event.getStatus().equals(Status.INACTIVE)) {
								event.setStatus(Status.ACTIVE);
								tobeAdded = true;
							}else {
								if(event.getStatus().equals(Status.ACTIVE)) {
									event.setStatus(Status.INACTIVE);
									tobeAdded = true;
								}
							}
						}// UI sends EOD epoch, which makes fromDate and toDate same incase of 1 day event, which is why the range is manually calculated. Fix at UI needed.
					}
				}// BROADCASTs are ACTIVE only between the given from and to date, they're INACTIVE beyond that.
				
				else {
					if(null != event.getEventDetails().getToDate()) {
						if((event.getEventDetails().getToDate() < new Date().getTime())) {
							event.setStatus(Status.INACTIVE);
							tobeAdded = true;
						}
					}
				}
				
				if(tobeAdded) {
					event.setInternallyUpdted(true);
					eventsTobeUpdated.add(event);
				}
			}
		});
		if(!CollectionUtils.isEmpty(eventsTobeUpdated)) {
			EventRequest request = EventRequest.builder().requestInfo(requestInfo).events(eventsTobeUpdated).build();
			try {
				log.info("Updating events...");
				updateEvents(request);
			}catch(Exception e) {
				log.error("There was an error while lazy-updating the events: ", e);
			}
		}
	}

	/**
	 * Service method to fetch count of events as per criteria.
	 * 
	 * @param requestInfo
	 * @param criteria
	 * @return
	 */
	public NotificationCountResponse fetchCount(RequestInfo requestInfo, EventSearchCriteria criteria) {
		validator.validateSearch(requestInfo, criteria);
		enrichSearchCriteria(requestInfo, criteria);
		NotificationCountResponse response = repository.fetchCount(criteria);
		response.setResponseInfo(responseInfo.createResponseInfoFromRequestInfo(requestInfo, true));
		return response;
	}

	/**
	 * Service method used to persist the lastaccesstime of the user.
	 * 
	 * @param requestInfo
	 * @return
	 */
	public ResponseInfo persistLastAccessTime(RequestInfo requestInfo) {
		LastAccesDetails loginDetails = LastAccesDetails.builder().userId(requestInfo.getUserInfo().getUuid())
				.lastAccessTime(new Date().getTime()).build();
		LATWrapper wrapper = LATWrapper.builder().lastAccessDetails(loginDetails).build();
		producer.push(properties.getLatDetailsTopic(), wrapper);

		return responseInfo.createResponseInfoFromRequestInfo(requestInfo, true);

	}

	/**
	 * Method to enrich the create request by setting ids, status, auditDetails etc.
	 * This method also populates a field called recepientEventMap, which is a
	 * mapping between the particular event and its recipients in a specific format.
	 * 
	 * @param request
	 */
	private void enrichCreateEvent(EventRequest request) {
		request.getEvents().forEach(event -> {
			event.setId(UUID.randomUUID().toString());
			if (null != event.getActions()) {
				event.getActions().setId(UUID.randomUUID().toString());
				event.getActions().setEventId(event.getId());
				event.getActions().setTenantId(event.getTenantId());
			}
			if (null == event.getStatus())
				event.setStatus(Status.ACTIVE);

			if (null != event.getEventDetails()) {
				event.getEventDetails().setId(UUID.randomUUID().toString());
				event.getEventDetails().setEventId(event.getId());
				if (event.getEventType().equals(UserEventsConstants.MEN_MDMS_BROADCAST_CODE)) {
					if (null != event.getEventDetails().getFromDate()) {
						if (event.getEventDetails().getFromDate() > utils.getTomorrowsEpoch()) {
							event.setStatus(Status.INACTIVE);
						}
					}
				} // BROADCASTs are ACTIVE only between the given from and to date, they're INACTIVE beyond that.
			}

			List<RecepientEvent> recepientEventList = new ArrayList<>();
			utils.manageRecepients(event, recepientEventList);
			event.setRecepientEventMap(recepientEventList);

			if (!StringUtils.isEmpty(event.getPostedBy())) {
				if (!Arrays.asList(UserEventsConstants.INTEGRATED_MODULES).contains(event.getPostedBy())) {
					event.setPostedBy(request.getRequestInfo().getUserInfo().getUuid());
				}
			} else {
				event.setPostedBy(request.getRequestInfo().getUserInfo().getUuid());
			}

			AuditDetails auditDetails = AuditDetails.builder()
					.createdBy(request.getRequestInfo().getUserInfo().getUuid()).createdTime(new Date().getTime())
					.lastModifiedBy(request.getRequestInfo().getUserInfo().getUuid())
					.lastModifiedTime(new Date().getTime()).build();

			event.setAuditDetails(auditDetails);

		});
	}

	/**
	 * Method to enrich the update request by setting ids, status, auditDetails etc.
	 * This method also populates a field called recepientEventMap, which is a
	 * mapping between the particular event and its recipients in a specific format.
	 * 
	 * @param request
	 */
	private void enrichUpdateEvent(EventRequest request) {
		request.getEvents().forEach(event -> {
			if (null != event.getActions()) {
				if (StringUtils.isEmpty(event.getActions().getId())) {
					event.setId(UUID.randomUUID().toString());
					event.getActions().setId(UUID.randomUUID().toString());
					event.getActions().setEventId(event.getId());
					event.getActions().setTenantId(event.getTenantId());
				}
			}
			if (null != event.getEventDetails()) {
				if (StringUtils.isEmpty(event.getEventDetails().getId())) {
					event.getEventDetails().setId(UUID.randomUUID().toString());
					event.getEventDetails().setEventId(event.getId());
				}
				if (event.getEventType().equals(UserEventsConstants.MEN_MDMS_BROADCAST_CODE)) {
					if (null != event.getEventDetails().getFromDate()) {
						if (event.getEventDetails().getFromDate() > utils.getTomorrowsEpoch()) {
							event.setStatus(Status.INACTIVE);
						}
					}
				} // BROADCASTs are ACTIVE only between the given from and to date, they're INACTIVE beyond that.
			}
			List<RecepientEvent> recepientEventList = new ArrayList<>();
			utils.manageRecepients(event, recepientEventList);
			event.setRecepientEventMap(recepientEventList);

			AuditDetails auditDetails = event.getAuditDetails();
			if(null != event.getInternallyUpdted()) {
				if(event.getInternallyUpdted()) {
					auditDetails = event.getAuditDetails();
				}else {
					auditDetails.setLastModifiedBy(request.getRequestInfo().getUserInfo().getUuid());
					auditDetails.setLastModifiedTime(new Date().getTime());
				}
			}else {
				auditDetails.setLastModifiedBy(request.getRequestInfo().getUserInfo().getUuid());
				auditDetails.setLastModifiedTime(new Date().getTime());
			}
			

			event.setAuditDetails(auditDetails);

		});
	}

	/**
	 * Method to enrich search criteria based on role as follows: 1. Incase of
	 * CITIZEN, criteria is enriched using the userInfo present in RI. 2. For
	 * EMPLOYEE, events posted in his tenant will be returned by default. Note - the
	 * filter on tenantId will mean as: 'Events addressed to this tenant' in case of
	 * CITIZEN search. 'Events created through this tenant' in case of EMPLOYEE
	 * search.
	 * 
	 * This method also derives a list of recipients in a specified format from the
	 * criteria to build search clause for the query.
	 * 
	 * 
	 * @param requestInfo
	 * @param criteria
	 */
	private void enrichSearchCriteria(RequestInfo requestInfo, EventSearchCriteria criteria) {
		List<String> statuses = new ArrayList<>();
		if ( requestInfo.getUserInfo() != null && requestInfo.getUserInfo().getType().equals("CITIZEN")) {
			if (!CollectionUtils.isEmpty(criteria.getUserids()))
				criteria.getUserids().clear();
			if (!CollectionUtils.isEmpty(criteria.getRoles()))
				criteria.getRoles().clear();

			List<String> userIds = new ArrayList<>();
			List<String> roles = new ArrayList<>();
			userIds.add(requestInfo.getUserInfo().getUuid());
			roles.add("CITIZEN.CITIZEN");
			criteria.setUserids(userIds);
			criteria.setRoles(roles);
			criteria.setIsCitizenSearch(true);
		} else {
			criteria.setIsCitizenSearch(false);
		}
		if (CollectionUtils.isEmpty(criteria.getStatus())) {
			statuses.add("ACTIVE");
			statuses.add("INACTIVE");
			criteria.setStatus(statuses);

		}

		if (criteria.getIsCitizenSearch()) {
			if (!CollectionUtils.isEmpty(criteria.getUserids()) || !CollectionUtils.isEmpty(criteria.getRoles())
					|| !StringUtils.isEmpty(criteria.getTenantId())) {
				utils.buildRecepientListForSearch(criteria);
			}
		}

		log.info("recepeients: " + criteria.getRecepients());
		log.info("Search Criteria: " + criteria);
	}

}