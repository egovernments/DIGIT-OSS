package org.egov.waterconnection.web.models;

import javax.validation.constraints.NotNull;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.SafeHtml;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of= {"fileStoreId","documentUid","id"})
public class Document {

  @SafeHtml
  @JsonProperty("id")
  private String id ;

  @JsonProperty("documentType")
  @NotNull
  @SafeHtml
  private String documentType ;

  @JsonProperty("fileStoreId")
  @NotNull
  @SafeHtml
  private String fileStoreId ;

  @SafeHtml
  @JsonProperty("documentUid")
  private String documentUid ;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails;

  @JsonProperty("status")
  private Status status;
}

