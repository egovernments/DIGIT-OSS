package org.egov.echallancalculation.web.models.demand;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.*;

import java.math.BigDecimal;

import org.egov.echallancalculation.model.AuditDetails;

/**
 * BillAccountDetail
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillAccountDetail {

    @JsonProperty("id")
    private String id;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("billDetailId")
    private String billDetailId;

    @JsonProperty("demandDetailId")
    private String demandDetailId;

    @JsonProperty("order")
    private Integer order;

    @JsonProperty("amount")
    private BigDecimal amount;

    @JsonProperty("adjustedAmount")
    private BigDecimal adjustedAmount;

    @JsonProperty("taxHeadCode")
    private String taxHeadCode;

    @JsonProperty("additionalDetails")
    private Object additionalDetails;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;
}

