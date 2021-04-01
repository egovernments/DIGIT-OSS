package org.egov.pt.repository.builder;

import org.apache.commons.lang3.StringUtils;
import org.egov.pt.web.models.DraftSearchCriteria;
import org.springframework.stereotype.Component;

import java.util.List;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@Component
public class DraftsQueryBuilder {

    public String getDraftsSearchQuery(DraftSearchCriteria searchCriteria, List<Object> preparedStatementList) {
		StringBuilder query = new StringBuilder();

        query.append("SELECT id, userId, tenantId, draft , isactive, assessmentNumber, createdby, " +
                "createdtime, lastmodifiedby, lastmodifiedtime" +
                " FROM " +
                "eg_pt_drafts_v2 WHERE " +
                "tenantId NOTNULL ");
        
        if (!isEmpty(searchCriteria.getId())) {
            query.append(" AND id = ?");
            preparedStatementList.add(searchCriteria.getId());
        }

        if (!isEmpty(searchCriteria.getUserId())) {
			query.append(" AND userId = ?");
            preparedStatementList.add(searchCriteria.getUserId());
        }
        if (!StringUtils.isEmpty(searchCriteria.getAssessmentNumber())) {
            query.append(" AND assessmentNumber = ?");
            preparedStatementList.add(searchCriteria.getAssessmentNumber());
        }

        if (null != searchCriteria.getIsActive()) {
            query.append(" AND isActive = ?");
            preparedStatementList.add(searchCriteria.getIsActive());
        }
        
        if (searchCriteria.getLimit() > 0) {
            query.append(" limit ? ");
            preparedStatementList.add(searchCriteria.getLimit());
        }
        if (searchCriteria.getOffset() > 0) {
            query.append(" offset ? ");
            preparedStatementList.add(searchCriteria.getOffset());
        }

        return query.toString();
//        return "select (select array_to_json(array_agg(row_to_json(t))) from ({query}) t) as drafts".replace("{query}", query);
	}
}
