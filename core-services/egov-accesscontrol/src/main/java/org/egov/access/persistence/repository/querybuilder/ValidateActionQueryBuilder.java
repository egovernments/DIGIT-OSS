package org.egov.access.persistence.repository.querybuilder;

import org.egov.access.domain.criteria.ValidateActionCriteria;

import java.util.ArrayList;
import java.util.List;

public class ValidateActionQueryBuilder implements BaseQueryBuilder {
	private ValidateActionCriteria criteria;
	private List<String> filters = new ArrayList<>();

	private String BASE_QUERY = "SELECT exists(SELECT 1 from eg_roleaction AS ra"
			+ " JOIN eg_ms_role AS r ON ra.rolecode = r.code" + " JOIN eg_action AS a on ra.actionid = a.id";

	public ValidateActionQueryBuilder(ValidateActionCriteria criteria) {
		this.criteria = criteria;
	}

	private void filterRoleNames() {
		List<String> sqlStringifiedItems = new ArrayList<>();
		for (String roleName : criteria.getRoleNames()) {
			sqlStringifiedItems.add(String.format("'%s'", roleName));
		}
		filters.add("r.name in (" + String.join(",", sqlStringifiedItems) + ")");
	}

	private void filterTenantId() {
		filters.add(String.format("ra.tenantid = '%s'", criteria.getTenantId()));
	}

	private void filterActionUrl() {
		filters.add(String.format("a.url = '%s'", criteria.getActionUrl()));
	}

	@Override
	public String build() {
		filterRoleNames();
		filterTenantId();
		filterActionUrl();
		return BASE_QUERY + " WHERE " + String.join(" AND ", filters) + ") AS \"exists\"";
	}
}
