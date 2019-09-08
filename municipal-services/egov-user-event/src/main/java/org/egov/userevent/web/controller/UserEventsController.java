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

package org.egov.userevent.web.controller;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.userevent.model.RequestInfoWrapper;
import org.egov.userevent.service.UserEventsService;
import org.egov.userevent.web.contract.EventRequest;
import org.egov.userevent.web.contract.EventResponse;
import org.egov.userevent.web.contract.EventSearchCriteria;
import org.egov.userevent.web.contract.NotificationCountResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/v1/events/")
public class UserEventsController {
	
	@Autowired
	private UserEventsService service;
	
	
	/**
	 * Endpoint to create events in the system.
	 * 
	 * @param topic
	 * @param indexJson
	 * @return
	 */
	@PostMapping("_create")
	@ResponseBody
	private ResponseEntity<?> create(@RequestBody @Valid EventRequest request) {
		EventResponse response = service.createEvents(request, false);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	/**
	 * Endpoint to upate events in the system.
	 * 
	 * @param topic
	 * @param indexJson
	 * @return
	 */
	@PostMapping("/_update")
	@ResponseBody
	private ResponseEntity<?> update(@RequestBody @Valid EventRequest request) {
		EventResponse response = service.updateEvents(request);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	/**
	 * Endpoint to search events in the system.
	 * 
	 * @param topic
	 * @param indexJson
	 * @return
	 */
	@PostMapping("/_search")
	@ResponseBody
	private ResponseEntity<?> search(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute @Valid EventSearchCriteria eventSearchCriteria) {
		EventResponse response = service.searchEvents(requestInfoWrapper.getRequestInfo(), eventSearchCriteria, false);
		return new ResponseEntity<>(response, HttpStatus.OK);

	}
	
	/**
	 * Endpoint to get count of notifications for a user in the system.
	 * 
	 * @param topic
	 * @param indexJson
	 * @return
	 */
	@PostMapping("/notifications/_count")
	@ResponseBody
	private ResponseEntity<?> count(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute @Valid EventSearchCriteria eventSearchCriteria) {
		NotificationCountResponse response = service.fetchCount(requestInfoWrapper.getRequestInfo(), eventSearchCriteria);
		return new ResponseEntity<>(response, HttpStatus.OK);

	}
	
	
	/**
	 * Endpoint to update the lastaccesstime of a user in the system. This required to fetch count of unread notifs through search.
	 * 
	 * @param topic
	 * @param indexJson
	 * @return
	 */
	@PostMapping("/lat/_update")
	@ResponseBody
	private ResponseEntity<?> updatellt(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper) {
		ResponseInfo response = service.persistLastAccessTime(requestInfoWrapper.getRequestInfo());
		return new ResponseEntity<>(response, HttpStatus.OK);

	}
	
}