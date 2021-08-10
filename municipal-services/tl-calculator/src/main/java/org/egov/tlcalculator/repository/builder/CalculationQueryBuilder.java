package org.egov.tlcalculator.repository.builder;

import org.egov.tlcalculator.web.models.BillingSlabSearchCriteria;
import org.egov.tlcalculator.web.models.CalculationSearchCriteria;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CalculationQueryBuilder {


    private static final String INNER_JOIN_STRING = " INNER JOIN ";
    private static final String LEFT_OUTER_JOIN_STRING = " LEFT OUTER JOIN ";

    private static final String QUERY = "SELECT tp.*,acc.*,tp.consumercode as tp_consumercode FROM eg_tl_calculator_tradetype tp " +
               LEFT_OUTER_JOIN_STRING +
            " eg_tl_calculator_accessory acc ON acc.consumercode = tp.consumercode " +
            " WHERE ";


    /**
     * Creates query to search billingSlabs based on tenantId and consumerCode ordered by lastModifiedTime
     * @param criteria The Search criteria
     * @param preparedStmtList The list of object containing the query parameter values
     * @return Search query for billingSlabs
     */
    public String getSearchQuery(CalculationSearchCriteria criteria, List<Object> preparedStmtList){
        StringBuilder builder = new StringBuilder(QUERY);

        builder.append(" tp.tenantid=? ");
        preparedStmtList.add(criteria.getTenantId());

        builder.append(" AND tp.consumercode=? ");
        preparedStmtList.add(criteria.getAplicationNumber());

        builder.append("ORDER BY tp.lastmodifiedtime DESC,acc.lastmodifiedtime DESC LIMIT 1");

        return builder.toString();
    }


}
