package org.egov.swservice.web.models;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Calculation
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonPropertyOrder({ "tenantId", "totalAmount", "charge", "taxAmount", "fee", "exemption", "rebate", "exemption", "penalty" })
public class Calculation {

	@JsonProperty("applicationNo")
	private String applicationNO;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("totalAmount")
	private BigDecimal totalAmount;

	@JsonProperty("taxAmount")
	private BigDecimal taxAmount;

	@JsonProperty("penalty")
	private BigDecimal penalty;

	@JsonProperty("exemption")
	private BigDecimal exemption;

	@JsonProperty("rebate")
	private BigDecimal rebate;
	
	@JsonProperty("charge")
	private BigDecimal charge;

	List<TaxHeadEstimate> taxHeadEstimates;

	@JsonProperty("billingSlabIds")
	private List<String> billingSlabIds;
	
	@JsonProperty("sewerageConnection")
	private SewerageConnection sewerageConnection = null;
	
	@JsonProperty("connectionNo")
	private String connectionNo;
	
	@JsonProperty("fee")
	private BigDecimal fee;
}
