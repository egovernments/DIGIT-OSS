package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Setter
@Getter
@ToString
@AllArgsConstructor
public class ReceiptRes   {

  @JsonProperty("ResponseInfo")
  private ResponseInfo responseInfo;
  
  @JsonProperty("Receipt")
  private List<Receipt> receipts;
  
}
