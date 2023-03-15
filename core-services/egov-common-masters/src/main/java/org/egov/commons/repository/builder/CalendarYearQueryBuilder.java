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

package org.egov.commons.repository.builder;

import static org.springframework.util.StringUtils.isEmpty;

import java.util.List;

import org.egov.commons.config.ApplicationProperties;
import org.egov.commons.web.contract.CalendarYearGetRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CalendarYearQueryBuilder {

    private static final Logger logger = LoggerFactory.getLogger(CalendarYearQueryBuilder.class);

    @Autowired
    private ApplicationProperties applicationProperties;

    private static final String BASE_QUERY = "SELECT id, name, startDate, endDate, active, tenantId "
            + "FROM eg_calendarYear";

    @SuppressWarnings("rawtypes")
    public String getQuery(final CalendarYearGetRequest calendarYearGetRequest, final List preparedStatementValues) {
        final StringBuilder selectQuery = new StringBuilder(BASE_QUERY);

        addWhereClause(selectQuery, preparedStatementValues, calendarYearGetRequest);
        addOrderByClause(selectQuery, calendarYearGetRequest);
        addPagingClause(selectQuery, preparedStatementValues, calendarYearGetRequest);

        logger.debug("Query : " + selectQuery);
        return selectQuery.toString();
    }

    public String getFutureYear(final CalendarYearGetRequest calendarYearGetRequest, final int year,
            final List preparedStatementValues) {
        final StringBuilder selectQuery = new StringBuilder(BASE_QUERY);

        addYearClause(selectQuery, preparedStatementValues, calendarYearGetRequest, year);
        addOrderByClause(selectQuery, calendarYearGetRequest);
        addPagingClause(selectQuery, preparedStatementValues, calendarYearGetRequest);

        logger.debug("Query : " + selectQuery);
        return selectQuery.toString();
    }

    private void addYearClause(final StringBuilder selectQuery, final List preparedStatementValues,
            final CalendarYearGetRequest calendarYearGetRequest, final int year) {

        if (calendarYearGetRequest.getId() == null && calendarYearGetRequest.getName() == null
                && calendarYearGetRequest.getActive() == null && calendarYearGetRequest.getTenantId() == null)
            return;

        selectQuery.append(" WHERE");
        boolean isAppendAndClause = false;

        if (calendarYearGetRequest.getTenantId() != null) {
            isAppendAndClause = true;
            selectQuery.append(" tenantId = ?");
            preparedStatementValues.add(calendarYearGetRequest.getTenantId());
        }

        if (!isEmpty(year)) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" name >= ?");
            preparedStatementValues.add(year);
        }

    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private void addWhereClause(final StringBuilder selectQuery, final List preparedStatementValues,
            final CalendarYearGetRequest calendarYearGetRequest) {

        if (calendarYearGetRequest.getId() == null && calendarYearGetRequest.getName() == null
                && calendarYearGetRequest.getActive() == null && calendarYearGetRequest.getTenantId() == null)
            return;

        selectQuery.append(" WHERE");
        boolean isAppendAndClause = false;

        if (calendarYearGetRequest.getTenantId() != null) {
            isAppendAndClause = true;
            selectQuery.append(" tenantId = ?");
            preparedStatementValues.add(calendarYearGetRequest.getTenantId());
        }

        if (calendarYearGetRequest.getId() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" id IN " + getIdQuery(calendarYearGetRequest.getId()));
        }

        if (calendarYearGetRequest.getName() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" name = ?");
            preparedStatementValues.add(calendarYearGetRequest.getName());
        }

        if (calendarYearGetRequest.getActive() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" active = ?");
            preparedStatementValues.add(calendarYearGetRequest.getActive());
        }
    }

    private void addOrderByClause(final StringBuilder selectQuery, final CalendarYearGetRequest calendarYearGetRequest) {
        final String sortBy = calendarYearGetRequest.getSortBy() == null ? "name" : calendarYearGetRequest.getSortBy();
        final String sortOrder = calendarYearGetRequest.getSortOrder() == null ? "DESC"
                : calendarYearGetRequest.getSortOrder();
        selectQuery.append(" ORDER BY " + sortBy + " " + sortOrder);
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private void addPagingClause(final StringBuilder selectQuery, final List preparedStatementValues,
            final CalendarYearGetRequest calendarYearGetRequest) {
        // handle limit(also called pageSize) here
        selectQuery.append(" LIMIT ?");
        long pageSize = Integer.parseInt(applicationProperties.commonsSearchPageSizeDefault());
        if (calendarYearGetRequest.getPageSize() != null)
            pageSize = calendarYearGetRequest.getPageSize();
        preparedStatementValues.add(pageSize); // Set limit to pageSize

        // handle offset here
        selectQuery.append(" OFFSET ?");
        int pageNumber = 0; // Default pageNo is zero meaning first page
        if (calendarYearGetRequest.getPageNumber() != null)
            pageNumber = calendarYearGetRequest.getPageNumber() - 1;
        preparedStatementValues.add(pageNumber * pageSize); // Set offset to
                                                            // pageNo * pageSize
    }

    /**
     * This method is always called at the beginning of the method so that and is prepended before the field's predicate is
     * handled.
     * 
     * @param appendAndClauseFlag
     * @param queryString
     * @return boolean indicates if the next predicate should append an "AND"
     */
    private boolean addAndClauseIfRequired(final boolean appendAndClauseFlag, final StringBuilder queryString) {
        if (appendAndClauseFlag)
            queryString.append(" AND");

        return true;
    }

    private static String getIdQuery(final List<Long> idList) {
        final StringBuilder query = new StringBuilder("(");
        if (idList.size() >= 1) {
            query.append(idList.get(0).toString());
            for (int i = 1; i < idList.size(); i++)
                query.append(", " + idList.get(i));
        }
        return query.append(")").toString();
    }

    public static String selectYearByNameQuery() {
        return "select * from eg_calendaryear where name = ? and tenantId = ?";
    }

    public static String selectYearByNameAndIdQuery() {
        return "select id from eg_calendaryear where name = ? and tenantId = ?";
    }

    public static String selectYearByNameAndIdQueryNotInQuery() {
        return "SELECT id FROM eg_calendaryear where name = ? and tenantId = ? and id!= ?";
    }

    public static String selectYearByByNameAndDateQuery() {
        return "select * from eg_calendaryear where name = ? and startdate<= ? and enddate >= ? and tenantId = ?";
    }

    public static String insertCalendarYearQuery() {
        return "INSERT INTO eg_calendaryear(id,name,startdate,enddate,active,tenantid) values "
                + "(nextval('seq_eg_calendarYear'),?,?,?,?,?)";
    }

    public static String updateCalendarYearQuery() {
        return "UPDATE eg_calendaryear SET  name = ?, startdate = ?, enddate = ?,active = ? where id = ? and tenantid = ? ";
    }
}
