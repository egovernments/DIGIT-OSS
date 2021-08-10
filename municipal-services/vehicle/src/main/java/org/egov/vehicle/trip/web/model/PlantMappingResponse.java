package org.egov.vehicle.trip.web.model;

import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PlantMappingResponse {

	@JsonProperty("responseInfo")
	private ResponseInfo responseInfo;

	@Valid
	@JsonProperty("plantMapping")
	private List<PlantMapping> plantMapping;
}
