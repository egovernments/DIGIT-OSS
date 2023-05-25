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

package org.egov.commons.repository.rowmapper;

import org.egov.commons.model.CalendarYear;
import org.egov.commons.model.Holiday;
import org.egov.commons.model.HolidayType;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.springframework.util.ObjectUtils.isEmpty;

@Component
public class HolidayRowMapper implements RowMapper<Holiday> {

    @Override
    public Holiday mapRow(ResultSet rs, int rowNum) throws SQLException {
        final SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        Holiday holiday = new Holiday();
        holiday.setId(rs.getLong("h_id"));
        holiday.setName(rs.getString("h_name"));
        holiday.setTenantId(rs.getString("h_tenantId"));

        CalendarYear calendarYear = new CalendarYear();
        calendarYear.setId(rs.getLong("cy_id"));
        calendarYear.setName((Integer) rs.getObject("cy_name"));
        calendarYear.setActive((Boolean) rs.getObject("cy_active"));
        calendarYear.setTenantId(rs.getString("cy_tenantId"));

        HolidayType holidayType = new HolidayType();
        holidayType.setId(rs.getLong("ht_id"));
        holidayType.setName(rs.getString("ht_name"));
        holidayType.setTenantId(rs.getString("ht_tenantId"));

        try {
            Date date = isEmpty(rs.getDate("cy_startDate")) ? null : sdf.parse(sdf.format(rs.getDate("cy_startDate")));
            calendarYear.setStartDate(date);
            date = isEmpty(rs.getDate("cy_endDate")) ? null : sdf.parse(sdf.format(rs.getDate("cy_endDate")));
            calendarYear.setEndDate(date);
            date = isEmpty(rs.getDate("h_applicableOn")) ? null : sdf.parse(sdf.format(rs.getDate("h_applicableOn")));
            holiday.setApplicableOn(date);
        } catch (ParseException e) {
            e.printStackTrace();
            throw new SQLException("Parse exception while parsing date");
        }

        holiday.setCalendarYear(calendarYear);
        holiday.setHolidayType(holidayType);

        return holiday;
    }
}
