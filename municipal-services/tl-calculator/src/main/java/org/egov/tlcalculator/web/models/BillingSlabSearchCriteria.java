package org.egov.tlcalculator.web.models;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class BillingSlabSearchCriteria {

	@NotNull
	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("id")
	private List<String> ids;

	@JsonProperty("licenseType")
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
	private Double uomValue;


}
