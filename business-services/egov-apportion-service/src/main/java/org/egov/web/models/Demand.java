package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.User;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * A Object which holds the basic info about the revenue assessment for which the demand is generated like module name, consumercode, owner, etc.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Demand   {
	
        @JsonProperty("id")
        private String id;

        @NotNull
        @JsonProperty("tenantId")
        private String tenantId;

        @NotNull
        @JsonProperty("consumerCode")
        private String consumerCode;

        @NotNull
        @JsonProperty("consumerType")
        private String consumerType;

        @NotNull
        @JsonProperty("businessService")
        private String businessService;

        @Valid
        @JsonProperty("payer")
        private User payer;

        @NotNull
        @JsonProperty("taxPeriodFrom")
        private Long taxPeriodFrom;

        @NotNull
        @JsonProperty("taxPeriodTo")
        private Long taxPeriodTo;

        @Default
        @JsonProperty("demandDetails")
        @Valid
        @NotNull
        @Size(min=1)
        private List<DemandDetail> demandDetails = new ArrayList<>();

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails;
        
        @JsonProperty("billExpiryTime")
        private Long billExpiryTime;

        @JsonProperty("additionalDetails")
        private Object additionalDetails;

        @Default
        @JsonProperty("minimumAmountPayable")
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
        private StatusEnum status;


        public Demand addDemandDetailsItem(DemandDetail demandDetailsItem) {
        this.demandDetails.add(demandDetailsItem);
        return this;
        }

}
