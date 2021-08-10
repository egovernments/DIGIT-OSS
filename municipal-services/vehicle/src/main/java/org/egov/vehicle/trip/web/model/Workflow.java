package org.egov.vehicle.trip.web.model;

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

/**
 * BPA application object to capture the details of land, land owners, and address of the land.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Workflow   {
  @SafeHtml
  @JsonProperty("action")
  private String action = null;

  @JsonProperty("assignes")
  @Valid
  private List<String> assignes = null;

  @SafeHtml
  @JsonProperty("comments")
  private String comments = null;

  @JsonProperty("verificationDocuments")
  @Valid
  private List<Document> verificationDocuments = null;

  
  @JsonProperty("rating")
  private Integer rating = null;

  
}
