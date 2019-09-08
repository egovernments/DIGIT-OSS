package org.egov.domain.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class Tenant {

	public static final String DEFAULT_TENANT = "default";
	private static final String NAMESPACE_SEPARATOR = ".";
	@Getter
	private String tenantId;

	public List<Tenant> getTenantHierarchy() {
		final ArrayList<Tenant> tenantHierarchy = new ArrayList<>();
		final int tenantDepth = StringUtils.countMatches(tenantId, NAMESPACE_SEPARATOR);
		tenantHierarchy.add(new Tenant(tenantId));
		for (int index = tenantDepth; index >= 1; index--) {
			final String tenant = tenantId.substring(0,
					StringUtils.ordinalIndexOf(tenantId, NAMESPACE_SEPARATOR, index));
			tenantHierarchy.add(new Tenant(tenant));
		}
		tenantHierarchy.add(new Tenant(DEFAULT_TENANT));
		return tenantHierarchy;
	}

	public boolean isDefaultTenant() {
		return tenantId.equals(DEFAULT_TENANT);
	}

	public boolean isMoreSpecificComparedTo(Tenant otherTenant) {
		if (tenantId.equals(otherTenant.getTenantId())) {
			return false;
		} else if (otherTenant.isDefaultTenant()) {
			return true;
		}
		return tenantId.indexOf(otherTenant.getTenantId()) == 0;
	}
}
