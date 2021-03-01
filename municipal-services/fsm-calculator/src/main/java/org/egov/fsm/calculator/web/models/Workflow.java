package org.egov.fsm.calculator.web.models;

import java.util.List;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * BPA application object to capture the details of land, land owners, and address of the land.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class Workflow   {
  @JsonProperty("action")
  private String action = null;

  @JsonProperty("assignes")
  @Valid
  private List<String> assignes = null;

  @JsonProperty("comments")
  private String comments = null;

  @JsonProperty("varificationDocuments")
  @Valid
  private List<Document> varificationDocuments = null;

}
