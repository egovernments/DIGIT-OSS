package org.egov.access.persistence.repository.querybuilder;

import org.egov.access.domain.criteria.RoleSearchCriteria;

import java.util.ArrayList;
import java.util.List;

public class RoleFinderQueryBuilder implements BaseQueryBuilder {
	private RoleSearchCriteria criteria;
	private List<String> filters = new ArrayList<>();
	private String BASE_QUERY = "SELECT r.name as r_name,r.code as r_code, r.description as r_description from eg_ms_role r";

	public RoleFinderQueryBuilder(RoleSearchCriteria criteria) {
		this.criteria = criteria;
	}

	@Override
	public String build() {
		filterRoleCodes();
		String filterQuery = shouldFilter() ? " WHERE " + String.join(" AND ", filters) : "";
		return BASE_QUERY + filterQuery + " ORDER BY r_name";
	}

	private boolean shouldFilter() {
		return !filters.isEmpty();
	}

	private boolean shouldFilterCodes() {
		return criteria.getCodes() != null && !criteria.getCodes().isEmpty();
	}

	private void filterRoleCodes() {
		if (shouldFilterCodes()) {
			List<String> sqlStringifiedCodes = new ArrayList<>();
			for (String roleName : criteria.getCodes()) {
				sqlStringifiedCodes.add(String.format("'%s'", roleName));
			}
			filters.add("r.code in (" + String.join(",", sqlStringifiedCodes) + ")");
		}
	}
}
