package org.egov.bpa.calculator.web.models;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillingSlabSearchCriteria {


	@NotNull
	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("id")
	private List<String> ids;

	/*@JsonProperty("licenseType")
	private String licenseType;

	@JsonProperty("structureType")
	private String structureType;

	@JsonProperty("tradeType")
	private String tradeType;

	@JsonProperty("accessoryCategory")
	private String accessoryCategory;

	@JsonProperty("type")
	private String type;
	
	@JsonProperty("uom")
	private String uom;

	@JsonProperty("from")
	private Double from;

	@JsonProperty("to")
	private Double to;

	@JsonIgnore
	private Double uomValue;*/
}
