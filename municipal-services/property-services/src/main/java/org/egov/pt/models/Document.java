package org.egov.pt.models;

import org.egov.pt.models.enums.Status;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


/**
 * This object holds list of documents attached during the transaction for a property
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document   {
	
  @JsonProperty("id")
  private String id;
  
  @JsonProperty("status")
  private Status status;

  @JsonProperty("documentType")
  private String documentType;

  @JsonProperty("fileStore")
  private String fileStore;

  @JsonProperty("documentUid")
  private String documentUid;

  @JsonProperty("additionalDetails")
  private Object additionalDetails;
}
