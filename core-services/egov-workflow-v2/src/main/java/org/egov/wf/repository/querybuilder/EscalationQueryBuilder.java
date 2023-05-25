package org.egov.wf.repository.querybuilder;

import org.apache.commons.lang3.StringUtils;
import org.egov.wf.web.models.EscalationSearchCriteria;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EscalationQueryBuilder {




    private static final String BASE_QUERY = "select businessId from (" +
            "  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number " +
            " FROM eg_wf_processinstance_v2 WHERE businessservice = ? AND tenantid= ? ) wf  WHERE rank_number = 1 ";


    /**
     * Builds query for searching escalated applications
     * @param criteria
     * @return
     */
    public String getEscalationQuery(EscalationSearchCriteria criteria, List<Object> preparedStmtList){


        StringBuilder builder = new StringBuilder(BASE_QUERY);

        preparedStmtList.add(criteria.getBusinessService());
        preparedStmtList.add(criteria.getTenantId());

        builder.append(" AND wf.status = ? ");
        preparedStmtList.add(criteria.getStatus());

        if(criteria.getStateSlaExceededBy() != null){
            builder.append(" AND (select extract(epoch from current_timestamp)) * 1000 - wf.createdtime - wf.statesla > ? ");
            preparedStmtList.add(criteria.getStateSlaExceededBy());
        }

        if(criteria.getBusinessSlaExceededBy() != null){
            builder.append(" AND (select extract(epoch from current_timestamp)) * 1000 - wf.createdtime - wf.businessservicesla > ? ");
            preparedStmtList.add(criteria.getBusinessSlaExceededBy());
        }

        return builder.toString();

    }


}
