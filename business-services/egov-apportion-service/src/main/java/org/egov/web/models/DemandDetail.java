package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * A object holds a demand and collection values for a tax head and period.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DemandDetail   {

        @NotNull
        @JsonProperty("id")
        private String id;
        
        @JsonProperty("demandId")
        private String demandId;

        @NotNull @JsonProperty("taxHeadMasterCode")
        private String taxHeadMasterCode;

        @NotNull @JsonProperty("taxAmount")
        private BigDecimal taxAmount;

        @NotNull @JsonProperty("collectionAmount") @Default 
        private BigDecimal collectionAmount = BigDecimal.ZERO;

        @JsonProperty("additionalDetails")
        private Object additionalDetails;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails;

        @JsonProperty("tenantId")
        private String tenantId;
}
