package org.egov.infra.microservice.models;

import java.math.BigDecimal;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.SafeHtml;

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
@EqualsAndHashCode(of = {"id"})
public class BillAccountDetail {
    @SafeHtml
    @Size(max=64)
    @JsonProperty("id")
    private String id = null;
    @SafeHtml
    @Size(max=64)
    @JsonProperty("tenantId")
    private String tenantId = null;
    @SafeHtml
    @Size(max=64)
    @JsonProperty("billDetailId")
    private String billDetailId = null;
    @SafeHtml
    @Size(max=64)
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

    @SafeHtml
    @Size(max=64)
    @JsonProperty("taxHeadCode")
    private String taxHeadCode = null;

    @JsonProperty("additionalDetails")
    private JsonNode additionalDetails = null;

    @JsonProperty("purpose")
    private Purpose purpose = null;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;
    
    @SafeHtml
    private String glcode;

    @SafeHtml
    private String accountDescription;
    @SafeHtml
    private String billDetail;

    private BigDecimal crAmountToBePaid = BigDecimal.ZERO;

    private BigDecimal creditAmount = BigDecimal.ZERO;

    private BigDecimal debitAmount = BigDecimal.ZERO;

}
