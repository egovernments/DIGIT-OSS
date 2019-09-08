package org.egov.pt.calculator.repository;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.pt.calculator.web.models.BillingSlabSearchCriteria;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class BillingSlabQueryBuilder {

	public String getBillingSlabSearchQuery(BillingSlabSearchCriteria billingSlabSearcCriteria,
			List<Object> preparedStmtList) {
		
		StringBuilder queryBuilder = new StringBuilder();
		queryBuilder.append("SELECT * FROM eg_pt_billingslab_v2");
		addWhereClause(queryBuilder, billingSlabSearcCriteria, preparedStmtList);
		return queryBuilder.toString();
	}

	public void addWhereClause(StringBuilder queryBuilder, BillingSlabSearchCriteria billingSlabSearcCriteria,
			List<Object> preparedStmtList) {

		queryBuilder.append(" WHERE tenantId = ?");

		preparedStmtList.add(billingSlabSearcCriteria.getTenantId());

		List<String> ids = billingSlabSearcCriteria.getId();

		if (!CollectionUtils.isEmpty(ids)) {

			queryBuilder.append(" AND id IN ( ");
			setValuesForList(queryBuilder, preparedStmtList, ids);
			queryBuilder.append(")");
		}

		if (!StringUtils.isEmpty(billingSlabSearcCriteria.getPropertyType())) {

			queryBuilder.append(" AND propertyType = ?");
			preparedStmtList.add(billingSlabSearcCriteria.getPropertyType());
		}

		if (!StringUtils.isEmpty(billingSlabSearcCriteria.getPropertySubType())) {

			queryBuilder.append(" AND propertySubType = ?");
			preparedStmtList.add(billingSlabSearcCriteria.getPropertySubType());
		}

		if (!StringUtils.isEmpty(billingSlabSearcCriteria.getUsageCategoryMajor())) {

			queryBuilder.append(" AND usageCategoryMajor = ?");
			preparedStmtList.add(billingSlabSearcCriteria.getUsageCategoryMajor());
		}

		if (!StringUtils.isEmpty(billingSlabSearcCriteria.getPropertyType())) {

			queryBuilder.append(" AND usageCategoryMinor = ?");
			preparedStmtList.add(billingSlabSearcCriteria.getUsageCategoryMinor());
		}
	}

	/**
	 * sets prepared statement for values for a list
	 * 
	 * @param queryBuilder
	 * @param preparedStmtList
	 * @param ids
	 */
	private void setValuesForList(StringBuilder queryBuilder, List<Object> preparedStmtList, List<String> ids) {
		int len = ids.size();
		for (int i = 0; i < ids.size(); i++) {

			queryBuilder.append("?");
			if (i != len - 1)
				queryBuilder.append(", ");
			preparedStmtList.add(ids.get(i));
		}
	}
}
