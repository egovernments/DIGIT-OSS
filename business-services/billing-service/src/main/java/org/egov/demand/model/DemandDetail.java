package org.egov.demand.model;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.SafeHtml;

/**
 * A object holds a demand and collection values for a tax head and period.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DemandDetail   {

        @SafeHtml
        @JsonProperty("id")
        private String id;

        @SafeHtml
        @JsonProperty("demandId")
        private String demandId;

        @SafeHtml
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

        @SafeHtml
        @JsonProperty("tenantId")
        private String tenantId;
}
