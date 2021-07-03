/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.empernments.org
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
 *  In case of any queries, you can reach eGovernments Foundation at contact@empernments.org.
 */

package org.egov.userevent.config;

import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PropertiesManager {
	
	//Hosts and Endpoints
	@Value("${egov.mdms.host}")
	public String mdmsHost;
	
	@Value("${egov.mdms.search.endpoint}")
	public String mdmsSearchEndpoint;
	
	@Value("${egov.localisation.host}")
	public String localisationHost;
	
	@Value("${egov.localisation.search.endpoint}")
	public String localisationSearchEndpoint;
	
	
	
	
	//Kafka Topics
	@Value("${kafka.topics.persister.save.events}")
	public String saveEventsPersisterTopic;
	
	@Value("${kafka.topics.persister.update.events}")
	public String updateEventsPersisterTopic;
	
	@Value("${kafka.topics.lat.details}")
	public String latDetailsTopic;
	
	@Value("${kafka.topics.save.events}")
	public String saveEventsTopic;
	
	@Value("${kafka.topics.update.events}")
	public String updateEventsTopic;
	
	
	//Variables
	@Value("${mseva.notif.search.offset}")
	public Long defaultOffset;
	
	@Value("${mseva.notif.search.limit}")
	public Long defaultLimit;
	
	@Value("${egov.localisation.is.statelevel}")
	public Boolean isLocalizationStateLevel;
}