package org.egov.bpa.calculator.web.models;

import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * Unit
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:54:07.373Z[GMT]")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Unit   {
  @JsonProperty("id")
  private String id = null;

  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("floorNo")
  private String floorNo = null;

  @JsonProperty("unitType")
  private String unitType = null;

  @JsonProperty("usageCategory")
  private String usageCategory = null;

  @JsonProperty("occupancyType")
  private String occupancyType = null;

  @JsonProperty("occupancyDate")
  private Long occupancyDate = null;

  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;
  
  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;

  public Unit id(String id) {
    this.id = id;
    return this;
  }

  /**
   * Unique Identifier of the Unit(UUID).
   * @return id
  **/
  @ApiModelProperty(value = "Unique Identifier of the Unit(UUID).")
  
    public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Unit tenantId(String tenantId) {
    this.tenantId = tenantId;
    return this;
  }

  /**
   * tenant id of the Property
   * @return tenantId
  **/
  @ApiModelProperty(value = "tenant id of the Property")
  
  @Size(min=2,max=256)   public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }

  public Unit floorNo(String floorNo) {
    this.floorNo = floorNo;
    return this;
  }

  /**
   * floor number of the Unit
   * @return floorNo
  **/
  @ApiModelProperty(value = "floor number of the Unit")
  
  @Size(min=1,max=64)   public String getFloorNo() {
    return floorNo;
  }

  public void setFloorNo(String floorNo) {
    this.floorNo = floorNo;
  }

  public Unit unitType(String unitType) {
    this.unitType = unitType;
    return this;
  }

  /**
   * Unit type is master data.
   * @return unitType
  **/
  @ApiModelProperty(example = "Building, Room, Kitchen etc.", value = "Unit type is master data.")
  
    public String getUnitType() {
    return unitType;
  }

  public void setUnitType(String unitType) {
    this.unitType = unitType;
  }

  public Unit usageCategory(String usageCategory) {
    this.usageCategory = usageCategory;
    return this;
  }

  /**
   * This is about the usage of the property like Residential, Non-residential, Mixed(Property witch is gettiong used for Residential, Non-residential purpose)
   * @return usageCategory
  **/
  @ApiModelProperty(value = "This is about the usage of the property like Residential, Non-residential, Mixed(Property witch is gettiong used for Residential, Non-residential purpose)")
  
  @Size(min=0,max=64)   public String getUsageCategory() {
    return usageCategory;
  }

  public void setUsageCategory(String usageCategory) {
    this.usageCategory = usageCategory;
  }

  public Unit occupancyType(String occupancyType) {
    this.occupancyType = occupancyType;
    return this;
  }

  /**
   * Get occupancyType
   * @return occupancyType
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public String getOccupancyType() {
    return occupancyType;
  }

  public void setOccupancyType(String occupancyType) {
    this.occupancyType = occupancyType;
  }

  public Unit occupancyDate(Long occupancyDate) {
    this.occupancyDate = occupancyDate;
    return this;
  }

  /**
   * Date on which unit is occupied.
   * @return occupancyDate
  **/
  @ApiModelProperty(value = "Date on which unit is occupied.")
  
    public Long getOccupancyDate() {
    return occupancyDate;
  }

  public void setOccupancyDate(Long occupancyDate) {
    this.occupancyDate = occupancyDate;
  }

  
  public Unit additionalDetails(Object additionalDetails) {
    this.additionalDetails = additionalDetails;
    return this;
  }

  /**
   * Json object to capture any extra information which is not accommodated by model
   * @return additionalDetails
  **/
  @ApiModelProperty(value = "Json object to capture any extra information which is not accommodated by model")
  
    public Object getAdditionalDetails() {
    return additionalDetails;
  }

  public void setAdditionalDetails(Object additionalDetails) {
    this.additionalDetails = additionalDetails;
  }

  public Unit auditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
    return this;
  }

  /**
   * Get geoLocation
   * @return geoLocation
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public AuditDetails getAuditDetails() {
    return auditDetails;
  }

  public void setAuditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Unit unit = (Unit) o;
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
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}
