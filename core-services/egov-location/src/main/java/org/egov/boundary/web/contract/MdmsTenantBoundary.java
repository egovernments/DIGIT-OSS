package org.egov.boundary.web.contract;

import java.util.ArrayList;
import java.util.List;

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
public class MdmsTenantBoundary {

	private HierarchyType hierarchyType;
	private List<MdmsBoundary> boundary = new ArrayList<MdmsBoundary>();
	private String tenantId;
}

