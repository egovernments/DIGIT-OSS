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

package org.egov.commons.repository;

import org.egov.commons.model.CalendarYear;
import org.egov.commons.model.Holiday;
import org.egov.commons.model.HolidayType;
import org.egov.commons.repository.builder.HolidayQueryBuilder;
import org.egov.commons.repository.rowmapper.HolidayRowMapper;
import org.egov.commons.web.contract.HolidayGetRequest;
import org.egov.commons.web.contract.HolidayRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class HolidayRepository {

    public static final Logger LOGGER = LoggerFactory.getLogger(HolidayRepository.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HolidayRowMapper holidayRowMapper;

    @Autowired
    private HolidayQueryBuilder holidayQueryBuilder;

    @Autowired
    private CalendarYearRepository calendarYearRepository;

    @Autowired
    private HolidayTypeRepository holidayTypeRepository;

    public List<Holiday> findForCriteria(HolidayGetRequest holidayGetRequest) {
        List<Object> preparedStatementValues = new ArrayList<Object>();
        String queryStr = holidayQueryBuilder.getQuery(holidayGetRequest, preparedStatementValues);
        List<Holiday> holidays = jdbcTemplate.query(queryStr, preparedStatementValues.toArray(), holidayRowMapper);
        return holidays;
    }

    @SuppressWarnings("static-access")
    public HolidayRequest saveHoliday(final HolidayRequest holidayRequest) {

        LOGGER.info("HolidayRequest::" + holidayRequest);
        final String holidayInsert = holidayQueryBuilder.insertHolidayQuery();
        final Holiday holiday = holidayRequest.getHoliday();
        HolidayType holidayType = null;

        CalendarYear year = calendarYearRepository.findCalendarYearByName(holiday.getCalendarYear().getName(),
                holiday.getTenantId());
        if (holiday.getHolidayType() != null)
            holidayType = holidayTypeRepository.findHolidayTypeById(holiday.getHolidayType().getId(), holiday.getTenantId());

        Object[] obj = new Object[]{year.getName(), holiday.getName(), new Date(holiday.getApplicableOn().getTime()),
                holiday.getTenantId(), holidayType != null ? holidayType.getId() : null};

        jdbcTemplate.update(holidayInsert, obj);
        return holidayRequest;
    }

    @SuppressWarnings("static-access")
    public HolidayRequest modifyHoliday(final HolidayRequest holidayRequest) {

        LOGGER.info("HolidayRequest::" + holidayRequest);
        final String holidayUpdate = holidayQueryBuilder.updateHolidayQuery();
        final Holiday holiday = holidayRequest.getHoliday();
        HolidayType holidayType = null;
        CalendarYear year = calendarYearRepository.findCalendarYearByName(holiday.getCalendarYear().getName(),
                holiday.getTenantId());
        if (holiday.getHolidayType() != null)
            holidayType = holidayTypeRepository.findHolidayTypeById(holiday.getHolidayType().getId(), holiday.getTenantId());
        Object[] obj = new Object[]{year.getName(), holiday.getName(), new Date(holiday.getApplicableOn().getTime()),
                holiday.getTenantId(), holidayType != null ? holidayType.getId() : null, holiday.getId()};
        jdbcTemplate.update(holidayUpdate, obj);
        return holidayRequest;

    }

    public boolean checkHolidayByApplicableOn(final Long id, final java.util.Date applicableOn, final String tenantId) {
        final List<Object> preparedStatementValues = new ArrayList<Object>();
        preparedStatementValues.add(applicableOn);
        preparedStatementValues.add(tenantId);
        final String query;
        if (id == null)
            query = HolidayQueryBuilder.selectHolidayByApplicableOnQuery();
        else {
            preparedStatementValues.add(id);
            query = HolidayQueryBuilder.selectHolidayByApplicableOnAndIdNotInQuery();
        }
        final List<Map<String, Object>> holidayIds = jdbcTemplate.queryForList(query,
                preparedStatementValues.toArray());
        if (!holidayIds.isEmpty())
            return true;

        return false;
    }
}