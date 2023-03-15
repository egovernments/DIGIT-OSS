package org.bel.birthdeath.common.calculation.collections.models;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import javax.xml.crypto.KeySelector.Purpose;

import org.bel.birthdeath.common.model.AuditDetails;

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
	@Valid
    private String id = null;

	@Size(max=64)
	@JsonProperty("tenantId")
    @Valid
    private String tenantId = null;

	@Size(max=64)
	@JsonProperty("billDetailId")
	@Valid
    private String billDetailId = null;

	@Size(max=64)
	@JsonProperty("demandDetailId")
	@Valid
    private String demandDetailId = null;

	@JsonProperty("order")
	@Valid
    private Integer order = null;

	@JsonProperty("amount")
	@Valid
    private BigDecimal amount = null;

	@JsonProperty("adjustedAmount")
	@Valid
    private BigDecimal adjustedAmount = null;

	@JsonProperty("isActualDemand")
	@Valid
    private Boolean isActualDemand = null;

	@Size(max=64)
	@JsonProperty("taxHeadCode")
	@Valid
    private String taxHeadCode = null;

	@JsonProperty("additionalDetails")
	@Valid
    private JsonNode additionalDetails = null;

	@JsonProperty("purpose")
	@Valid
    private Purpose purpose = null;

	@JsonProperty("auditDetails")
	@Valid
    private AuditDetails auditDetails;
}
