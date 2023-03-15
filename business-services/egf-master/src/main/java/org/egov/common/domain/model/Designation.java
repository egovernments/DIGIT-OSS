package org.egov.common.domain.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class Designation {

	@NotNull
	private Long id;

	@NotNull
	@Size(min = 3, max = 100)
	private String name;

	@NotNull
	@Size(min = 3, max = 20)
	private String code;

	@Size(max = 250)
	private String description;

	private String chartOfAccounts;

	@NotNull
	private Boolean active;

	@NotNull
	private String tenantId;

}
