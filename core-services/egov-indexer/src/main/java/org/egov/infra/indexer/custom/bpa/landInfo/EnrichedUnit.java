package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.egov.infra.indexer.custom.bpa.AuditDetails;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Unit
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:54:07.373Z[GMT]")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrichedUnit {
  @JsonProperty("id")
  private String id = null;

  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("floorNo")
  private String floorNo = null;

  @JsonProperty("unitType")
  private String unitType = null;

  @JsonProperty("usageCategory")
  private Set<String> usageCategory = null;

  @JsonProperty("occupancyType")
  private Set<String> occupancyType = null;

  @JsonProperty("occupancyDate")
  private Long occupancyDate = null;

  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;
  
  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;

  public EnrichedUnit id(String id) {
    this.id = id;
    return this;
  }

  /**
   * Unique Identifier of the Unit(UUID).
   * @return id
  **/

    public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public EnrichedUnit tenantId(String tenantId) {
    this.tenantId = tenantId;
    return this;
  }

  /**
   * tenant id of the Property
   * @return tenantId
  **/

  @Size(min=2,max=256)   public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }

  public EnrichedUnit floorNo(String floorNo) {
    this.floorNo = floorNo;
    return this;
  }

  /**
   * floor number of the Unit
   * @return floorNo
  **/

  @Size(min=1,max=64)   public String getFloorNo() {
    return floorNo;
  }

  public void setFloorNo(String floorNo) {
    this.floorNo = floorNo;
  }

  public EnrichedUnit unitType(String unitType) {
    this.unitType = unitType;
    return this;
  }

  /**
   * Unit type is master data.
   * @return unitType
  **/

    public String getUnitType() {
    return unitType;
  }

  public void setUnitType(String unitType) {
    this.unitType = unitType;
  }

  public EnrichedUnit usageCategory(Set<String> usageCategory) {
    this.usageCategory = usageCategory;
    return this;
  }

  /**
   * This is about the usage of the property like Residential, Non-residential, Mixed(Property witch is gettiong used for Residential, Non-residential purpose)
   * @return usageCategory
  **/

  @Size(min=0,max=64)   public Set<String> getUsageCategory() {
    return usageCategory;
  }

  public void setUsageCategory(Set<String> usageCategory) {
    this.usageCategory = usageCategory;
  }

  public EnrichedUnit occupancyType(Set<String> occupancyType) {
    this.occupancyType = occupancyType;
    return this;
  }

  /**
   * Get occupancyType
   * @return occupancyType
  **/

    @Valid
    public Set<String> getOccupancyType() {
    return occupancyType;
  }

  public void setOccupancyType(Set<String> occupancyType) {
    this.occupancyType = occupancyType;
  }

  public EnrichedUnit occupancyDate(Long occupancyDate) {
    this.occupancyDate = occupancyDate;
    return this;
  }

  /**
   * Date on which unit is occupied.
   * @return occupancyDate
  **/

    public Long getOccupancyDate() {
    return occupancyDate;
  }

  public void setOccupancyDate(Long occupancyDate) {
    this.occupancyDate = occupancyDate;
  }

  
  public EnrichedUnit additionalDetails(Object additionalDetails) {
    this.additionalDetails = additionalDetails;
    return this;
  }

  /**
   * Json object to capture any extra information which is not accommodated by model
   * @return additionalDetails
  **/

    public Object getAdditionalDetails() {
    return additionalDetails;
  }

  public void setAdditionalDetails(Object additionalDetails) {
    this.additionalDetails = additionalDetails;
  }

  public EnrichedUnit auditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
    return this;
  }

  /**
   * Get geoLocation
   * @return geoLocation
  **/

  
    @Valid
    public AuditDetails getAuditDetails() {
    return auditDetails;
  }

  public void setAuditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EnrichedUnit unit = (EnrichedUnit) o;
    return Objects.equals(this.id, unit.id) &&
        Objects.equals(this.tenantId, unit.tenantId) &&
        Objects.equals(this.floorNo, unit.floorNo) &&
        Objects.equals(this.unitType, unit.unitType) &&
        Objects.equals(this.usageCategory, unit.usageCategory) &&
        Objects.equals(this.occupancyType, unit.occupancyType) &&
        Objects.equals(this.occupancyDate, unit.occupancyDate) &&
        Objects.equals(this.additionalDetails, unit.additionalDetails) &&
        Objects.equals(this.auditDetails, unit.auditDetails);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, tenantId, floorNo, unitType, usageCategory, occupancyType, occupancyDate, additionalDetails, auditDetails);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Unit {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
    sb.append("    floorNo: ").append(toIndentedString(floorNo)).append("\n");
    sb.append("    unitType: ").append(toIndentedString(unitType)).append("\n");
    sb.append("    usageCategory: ").append(toIndentedString(usageCategory)).append("\n");
    sb.append("    occupancyType: ").append(toIndentedString(occupancyType)).append("\n");
    sb.append("    occupancyDate: ").append(toIndentedString(occupancyDate)).append("\n");
    sb.append("    additionalDetails: ").append(toIndentedString(additionalDetails)).append("\n");
    sb.append("    auditDetails: ").append(toIndentedString(auditDetails)).append("\n");
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
