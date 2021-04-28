package org.egov.pt.calculator.web.models.demand;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.egov.pt.calculator.web.models.property.AuditDetails;

import javax.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * BillAccountDetail
 */
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
    private String id = null;

    @Size(max=64)
    @JsonProperty("tenantId")
    private String tenantId = null;

    @Size(max=64)
    @JsonProperty("billDetailId")
    private String billDetailId = null;

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

    @Size(max=64)
    @JsonProperty("taxHeadCode")
    private String taxHeadCode = null;

    @JsonProperty("additionalDetails")
    private JsonNode additionalDetails = null;

    @JsonProperty("purpose")
    private Purpose purpose = null;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;
}
