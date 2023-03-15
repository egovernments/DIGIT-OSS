package org.egov.demand.amendment.model;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * This object holds list of documents attached during the transaciton for a property
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document   {
	
  @JsonProperty("id")
  private String id;

  @JsonProperty("documentType")
  @NotNull
  private String documentType;

  @JsonProperty("fileStoreId")
  @NotNull
  private String fileStoreId;

  @JsonProperty("documentUid")
  private String documentUid;

  @JsonProperty("additionalDetails")
  private Object additionalDetails;

}

