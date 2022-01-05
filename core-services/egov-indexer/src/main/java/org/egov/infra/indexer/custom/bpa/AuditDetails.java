package org.egov.infra.indexer.custom.bpa;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import java.util.Objects;

/**
 * Collection of audit related fields used by most models
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditDetails   {
  @JsonProperty("createdBy")
  private String createdBy = null;

  @JsonProperty("lastModifiedBy")
  private String lastModifiedBy = null;

  @JsonProperty("createdTime")
  private Long createdTime = null;

  @JsonProperty("lastModifiedTime")
  private Long lastModifiedTime = null;

  public AuditDetails createdBy(String createdBy) {
    this.createdBy = createdBy;
    return this;
  }

  /**
   * username (preferred) or userid of the user that created the object
   * @return createdBy
  **/

    public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public AuditDetails lastModifiedBy(String lastModifiedBy) {
    this.lastModifiedBy = lastModifiedBy;
    return this;
  }

  /**
   * username (preferred) or userid of the user that last modified the object
   * @return lastModifiedBy
  **/

    public String getLastModifiedBy() {
    return lastModifiedBy;
  }

  public void setLastModifiedBy(String lastModifiedBy) {
    this.lastModifiedBy = lastModifiedBy;
  }

  public AuditDetails createdTime(Long createdTime) {
    this.createdTime = createdTime;
    return this;
  }

  /**
   * epoch of the time object is created
   * @return createdTime
  **/

    public Long getCreatedTime() {
    return createdTime;
  }

  public void setCreatedTime(Long createdTime) {
    this.createdTime = createdTime;
  }

  public AuditDetails lastModifiedTime(Long lastModifiedTime) {
    this.lastModifiedTime = lastModifiedTime;
    return this;
  }

  /**
   * epoch of the time object is last modified
   * @return lastModifiedTime
  **/

    public Long getLastModifiedTime() {
    return lastModifiedTime;
  }

  public void setLastModifiedTime(Long lastModifiedTime) {
    this.lastModifiedTime = lastModifiedTime;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AuditDetails auditDetails = (AuditDetails) o;
    return Objects.equals(this.createdBy, auditDetails.createdBy) &&
        Objects.equals(this.lastModifiedBy, auditDetails.lastModifiedBy) &&
        Objects.equals(this.createdTime, auditDetails.createdTime) &&
        Objects.equals(this.lastModifiedTime, auditDetails.lastModifiedTime);
  }

  @Override
  public int hashCode() {
    return Objects.hash(createdBy, lastModifiedBy, createdTime, lastModifiedTime);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AuditDetails {\n");
    
    sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
    sb.append("    lastModifiedBy: ").append(toIndentedString(lastModifiedBy)).append("\n");
    sb.append("    createdTime: ").append(toIndentedString(createdTime)).append("\n");
    sb.append("    lastModifiedTime: ").append(toIndentedString(lastModifiedTime)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}
