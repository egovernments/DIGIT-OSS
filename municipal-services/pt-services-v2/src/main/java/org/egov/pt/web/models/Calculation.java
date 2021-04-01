package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Calculation
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Calculation {
	
        @JsonProperty("serviceNumber")
        private String serviceNumber;

        @JsonProperty("totalAmount")
        private BigDecimal totalAmount;
        
        private BigDecimal taxAmount; 

        @JsonProperty("penalty")
        private BigDecimal penalty;

        @JsonProperty("exemption")
        private BigDecimal exemption;

        @JsonProperty("rebate")
        private BigDecimal rebate;

        @JsonProperty("fromDate")
        private Long fromDate;

        @JsonProperty("toDate")
        private Long toDate;

        @JsonProperty("tenantId")
        private String tenantId;

        List<TaxHeadEstimate> taxHeadEstimates;

        @JsonProperty("billingSlabIds")
        private List<String> billingSlabIds;
}

