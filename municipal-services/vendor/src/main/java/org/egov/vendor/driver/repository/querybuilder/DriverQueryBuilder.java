package org.egov.vendor.driver.repository.querybuilder;

import java.util.List;

import javax.validation.Valid;

import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class DriverQueryBuilder {

	@Autowired
	private VendorConfiguration config;

	private static final String Query = "SELECT count(*) OVER() AS full_count, driver.* FROM eg_driver driver";
			
	private final String paginationWrapper = "SELECT * FROM "
			+ "(SELECT *, DENSE_RANK() OVER (ORDER BY createdTime DESC) offset_ FROM " + "({})"
			+ " result) result_offset " + "limit ? offset ?";
	private static final String DRIVER_NO_VENDOR_QUERY=" SELECT DISTINCT (driver.id) FROM EG_DRIVER driver LEFT JOIN eg_vendor_driver vendor_driver ON driver.id=vendor_driver.driver_id";
		
	public String getDriverSearchQuery(DriverSearchCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(Query);
		if (criteria.getTenantId() != null) {
			
			if (criteria.getTenantId().split("\\.").length == 1) {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" driver.tenantid like ?");
				preparedStmtList.add('%' + criteria.getTenantId() + '%');
			} else {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" driver.tenantid=? ");
				preparedStmtList.add(criteria.getTenantId());
			}

			List<String> driver_name = criteria.getName();
			if (!CollectionUtils.isEmpty(driver_name)) {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" driver.name IN (").append(createQuery(driver_name)).append(")");
				addToPreparedStatement(preparedStmtList, driver_name);

			}
			List<String> ownerIds = criteria.getOwnerIds();
			if (!CollectionUtils.isEmpty(ownerIds)) {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" driver.owner_id IN (").append(createQuery(ownerIds)).append(")");
				addToPreparedStatement(preparedStmtList, ownerIds);
			}

		
			List<String> ids = criteria.getIds();
			if (!CollectionUtils.isEmpty(ids)) {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" driver.id IN (").append(createQuery(ids)).append(")");
				addToPreparedStatement(preparedStmtList, ids);
			}
			List<String> status=criteria.getStatus();
			if (!CollectionUtils.isEmpty(status)) {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" driver.status IN (").append(createQuery(status)).append(")");
				addToPreparedStatement(preparedStmtList, status);
			}
			
		}
		return addPaginationWrapper(builder.toString(), preparedStmtList, criteria);
	}

	private String addPaginationWrapper(String query, List<Object> preparedStmtList, DriverSearchCriteria criteria) {
		int limit = config.getDefaultLimit();
		int offset = config.getDefaultOffset();
		String finalQuery = paginationWrapper.replace("{}", query);

		if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
			limit = criteria.getLimit();

		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit()) {
			limit = config.getMaxSearchLimit();
		}

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		if (limit == -1) {
			finalQuery = finalQuery.replace("limit ? offset ?", "");
		} else {
			preparedStmtList.add(limit);
			preparedStmtList.add(offset);
		}

		return finalQuery;

	}

	private void addClauseIfRequired(List<Object> values, StringBuilder queryString) {
		if (values.isEmpty())
			queryString.append(" WHERE ");
		else {
			queryString.append(" AND");
		}
	}

	private void addToPreparedStatement(List<Object> preparedStmtList, List<String> ids) {
		ids.forEach(id -> {
			preparedStmtList.add(id);
		});

	}

	private Object createQuery(List<String> ids) {
		StringBuilder builder = new StringBuilder();
		int length = ids.size();
		for (int i = 0; i < length; i++) {
			builder.append(" ?");
			if (i != length - 1)
				builder.append(",");
		}
		return builder.toString();
	}
	
	public String getDriverIdsWithNoVendorQuery(@Valid DriverSearchCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(DRIVER_NO_VENDOR_QUERY);
				
				if (criteria.getTenantId() != null) {
					addClauseIfRequired(preparedStmtList, builder);
					builder.append(" driver.tenantid=? ");
					preparedStmtList.add(criteria.getTenantId());

				}

				List<String> status = criteria.getStatus();
//				if (!CollectionUtils.isEmpty(status)) {
//					addClauseIfRequired(preparedStmtList, builder);
//					builder.append(" vendor_driver.vendordriverstatus IN (").append(createQuery(status)).append(")");
//					addToPreparedStatement(preparedStmtList, status);
//				}

				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" vendor_driver.vendor_id IS NULL OR vendordriverstatus='INACTIVE'");

				return builder.toString();
			}

}