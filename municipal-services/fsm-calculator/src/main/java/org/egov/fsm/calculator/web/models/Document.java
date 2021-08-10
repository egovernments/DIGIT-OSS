package org.egov.fsm.calculator.web.models;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * This object holds list of documents attached during the transaciton for a property
 */
@ApiModel(description = "This object holds list of documents attached during the transaciton for a property")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:54:07.373Z[GMT]")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Document   {
  @JsonProperty("id")
  private String id = null;

  @JsonProperty("documentType")
  private String documentType = null;

  @JsonProperty("fileStoreId")
  private String fileStoreId = null;

  @JsonProperty("documentUid")
  private String documentUid = null;

  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;
  
  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;

}
