package org.bel.birthdeath.common.calculation.demand.models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.bel.birthdeath.common.model.AuditDetails;
import org.egov.common.contract.request.User;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A Object which holds the basic info about the revenue assessment for which the org.bel.birthdeath.common.calculation.demand.models is generated like module name, consumercode, owner, etc.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Demand   {

    @JsonProperty("id")
    @Valid
    private String id;

    @JsonProperty("tenantId")
    @Valid
    private String tenantId;

    @JsonProperty("consumerCode")
    @Valid
    private String consumerCode;

    @JsonProperty("consumerType")
    @Valid
    private String consumerType;

    @JsonProperty("businessService")
    @Valid
    private String businessService;

    @Valid
    @JsonProperty("payer")
    private User payer;

    @JsonProperty("taxPeriodFrom")
    @Valid
    private Long taxPeriodFrom;

    @JsonProperty("taxPeriodTo")
    @Valid
    private Long taxPeriodTo;

    @Builder.Default
    @JsonProperty("demandDetails")
    @Valid
    private List<DemandDetail> demandDetails = new ArrayList<>();

    @JsonProperty("auditDetails")
    @Valid
    private AuditDetails auditDetails;

    @JsonProperty("additionalDetails")
    @Valid
    private Object additionalDetails;

    @Builder.Default
    @JsonProperty("minimumAmountPayable")
    @Valid
    private BigDecimal minimumAmountPayable = BigDecimal.ZERO;

    /**
     * Gets or Sets status
     */
    public enum StatusEnum {

        ACTIVE("ACTIVE"),

        CANCELLED("CANCELLED"),

        ADJUSTED("ADJUSTED");

        private String value;

        StatusEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static StatusEnum fromValue(String text) {
            for (StatusEnum b : StatusEnum.values()) {
                if (String.valueOf(b.value).equalsIgnoreCase(text)) {
                    return b;
                }
            }
            return null;
        }
    }

    @JsonProperty("status")
    @Valid
    private StatusEnum status;


    public Demand addDemandDetailsItem(DemandDetail demandDetailsItem) {
        this.demandDetails.add(demandDetailsItem);
        return this;
    }

}