package org.egov.common.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data

//class variables not used
public class DepartmentDesignation {

	private Long id;

	@JsonProperty("department")
	private Long departmentId;

	private Designation designation;

}
