package org.egov.bpa.calculator.web.models.demand;

import java.math.BigDecimal;

import org.egov.bpa.calculator.web.models.AuditDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DemandDetail {

    @JsonProperty("id")
    private String id;
    
    @JsonProperty("demandId")
    private String demandId;

    @JsonProperty("taxHeadMasterCode")
    private String taxHeadMasterCode;

    @JsonProperty("taxAmount")
    private BigDecimal taxAmount;

    @Default
    @JsonProperty("collectionAmount")
    private BigDecimal collectionAmount = BigDecimal.ZERO;

    @JsonProperty("additionalDetails")
    private Object additionalDetails;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

    @JsonProperty("tenantId")
    private String tenantId;

}
