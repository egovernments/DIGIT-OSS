package org.egov.noc.web.model.bpa;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

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
@Getter
@Setter
public class LandInfo   {
  @SafeHtml
  @JsonProperty("id")
  private String id = null;

  @SafeHtml
  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("owners")
  @Valid
  private List<OwnerInfo> owners = new ArrayList<OwnerInfo>();

}
