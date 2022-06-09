package org.bel.birthdeath.common.calculation.demand.models;

import java.math.BigDecimal;

import org.bel.birthdeath.common.model.AuditDetails;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;

/**
 * A object holds a org.bel.birthdeath.common.calculation.demand.models and collection values for a tax head and period.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DemandDetail   {
	
        @JsonProperty("id")
        @Valid
        private String id;
        
        @JsonProperty("demandId")
        @Valid
        private String demandId;

        @JsonProperty("taxHeadMasterCode")
        @Valid
        private String taxHeadMasterCode;

        @JsonProperty("taxAmount")
        @Valid
        private BigDecimal taxAmount;

        @Default
        @JsonProperty("collectionAmount")
        @Valid
        private BigDecimal collectionAmount = BigDecimal.ZERO;

        @JsonProperty("additionalDetails")
        @Valid
        private Object additionalDetails;

        @JsonProperty("auditDetails")
        @Valid
        private AuditDetails auditDetails;

        @JsonProperty("tenantId")
        @Valid
        private String tenantId;


}

