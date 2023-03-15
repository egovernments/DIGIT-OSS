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

import org.egov.commons.model.HolidayType;
import org.egov.commons.repository.builder.HolidayTypeQueryBuilder;
import org.egov.commons.repository.rowmapper.HolidayTypeRowMapper;
import org.egov.commons.web.contract.HolidayTypeGetRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class HolidayTypeRepository {

    public static final Logger LOGGER = LoggerFactory.getLogger(HolidayTypeRepository.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HolidayTypeRowMapper holidayTypeRowMapper;

    @Autowired
    private HolidayTypeQueryBuilder holidayTypeQueryBuilder;


    public List<HolidayType> findForCriteria(HolidayTypeGetRequest holidayTypeGetRequest) {
        List<Object> preparedStatementValues = new ArrayList<>();
        String queryStr = holidayTypeQueryBuilder.getQuery(holidayTypeGetRequest, preparedStatementValues);
        List<HolidayType> holidayTypes = jdbcTemplate.query(queryStr, preparedStatementValues.toArray(), holidayTypeRowMapper);
        return holidayTypes;
    }

    public HolidayType findHolidayTypeById(final Long id, final String tenantId) {
        final List<Object> preparedStatementValues = new ArrayList<>();
        preparedStatementValues.add(id);
        preparedStatementValues.add(tenantId);
        final String query = holidayTypeQueryBuilder.selectHolidayTypeByNameQuery();
        final List<HolidayType> holidayTypes = jdbcTemplate.query(query, preparedStatementValues.toArray(),
                holidayTypeRowMapper);
        if (!holidayTypes.isEmpty())
            return holidayTypes.get(0);

        return null;
    }

}