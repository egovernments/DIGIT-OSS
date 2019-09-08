package org.egov.common.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DepartmentDesignationContract {

	private Long id;

	@JsonProperty("department")
	private Long departmentId;

	private DesignationContract designation;

}
