/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.demand.repository.querybuilder;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Set;

@Component
@Slf4j
public class BusinessServDetailQueryBuilder {

    private static final String BASE_QUERY = "SELECT * FROM EGBS_BUSINESS_SERVICE_DETAILS businessservice ";

    public String prepareSearchQuery(final BusinessServiceDetailCriteria businessServiceDetailCriteria, final List<Object> preparedStatementValues) {
        final StringBuilder selectQuery = new StringBuilder(BASE_QUERY);
        log.debug("prepareSearchQuery --> ");
        prepareWhereClause(selectQuery, preparedStatementValues, businessServiceDetailCriteria);
        log.debug("Search business service details query from BusinessServDetailQueryBuilder -> " + selectQuery);
        return selectQuery.toString();
    }

    private void prepareWhereClause(final StringBuilder selectQuery, final List<Object> preparedStatementValues,
                                    final BusinessServiceDetailCriteria businessServiceDetailCriteria) {

        selectQuery.append(" WHERE ");

        if (StringUtils.isNotBlank(businessServiceDetailCriteria.getTenantId())) {
            selectQuery.append(" businessservice.tenantId = ? ");
            preparedStatementValues.add(businessServiceDetailCriteria.getTenantId());
        }

        if (!CollectionUtils.isEmpty(businessServiceDetailCriteria.getBusinessService()))
            selectQuery.append(" and businessservice.businessservice IN " +
                    getQueryForCollection(businessServiceDetailCriteria.getBusinessService()));

        if (businessServiceDetailCriteria.getId() != null && !businessServiceDetailCriteria.getId().isEmpty())
            selectQuery.append(" and businessservice.id IN " + getQueryForCollection(businessServiceDetailCriteria.getId()));

    }

    public String prepareQueryForValidation(List<BusinessServiceDetail> businessServiceDetailList, String mode) {
        String baseQuery = "select exists (SELECT * FROM EGBS_BUSINESS_SERVICE_DETAILS businessservice where ";
        StringBuilder whereClause = new StringBuilder();
        int count = 0;
        for (BusinessServiceDetail businessServiceDetail : businessServiceDetailList) {
            whereClause = whereClause.append(" ( ");
            if (StringUtils.isNotBlank(businessServiceDetail.getBusinessService()))
                whereClause = whereClause.append("businessservice.businessservice = '").append(businessServiceDetail.getBusinessService()).append("' and ");
            if ("edit".equalsIgnoreCase(mode))
                whereClause = whereClause.append(" businessservice.id != '").append(businessServiceDetail.getId()).append("' and ");
            if (StringUtils.isNotBlank(businessServiceDetail.getTenantId()))
                whereClause = whereClause.append(" businessservice.tenantId = '").append(businessServiceDetail.getTenantId()).append("')");

            count++;
            if (businessServiceDetailList.size() > count)
                whereClause = whereClause.append(" or ");
        }
        return baseQuery.concat(whereClause.toString()).concat(" )");
    }

    public String getInsertQuery() {
        return "INSERT INTO EGBS_BUSINESS_SERVICE_DETAILS(id,businessservice,collectionModesNotAllowed,partPaymentAllowed,callBackForApportioning," +
                "callBackApportionURL,createddate,lastmodifieddate,createdby,lastmodifiedby,tenantid) " +
                "values (?,?,?,?,?,?,?,?,?,?,?);";
    }

    public String getUpdateQuery() {
        return "UPDATE EGBS_BUSINESS_SERVICE_DETAILS SET businessservice = ?, collectionModesNotAllowed = ?, partPaymentAllowed = ?, " +
                "callBackForApportioning = ?, callBackApportionURL = ?, lastmodifieddate = ?, lastmodifiedby = ? " +
                "WHERE tenantid = ? and id = ?;";
    }

    private String getQueryForCollection(Set<String> values) {
        StringBuilder query = new StringBuilder();
        if (!values.isEmpty()) {
            String[] list = values.toArray(new String[values.size()]);
            query.append(" ('" + list[0] + "'");
            for (int i = 1; i < values.size(); i++)
                query.append("," + "'" + list[i] + "'");
        }
        return query.append(")").toString();
    }
}
