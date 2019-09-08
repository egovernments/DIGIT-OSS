package org.egov.userevent.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.userevent.model.RecepientEvent;
import org.egov.userevent.web.contract.Event;
import org.egov.userevent.web.contract.EventSearchCriteria;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class UserEventsUtils {
	
	
	
	/**
	 * This method is very crucial for searching events. From the available search criteria, this method builds all possible combinations of recepients
	 * so that the events addressed to all those can be retrieved. 
	 * For instance, a CITIZEN with id: 10 belonging to amritsar trying to search for events should get all the events in the system addressed to:
	 * CITIZEN|*|*, *|CITIZEN|*, *|*|pb.amritsar, CITIZEN|CITIZEN|*, *|CITIZEN|pb.amritsar, CITIZEN|*|pb.amritsar, CITIZEN|CITIZEN|pb.amritsar, userId - 10, All.
	 * 
	 * The format being - TYPE|ROLE|TENANTID, * is used to indicate 'Any'. A keyword 'All' indicates that the event is addressed to everyone.
	 * 
	 *
	 * @param criteria
	 */
	public void buildRecepientListForSearch(EventSearchCriteria criteria) {
		List<String> recepients = new ArrayList<>();
		if (!CollectionUtils.isEmpty(criteria.getUserids()))
			criteria.getUserids().forEach(user -> recepients.add(user));

		if (!CollectionUtils.isEmpty(criteria.getRoles())) {
			criteria.getRoles().forEach(role -> {
				role = role.replaceAll("\\.", "|"); //delimiter in the input is a dot, we convert it to pipe internally.
				String[] typeAndRole = role.split("[|]");
				recepients.add(typeAndRole[0] + "|*|*");
				recepients.add("*|" + typeAndRole[1] + "|*");
				recepients.add(role + "|*");
				if (!StringUtils.isEmpty(criteria.getTenantId())) {
					recepients.add(typeAndRole[0] +"|*|"+criteria.getTenantId());
					recepients.add("*|"+ typeAndRole[1] + "|" +criteria.getTenantId());
					recepients.add(role + "|" + criteria.getTenantId());
				}
					
			});
		}
		if (!StringUtils.isEmpty(criteria.getTenantId())) {
			recepients.add("*|*|" + criteria.getTenantId());
		}
		recepients.add(UserEventsConstants.ALL_KEYWORD);

		criteria.setRecepients(recepients);
	}

	
	/**
	 * This method is used to populate recepientEventMap in create and update flow. The logic is as follows:
	 * 1. If both toUser and toRoles are empty, the event is assumed to be addressed to the ULB to which the event belongs to.
	 * 2. if toUsers is non-empty, toRoles irrespective of its values is discarded. toUsers will always take precedence.
	 * 3. if toRoles is non-empty and toUsers is empty, the values of toRoles are coupled with tenantId, '.' is replaced with '|'
	 * to build a list of recepients and store the same in the db, this intermediate list of recepients is introduced to make searches faster.
	 * 
	 * every value of toRoles is of the format - TYPE.ROLE (TYPE.*, *.ROLE etc is also valid)
	 * 
	 * @param event
	 * @param recepientEventList
	 */
	public void manageRecepients(Event event, List<RecepientEvent> recepientEventList) {
		if(null != event.getRecepient()) {
			if (CollectionUtils.isEmpty(event.getRecepient().getToUsers())
					&& CollectionUtils.isEmpty(event.getRecepient().getToRoles())) {
				RecepientEvent rcpntevent = RecepientEvent.builder().recepient("*|*|" + event.getTenantId())
						.eventId(event.getId()).build();
				recepientEventList.add(rcpntevent);
			} else {
				if (!CollectionUtils.isEmpty(event.getRecepient().getToUsers())) {
					if(!CollectionUtils.isEmpty(event.getRecepient().getToRoles()))
						event.getRecepient().getToRoles().clear();
					if (!CollectionUtils.isEmpty(event.getRecepient().getToUsers())) {
						event.getRecepient().getToUsers().forEach(user -> {
							RecepientEvent rcpntevent = RecepientEvent.builder().recepient(user).eventId(event.getId())
									.build();
							recepientEventList.add(rcpntevent);
						});
					}
				} // toUsers will take precedence over toRoles.
				else {
					if (!CollectionUtils.isEmpty(event.getRecepient().getToRoles())) {
						if(!event.getRecepient().getToRoles().contains(UserEventsConstants.ALL_KEYWORD)) {
							event.getRecepient().getToRoles().forEach(role -> {
								role = role.replaceAll("\\.", "|");
								role = role + "|" + event.getTenantId();
								RecepientEvent rcpntevent = RecepientEvent.builder().recepient(role).eventId(event.getId())
										.build();
								recepientEventList.add(rcpntevent);
							});
						}else {
							RecepientEvent rcpntevent = RecepientEvent.builder().recepient(UserEventsConstants.ALL_KEYWORD).eventId(event.getId())
									.build();
							recepientEventList.add(rcpntevent);
						}
					}
				}
			}
		}else {
			RecepientEvent rcpntevent = RecepientEvent.builder().recepient("*|*|" + event.getTenantId())
					.eventId(event.getId()).build();
			recepientEventList.add(rcpntevent);
		}

	}
	
	
	/**
	 * Enhancement for multi-tenancy: Checks if the user trying to search the event has access to search events in that tenant or not.
	 * 
	 * @param tenantId
	 * @param userInfo
	 * @return
	 */
	public Boolean doesTheEmployeeHaveAccessToThisTenant(String tenantId, User userInfo) {
		List<String> roles = userInfo.getRoles().stream().filter(obj -> obj.getCode().equals(tenantId)).map(Role :: getCode).collect(Collectors.toList());
		for(String role: roles) {
			Arrays.asList(UserEventsConstants.VALID_ROLES_FOR_SEARCH).contains(role);
			return true;
		}
		return false;
	}
	
	
	/**
	 * When it comes to BROADCAST, we have to consider the next day for validation.
	 * This method returns epoch of the 24hrs later from the current instance.
	 * 
	 * @return
	 */
	public Long getTomorrowsEpoch() {
	    Calendar calendar = Calendar.getInstance();	    	 
	    calendar.add(Calendar.DAY_OF_YEAR, 1);
	    Date tomorrow = calendar.getTime();
	    
	    return tomorrow.getTime();
	}

}
