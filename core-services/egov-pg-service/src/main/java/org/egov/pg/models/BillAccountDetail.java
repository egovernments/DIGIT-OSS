package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BillAccountDetail {
	
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("tenantId")
	private String tenantId = null;

	@JsonProperty("billDetail")
	private String billDetail = null;

	@JsonProperty("demandDetailId")
	private String demandDetailId = null;

	@JsonProperty("order")
	private Integer order = null;

	@JsonProperty("amount")
	private BigDecimal amount = null;

	@JsonProperty("adjustedAmount")
	private BigDecimal adjustedAmount = null;

	@JsonProperty("isActualDemand")
	private Boolean isActualDemand = null;

	@JsonProperty("glcode")
	private String glcode = null;
	
	@JsonProperty("taxHeadCode")
	private String taxHeadCode = null;

	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails = null;

	@JsonProperty("purpose")
	private Purpose purpose = null;
}
