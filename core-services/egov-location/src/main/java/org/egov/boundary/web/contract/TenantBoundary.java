package org.egov.boundary.web.contract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TenantBoundary {

	private HierarchyType hierarchyType;
	private MdmsBoundary boundary;
	private String tenantId;
}
