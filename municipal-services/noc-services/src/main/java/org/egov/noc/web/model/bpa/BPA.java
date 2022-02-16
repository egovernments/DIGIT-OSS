package org.egov.noc.web.model.bpa;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class BPA   {
  @SafeHtml
  @JsonProperty("id")
  private String id = null;

  @SafeHtml
  @JsonProperty("applicationNo")
  private String applicationNo = null;
  @SafeHtml
  @JsonProperty("businessService")
  private String businessService = null;
  @SafeHtml
  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("landInfo")
  private LandInfo landInfo = null;

}
