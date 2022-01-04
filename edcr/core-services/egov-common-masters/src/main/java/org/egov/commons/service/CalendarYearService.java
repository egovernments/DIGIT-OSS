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

package org.egov.commons.service;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import org.egov.commons.config.ApplicationProperties;
import org.egov.commons.model.CalendarYear;
import org.egov.commons.repository.CalendarYearRepository;
import org.egov.commons.web.contract.CalendarYearGetRequest;
import org.egov.commons.web.contract.CalendarYearRequest;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CalendarYearService {

    @Autowired
    private CalendarYearRepository calendarYearRepository;

    @Autowired
    private LogAwareKafkaTemplate<String, Object> kafkaTemplate;
    
    @Autowired
    private ApplicationProperties applicationProperties;


    public CalendarYear pushCreateToQueue(final CalendarYearRequest calendarYearRequest) {
        try {
            kafkaTemplate.send(applicationProperties.getCreateCalendarYearTopicName(), calendarYearRequest);
        } catch (final Exception ex) {
            log.error("Exception Encountered : " + ex);
        }

        return calendarYearRequest.getCalendarYear();
    }
    
    public CalendarYear pushUpdateToQueue(final CalendarYearRequest calendarYearRequest) {
        try {
            kafkaTemplate.send(applicationProperties.getUpdateCalendarYearTopicName(), calendarYearRequest);
        } catch (final Exception ex) {
            log.error("Exception Encountered : " + ex);
        }

        return calendarYearRequest.getCalendarYear();
    }

    public CalendarYearRequest create(final CalendarYearRequest calendarYearRequest) {
        return calendarYearRepository.create(calendarYearRequest);

    }
    
    public CalendarYearRequest update(final CalendarYearRequest calendarYearRequest) {
        return calendarYearRepository.update(calendarYearRequest);

    }

    public List<CalendarYear> getCalendarYears(final CalendarYearGetRequest calendarYearGetRequest) {
        return calendarYearRepository.findForCriteria(calendarYearGetRequest);
    }

    public List<CalendarYear> getFutureYears(final CalendarYearGetRequest calendarYearGetRequest) {
        final Date date = new Date();
        final Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        final int year = calendar.get(Calendar.YEAR);
        return calendarYearRepository.findFutureYear(calendarYearGetRequest, year);
    }

    public boolean getYearByNameAndDate(final int name, final Date givenDate, final String tenantId) {
        return calendarYearRepository.checkYearByNameAndDate(name, givenDate, tenantId);
    }

    public boolean getYearByName(final int name, final String tenantId) {
        return calendarYearRepository.checkYearByName(name, tenantId);
    }
    
    public boolean getYearByNameAndId(final Long id,final int name, final String tenantId) {
        return calendarYearRepository.checkYearByNameAndId(id,name, tenantId);
    }

}