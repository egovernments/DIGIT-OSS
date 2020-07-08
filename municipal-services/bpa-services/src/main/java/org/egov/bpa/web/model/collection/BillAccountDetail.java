package org.egov.bpa.web.model.collection;

import java.math.BigDecimal;

import javax.validation.constraints.Size;

import org.egov.bpa.web.model.AuditDetails;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BillAccountDetail {

	@Size(max=64)
	@JsonProperty("id")
	private String id;

	@Size(max=64)
	@JsonProperty("tenantId")
	private String tenantId;

	@Size(max=64)
	@JsonProperty("billDetailId")
	private String billDetailId;

	@Size(max=64)
	@JsonProperty("demandDetailId")
	private String demandDetailId;

	@JsonProperty("order")
	private Integer order;

	@JsonProperty("amount")
	private BigDecimal amount;

	@JsonProperty("adjustedAmount")
	private BigDecimal adjustedAmount;

	@JsonProperty("isActualDemand")
	private Boolean isActualDemand;

	@Size(max=64)
	@JsonProperty("taxHeadCode")
	private String taxHeadCode;

	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails;

	@JsonProperty("purpose")
	private Purpose purpose;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;
}
