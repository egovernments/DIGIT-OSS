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

package org.egov.commons.consumers;

import java.util.Map;

import org.egov.commons.config.ApplicationProperties;
import org.egov.commons.service.CalendarYearService;
import org.egov.commons.web.contract.CalendarYearRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CalendarYearConsumer {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private CalendarYearService calendarYearService;

    @KafkaListener(topics = { "${kafka.topics.calendaryear.create.name}", "${kafka.topics.calendaryear.update.name}" })
    public void listen(final Map<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) final String topic) {
        log.info("record :: " + record);
        try {
            if (applicationProperties.getCreateCalendarYearTopicName().equals(topic))
                calendarYearService.create(objectMapper.convertValue(record, CalendarYearRequest.class));
            else if (applicationProperties.getUpdateCalendarYearTopicName().equals(topic))
                calendarYearService.update(objectMapper.convertValue(record, CalendarYearRequest.class));
        } catch (final Exception exception) {
            log.debug("processMessage:" + exception);
            throw new CustomException("ERROR_PROCESSING_RECORD", exception.getMessage());
        }

    }
}
