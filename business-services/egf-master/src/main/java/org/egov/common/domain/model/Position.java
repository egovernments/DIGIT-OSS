package org.egov.common.domain.model;

import lombok.Data;

@Data
//class variables not used
public class Position {

	private Long id;

	private String name;

	private DepartmentDesignation deptdesig;

	private Boolean isPostOutsourced;

	private Boolean active;

}
