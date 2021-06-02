package org.egov.vehicle.web.model.hrms;


import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Validated
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {

	@NotNull
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

	@Valid
	@NonNull
	@JsonProperty("Employees")
	private List<Employee> employees;

}
