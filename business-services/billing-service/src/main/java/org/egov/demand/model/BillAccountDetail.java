package org.egov.demand.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * BillAccountDetail
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillAccountDetail   {
	
	
        @JsonProperty("id")
        private String id;

        @JsonProperty("tenantId")
        private String tenantId;

        @JsonProperty("billDetail")
        private String billDetail;

        @JsonProperty("demandDetailId")
        private String demandDetailId;

        @JsonProperty("order")
        private Integer order;

        @JsonProperty("amount")
        private BigDecimal amount;

        @JsonProperty("adjustedAmount")
        private BigDecimal adjustedAmount;

        @JsonProperty("glcode")
        private String glcode;

        @JsonProperty("taxHeadCode")
        private String taxHeadCode;
        
        @JsonProperty("additionalDetails")
        private Object additionalDetails;
        
              /**
   * Purpose of Account head.
   */
  public enum PurposeEnum {
    ARREAR("ARREAR"),
    
    CURRENT("CURRENT"),
    
    ADVANCE("ADVANCE"),
    
    OTHERS("OTHERS");

    private String value;

    PurposeEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static PurposeEnum fromValue(String text) {
      for (PurposeEnum b : PurposeEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }
}
