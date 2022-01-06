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

import org.egov.commons.config.ApplicationProperties;
import org.egov.commons.web.contract.HolidayGetRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HolidayQueryBuilder {

    private static final Logger logger = LoggerFactory.getLogger(HolidayQueryBuilder.class);
    private static final String BASE_QUERY = "SELECT h.id as h_id, h.calendarYear as h_calendarYear,"
            + " h.name as h_name, h.applicableOn as h_applicableOn, h.tenantId as h_tenantId,"
            + " ht.id AS ht_id , ht.name AS ht_name, ht.tenantId AS ht_tenantId, cy.id as cy_id, "
            + " cy.name as cy_name, cy.startDate as cy_startDate, cy.endDate as cy_endDate,"
            + " cy.active as cy_active, cy.tenantId as cy_tenantId"
            + " FROM eg_holiday h JOIN eg_calendarYear cy ON h.calendarYear = cy.name"
            + " LEFT JOIN  eg_holidaytype ht ON ht.id=h.holidaytype AND ht.tenantid = h.tenantid and ht.tenantid = h.tenantid";
    @Autowired
    private ApplicationProperties applicationProperties;

    public static String insertHolidayQuery() {
        return "INSERT INTO eg_holiday values " + "(nextval('seq_eg_holiday'),?,?,?,?,?)";
    }

    public static String updateHolidayQuery() {
        return "UPDATE eg_holiday SET calendarYear = ?, name = ?, applicableon = ?, tenantid = ?,holidaytype = ? where id = ? ";
    }

    public static String selectHolidayByApplicableOnQuery() {
        return "SELECT id FROM eg_holiday where applicableon = ? and tenantId = ?";
    }

    public static String selectHolidayByApplicableOnAndIdNotInQuery() {
        return "SELECT id FROM eg_holiday where applicableon = ? and tenantId = ? and id!= ?";
    }

    private static String getIdQuery(List<Long> idList) {
        StringBuilder query = new StringBuilder("(");
        if (idList.size() >= 1) {
            query.append(idList.get(0).toString());
            for (int i = 1; i < idList.size(); i++) {
                query.append(", " + idList.get(i));
            }
        }
        return query.append(")").toString();
    }

    @SuppressWarnings("rawtypes")
    public String getQuery(HolidayGetRequest holidayGetRequest, List preparedStatementValues) {
        StringBuilder selectQuery = new StringBuilder(BASE_QUERY);

        addWhereClause(selectQuery, preparedStatementValues, holidayGetRequest);
        addOrderByClause(selectQuery, holidayGetRequest);
        addPagingClause(selectQuery, preparedStatementValues, holidayGetRequest);

        logger.debug("Query : " + selectQuery);
        return selectQuery.toString();
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private void addWhereClause(StringBuilder selectQuery, List preparedStatementValues,
                                HolidayGetRequest holidayGetRequest) {

        if (holidayGetRequest.getId() == null && holidayGetRequest.getYear() == null
                && holidayGetRequest.getName() == null && holidayGetRequest.getApplicableOn() == null
                && holidayGetRequest.getFromDate() == null && holidayGetRequest.getToDate() == null
                && holidayGetRequest.getTenantId() == null)
            return;

        selectQuery.append(" WHERE");
        boolean isAppendAndClause = false;

        if (holidayGetRequest.getTenantId() != null) {
            isAppendAndClause = true;
            selectQuery.append(" h.tenantId = ?");
            preparedStatementValues.add(holidayGetRequest.getTenantId());
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" cy.tenantId = ?");
            preparedStatementValues.add(holidayGetRequest.getTenantId());

        }

        if (holidayGetRequest.getId() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" h.id IN " + getIdQuery(holidayGetRequest.getId()));
        }

        if (holidayGetRequest.getYear() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" h.calendarYear = ?");
            preparedStatementValues.add(holidayGetRequest.getYear());
        }

        if (holidayGetRequest.getName() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" h.name = ?");
            preparedStatementValues.add(holidayGetRequest.getName());
        }

        if (holidayGetRequest.getApplicableOn() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" h.applicableOn = ?");
            preparedStatementValues.add(holidayGetRequest.getApplicableOn());
        }

        if (holidayGetRequest.getFromDate() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" h.applicableOn >= ?");
            System.err.println("fromDate = " + holidayGetRequest.getFromDate());
            preparedStatementValues.add(holidayGetRequest.getFromDate());
        }

        if (holidayGetRequest.getToDate() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" h.applicableOn <= ?");
            preparedStatementValues.add(holidayGetRequest.getToDate());
        }
        if (holidayGetRequest.getHolidayType() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" ht.id = ?");
            preparedStatementValues.add(holidayGetRequest.getHolidayType());
        }
    }

    private void addOrderByClause(StringBuilder selectQuery, HolidayGetRequest holidayGetRequest) {
        String sortBy = (holidayGetRequest.getSortBy() == null ? "h.calendarYear"
                : "h." + holidayGetRequest.getSortBy());
        String sortOrder = (holidayGetRequest.getSortOrder() == null ? "DESC" : holidayGetRequest.getSortOrder());
        selectQuery.append(" ORDER BY " + sortBy + " " + sortOrder);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private void addPagingClause(StringBuilder selectQuery, List preparedStatementValues,
                                 HolidayGetRequest holidayGetRequest) {
        // handle limit(also called pageSize) here
        selectQuery.append(" LIMIT ?");
        long pageSize = Integer.parseInt(applicationProperties.commonsSearchPageSizeDefault());
        if (holidayGetRequest.getPageSize() != null)
            pageSize = holidayGetRequest.getPageSize();
        preparedStatementValues.add(pageSize); // Set limit to pageSize

        // handle offset here
        selectQuery.append(" OFFSET ?");
        int pageNumber = 0; // Default pageNo is zero meaning first page
        if (holidayGetRequest.getPageNumber() != null)
            pageNumber = holidayGetRequest.getPageNumber() - 1;
        preparedStatementValues.add(pageNumber * pageSize); // Set offset to
        // pageNo * pageSize
    }

    /**
     * This method is always called at the beginning of the method so that and
     * is prepended before the field's predicate is handled.
     *
     * @param appendAndClauseFlag
     * @param queryString
     * @return boolean indicates if the next predicate should append an "AND"
     */
    private boolean addAndClauseIfRequired(boolean appendAndClauseFlag, StringBuilder queryString) {
        if (appendAndClauseFlag)
            queryString.append(" AND");

        return true;
    }
}