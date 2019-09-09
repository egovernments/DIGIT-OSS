package org.egov.collection.web.contract;

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
public class RemittanceResponse   {

  @JsonProperty("ResponseInfo")
  private ResponseInfo responseInfo;
  
  @JsonProperty("Remittance")
  private List<Remittance> remittances;
  
}
