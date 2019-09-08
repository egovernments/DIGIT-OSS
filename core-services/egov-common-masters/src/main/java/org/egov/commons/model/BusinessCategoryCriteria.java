package org.egov.commons.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Setter
public class BusinessCategoryCriteria {
	private String businessCategoryName;

	private Boolean active;

	private Long id;

	private String tenantId;

	private String sortBy;

	private String sortOrder;

}
