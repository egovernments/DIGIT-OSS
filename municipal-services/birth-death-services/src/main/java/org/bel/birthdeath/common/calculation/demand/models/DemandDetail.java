package org.bel.birthdeath.common.calculation.demand.models;

import java.math.BigDecimal;

import org.bel.birthdeath.common.model.AuditDetails;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A object holds a org.bel.birthdeath.common.calculation.demand.models and collection values for a tax head and period.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DemandDetail   {
	
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

