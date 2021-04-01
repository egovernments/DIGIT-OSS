package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.pt.calculator.web.models.property.AuditDetails;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of= {"fileStoreId","documentUid","id"})
public class DocumentV2 {

  @JsonProperty("id")
  private String id ;

  @JsonProperty("documentType")
  @NotNull
  private String documentType ;

  @JsonProperty("fileStoreId")
  @NotNull
  private String fileStoreId ;

  @JsonProperty("documentUid")
  private String documentUid ;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails;

  @JsonProperty("status")
  private String status;
}

