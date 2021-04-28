package org.egov.tlcalculator.web.models;

import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

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
public class CalculationRes {
	@JsonProperty("ResponseInfo")
	@Valid
	private ResponseInfo responseInfo = null;

	@JsonProperty("Calculations")
	@Valid
	private List<Calculation> calculations = null;

}
