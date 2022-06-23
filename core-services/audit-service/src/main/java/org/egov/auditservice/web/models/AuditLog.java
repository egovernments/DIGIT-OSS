package org.egov.auditservice.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import java.util.Map;

@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2022-03-30T07:20:03.639Z[GMT]")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AuditLog {
  @JsonProperty("id")
  private String id = null;
  @JsonProperty("userUUID")
  private String userUUID = null;
  @JsonProperty("module")
  private String module = null;
  @JsonProperty("tenantId")
  private String tenantId = null;
  @JsonProperty("transactionCode")
  private String transactionCode = null;
  @JsonProperty("changeDate")
  private Long changeDate = null;
  @JsonProperty("entityName")
  private String entityName = null;
  @JsonProperty("objectId")
  private String objectId = null;
  @JsonProperty("keyValuePairs")
  private Map<String, Object> keyValuePairs = null;
  @JsonProperty("operationType")
  private String operationType = null;
  @JsonProperty("integrityHash")
  private String integrityHash = null;
}
