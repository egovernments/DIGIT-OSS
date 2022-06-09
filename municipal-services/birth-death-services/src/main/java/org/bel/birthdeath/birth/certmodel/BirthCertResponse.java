
package org.bel.birthdeath.birth.certmodel;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BirthCertResponse {

  @JsonProperty("responseInfo")
  private ResponseInfo responseInfo = null;

  @JsonProperty("birthCertificate")
  private List<BirthCertificate> birthCertificates = null;
  
  @JsonProperty("filestoreId")
  private String filestoreId;
  
  @JsonProperty("consumerCode")
  private String consumerCode;
  
  @JsonProperty("tenantId")
  private String tenantId;

}
