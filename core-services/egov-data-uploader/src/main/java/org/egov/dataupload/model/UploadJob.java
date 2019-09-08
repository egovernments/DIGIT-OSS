package org.egov.dataupload.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.egov.dataupload.property.models.AuditDetails;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadJob   {
  @JsonProperty("tenantId")
  private String tenantId;

  @JsonProperty("moduleName")
  private String moduleName;

  @JsonProperty("defName")
  private String defName;

  @JsonProperty("code")
  private String code;

  @JsonProperty("requestFilePath")
  private String requestFilePath;

  @JsonProperty("responseFilePath")
  private String responseFilePath;

  @JsonProperty("requestFileName")
  private String requestFileName;
  
  public enum StatusEnum {
    NEW("new"),
    
    INPROGRESS("InProgress"),
    
    COMPLETED("completed"),
    
    FAILED("failed");

    private String value;

    StatusEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static StatusEnum fromValue(String text) {
      for (StatusEnum b : StatusEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }

  @JsonProperty("status")
  private StatusEnum status;

  @JsonProperty("totalRows")
  private Integer totalRows;

  @JsonProperty("successfulRows")
  private Integer successfulRows;

  @JsonProperty("failedRows")
  private Integer failedRows;

  @JsonProperty("requesterName")
  private String requesterName;
  
  @JsonProperty("startTime")
  private Long startTime;
  
  @JsonProperty("endTime")
  private Long endTime;
  
  @JsonProperty("localFilePath")
  private String localFilePath;
  
  @JsonProperty("reasonForFailure")
  private String reasonForFailure;

  private AuditDetails auditDetails;


}
