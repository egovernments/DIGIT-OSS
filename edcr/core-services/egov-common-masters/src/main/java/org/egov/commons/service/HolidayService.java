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

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.commons.model.Holiday;
import org.egov.commons.repository.HolidayRepository;
import org.egov.commons.web.contract.HolidayGetRequest;
import org.egov.commons.web.contract.HolidayRequest;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class HolidayService {
    public static final Logger LOGGER = LoggerFactory.getLogger(HolidayService.class);

    @Autowired
    private HolidayRepository holidayRepository;

    @Autowired
    private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public List<Holiday> getHolidays(HolidayGetRequest holidayGetRequest) {
        List<Holiday> holidaysList = holidayRepository.findForCriteria(holidayGetRequest);
        if (holidayGetRequest.getEnclosedHoliday() != null && holidayGetRequest.getEnclosedHoliday()) {
            getEnclosedHolidays(holidayGetRequest, holidaysList);
        }
        return holidaysList;
    }


    public void getEnclosedHolidays(HolidayGetRequest holidayGetRequest, List<Holiday> holidaysList) {
        Calendar c1 = Calendar.getInstance();
        c1.setTime(holidayGetRequest.getFromDate());
        Calendar c2 = Calendar.getInstance();
        c2.setTime(holidayGetRequest.getToDate());

        while (c1.getTime().compareTo(c2.getTime()) <= 0) {
            if (isSunday(c1.getTime())) {
                Holiday holiday = new Holiday();
                holiday.setApplicableOn(c1.getTime());
                holiday.setName("Sunday");
                holiday.setTenantId(holidayGetRequest.getTenantId());
                holidaysList.add(holiday);
            }
            if (isSecondSaturday(c1.getTime())) {
                Holiday holiday = new Holiday();
                holiday.setApplicableOn(c1.getTime());
                holiday.setName("Second Saturday");
                holiday.setTenantId(holidayGetRequest.getTenantId());
                holidaysList.add(holiday);
            }
            c1.add(Calendar.DATE, 1);
        }

    }

    public List<Holiday> getPrefixSuffixHolidays(HolidayGetRequest holidayGetRequest) {
        Integer prefixDays = 0;
        Integer suffixDays = 0;
        List<Holiday> holidays = new ArrayList<>();
        Holiday holiday = new Holiday();
        Boolean prefixExists = true;
        Boolean suffixExists = true;

        Calendar c1 = Calendar.getInstance();
        c1.setTime(holidayGetRequest.getFromDate());
        c1.add(Calendar.DATE, -1);

        Calendar fromDate = Calendar.getInstance();
        fromDate.setTime(holidayGetRequest.getFromDate());

        while (prefixExists && (c1.YEAR == fromDate.YEAR)) {
            if ((getHolidayByApplicableOn(null, c1.getTime(), holidayGetRequest.getTenantId()) || isSunday(c1.getTime()) || isSecondSaturday(c1.getTime())) && prefixDays == 0) {
                holiday.setPrefixFromDate(c1.getTime());
                holiday.setPrefixToDate(c1.getTime());
                prefixDays++;
            } else if (getHolidayByApplicableOn(null, c1.getTime(), holidayGetRequest.getTenantId()) || isSunday(c1.getTime()) || isSecondSaturday(c1.getTime())) {
                holiday.setPrefixFromDate(c1.getTime());
                prefixDays++;
            } else {
                prefixExists = false;
            }
            c1.add(Calendar.DATE, -1);
        }

        Calendar c2 = Calendar.getInstance();
        c2.setTime(holidayGetRequest.getToDate());
        c2.add(Calendar.DATE, 1);

        Calendar toDate = Calendar.getInstance();
        toDate.setTime(holidayGetRequest.getToDate());

        while (suffixExists && (c2.YEAR == toDate.YEAR)) {
            if ((getHolidayByApplicableOn(null, c2.getTime(), holidayGetRequest.getTenantId()) || isSunday(c2.getTime()) || isSecondSaturday(c2.getTime())) && suffixDays == 0) {
                holiday.setSuffixFromDate(c2.getTime());
                holiday.setSuffixToDate(c2.getTime());
                suffixDays++;
            } else if (getHolidayByApplicableOn(null, c2.getTime(), holidayGetRequest.getTenantId()) || isSunday(c2.getTime()) || isSecondSaturday(c2.getTime())) {
                holiday.setSuffixToDate(c2.getTime());
                suffixDays++;
            } else {
                suffixExists = false;
            }
            c2.add(Calendar.DATE, 1);
        }

        holiday.setNoOfDays(prefixDays + suffixDays);
        holiday.setTenantId(holidayGetRequest.getTenantId());
        holidays.add(holiday);
        return holidays;
    }

    public Holiday createHoliday(final HolidayRequest holidayRequest) {
        kafkaTemplate.send("egov-common-holiday", holidayRequest);
        return holidayRequest.getHoliday();
    }

    public HolidayRequest create(final HolidayRequest holidayRequest) {
        if (holidayRequest.getHoliday().getId() == null)
            return holidayRepository.saveHoliday(holidayRequest);
        else
            return holidayRepository.modifyHoliday(holidayRequest);
    }

    public Boolean isSunday(Date date) {

        final Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        return cal.getTime().equals(date);
    }

    public Boolean isSecondSaturday(Date date) {
        final Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.SATURDAY);
        cal.set(Calendar.WEEK_OF_MONTH, 2);
        return cal.getTime().equals(date);
    }

    public Boolean isSecondOrFourthSaturday(Date date) {
        if (isSecondSaturday(date)) {
            return true;
        } else {
            Calendar c1 = Calendar.getInstance();
            c1.setTime(date);

            if ((c1.get(Calendar.WEEK_OF_MONTH) == 4) && (c1.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY)) {
                return true;
            }
        }
        return false;
    }


    public boolean getHolidayByApplicableOn(final Long id, final Date applicableOn, final String tenantId) {
        return holidayRepository.checkHolidayByApplicableOn(id, applicableOn, tenantId);
    }

}