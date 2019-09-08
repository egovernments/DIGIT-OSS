package org.egov.collection.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;



@Setter
@Getter
@ToString
@EqualsAndHashCode
@Builder
public class BankAccount   {
  private Long id;

  @JsonProperty("BankBranch")
  private BankBranch bankBranch;

  @JsonProperty("ChartOfAccount")
  private ChartOfAccount chartOfAccount;

  @JsonProperty("Fund")
  private Fund fund;

  private String accountNumber;

  private String accountType;

  private String description;

  private Boolean active;

  private String payTo;

/*  public enum TypeEnum {
    RECEIPTS("RECEIPTS"),
    
    PAYMENTS("PAYMENTS"),
    
    RECEIPTS_PAYMENTS("RECEIPTS_PAYMENTS");

    private String value;

    TypeEnum(String value) {
      this.value = value;
    }
  } */
}

