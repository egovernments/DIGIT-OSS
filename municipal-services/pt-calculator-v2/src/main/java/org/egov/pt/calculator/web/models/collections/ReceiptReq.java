package org.egov.pt.calculator.web.models.collections;


import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@Builder
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptReq   {
	
  @JsonProperty("tenantId")
  private String tenantId;
  
  @NotNull
  @JsonProperty("RequestInfo")
  private RequestInfo requestInfo;
  
  @NotNull
  @JsonProperty("Receipt")
  private List<Receipt> receipt;
  
}
