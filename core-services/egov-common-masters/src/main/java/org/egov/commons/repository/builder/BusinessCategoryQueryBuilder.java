package org.egov.commons.repository.builder;

import java.util.List;

import org.egov.commons.model.BusinessCategoryCriteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import lombok.EqualsAndHashCode;
import lombok.Getter;

@EqualsAndHashCode
@Component
@Getter
public class BusinessCategoryQueryBuilder {
	private static final Logger logger = LoggerFactory.getLogger(BusinessCategoryQueryBuilder.class);

	private static final String BASE_QUERY = "select id,name,code,active,tenantId FROM eg_businesscategory";


	@SuppressWarnings("rawtypes")
	public String getQuery(BusinessCategoryCriteria criteria, List preparedStatementValues) {
		StringBuilder selectQuery = new StringBuilder(BASE_QUERY);

		addWhereClause(selectQuery, preparedStatementValues, criteria);
		addOrderByClause(selectQuery, criteria);
		logger.debug("Query : " + selectQuery);
		return selectQuery.toString();
	}

    public String insertBusinessCategoryQuery() {
       return "INSERT INTO eg_businesscategory"
                +"(id,name,code,active,tenantId,createdBy,createdDate,lastModifiedBy,lastModifiedDate)"
                +" VALUES(nextval('seq_eg_businesscategory'),:name,:code,:active,:tenantId,:createdBy,:createdDate,:lastModifiedBy,:lastModifiedDate)";
    }

    public String updateBusinessCategoryQuery() {
        return "Update eg_businesscategory set name=:name,code=:code,active=:active,tenantId=:tenantId,lastModifiedBy=:lastModifiedBy,lastModifiedDate=:lastModifiedDate"
                + " where id=:id";
    }

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void addWhereClause(StringBuilder selectQuery, List preparedStatementValues,
			BusinessCategoryCriteria criteria) {

		if (criteria.getTenantId() == null)
			return;

		selectQuery.append(" WHERE");
		boolean isAppendAndClause = false;

		if (criteria.getTenantId() != null) {
			isAppendAndClause = true;
			selectQuery.append(" tenantId = ?");
			preparedStatementValues.add(criteria.getTenantId());
		}

		if (criteria.getId() != null) {
			isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
			selectQuery.append(" id = ? ");
            preparedStatementValues.add(criteria.getId());
		}

		if (criteria.getBusinessCategoryName() != null) {
			isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
			selectQuery.append(" name = ?");
			preparedStatementValues.add(criteria.getBusinessCategoryName());
		}

		if (criteria.getActive() != null) {
			isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
			selectQuery.append(" active = ?");
			preparedStatementValues.add(criteria.getActive());
		}
	}

	private void addOrderByClause(StringBuilder selectQuery, BusinessCategoryCriteria criteria) {
		String sortBy = (criteria.getSortBy() == null ? "name" : criteria.getSortBy());
		String sortOrder = (criteria.getSortOrder() == null ? "ASC" : criteria.getSortOrder());
		selectQuery.append(" ORDER BY " + sortBy + " " + sortOrder);
	}

	private boolean addAndClauseIfRequired(boolean appendAndClauseFlag, StringBuilder queryString) {
		if (appendAndClauseFlag)
			queryString.append(" AND");
		return true;
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

}
