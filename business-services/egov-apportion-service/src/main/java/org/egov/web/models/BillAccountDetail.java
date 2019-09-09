package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.web.models.enums.Purpose;
import org.springframework.validation.annotation.Validated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * BillAccountDetail
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2019-02-25T15:07:36.183+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillAccountDetail {

        @JsonProperty("id")
        private String id = null;

        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("billDetail")
        private String billDetail = null;

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

        @JsonProperty("glcode")
        private String glcode = null;

        @JsonProperty("taxHeadCode")
        private String taxHeadCode = null;

        @JsonProperty("additionalDetails")
        private JsonNode additionalDetails = null;

        @JsonProperty("purpose")
        private Purpose purpose = null;
}