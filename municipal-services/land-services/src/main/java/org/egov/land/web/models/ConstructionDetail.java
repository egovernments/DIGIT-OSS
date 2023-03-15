package org.egov.land.web.models;

import java.math.BigDecimal;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * Construction/constructionDetail details are captured here. Detail information of the constructionDetail including floor wise usage and area are saved as seperate units .For each financial year construction details may change. constructionDetail object is required for tax calculation
 */
@ApiModel(description = "Construction/constructionDetail details are captured here. Detail information of the constructionDetail including floor wise usage and area are saved as seperate units .For each financial year construction details may change. constructionDetail object is required for tax calculation")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:54:07.373Z[GMT]")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConstructionDetail   {
  @JsonProperty("id")
  private String id = null;

  @JsonProperty("carpetArea")
  private BigDecimal carpetArea = null;

  @JsonProperty("builtUpArea")
  private BigDecimal builtUpArea = null;

  @JsonProperty("plinthArea")
  private BigDecimal plinthArea = null;

  @JsonProperty("superBuiltUpArea")
  private BigDecimal superBuiltUpArea = null;

  @JsonProperty("constructionType")
  private String constructionType = null;

  @JsonProperty("constructionDate")
  private Long constructionDate = null;

  @JsonProperty("dimensions")
  private Object dimensions = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;

  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;

  public ConstructionDetail id(String id) {
    this.id = id;
    return this;
  }

  /**
   * id of the property with which the constructionDetail is associated.
   * @return id
  **/
  @ApiModelProperty(value = "id of the property with which the constructionDetail is associated.")
  
  @Size(max=64)   public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public ConstructionDetail carpetArea(BigDecimal carpetArea) {
    this.carpetArea = carpetArea;
    return this;
  }

  /**
   * Total built up area in sq ft(built-up area = carpet area + areas covered by walls)
   * @return carpetArea
  **/
  @ApiModelProperty(value = "Total built up area in sq ft(built-up area = carpet area + areas covered by walls)")
  
    @Valid
    public BigDecimal getCarpetArea() {
    return carpetArea;
  }

  public void setCarpetArea(BigDecimal carpetArea) {
    this.carpetArea = carpetArea;
  }

  public ConstructionDetail builtUpArea(BigDecimal builtUpArea) {
    this.builtUpArea = builtUpArea;
    return this;
  }

  /**
   * Total built up area in sq ft(built-up area = carpet area + areas covered by walls)
   * @return builtUpArea
  **/
  @ApiModelProperty(value = "Total built up area in sq ft(built-up area = carpet area + areas covered by walls)")
  
    @Valid
    public BigDecimal getBuiltUpArea() {
    return builtUpArea;
  }

  public void setBuiltUpArea(BigDecimal builtUpArea) {
    this.builtUpArea = builtUpArea;
  }

  public ConstructionDetail plinthArea(BigDecimal plinthArea) {
    this.plinthArea = plinthArea;
    return this;
  }

  /**
   * Area of the extension builtup of the Unit, Like balcony, sitouts.
   * @return plinthArea
  **/
  @ApiModelProperty(value = "Area of the extension builtup of the Unit, Like balcony, sitouts.")
  
    @Valid
    public BigDecimal getPlinthArea() {
    return plinthArea;
  }

  public void setPlinthArea(BigDecimal plinthArea) {
    this.plinthArea = plinthArea;
  }

  public ConstructionDetail superBuiltUpArea(BigDecimal superBuiltUpArea) {
    this.superBuiltUpArea = superBuiltUpArea;
    return this;
  }

  /**
   * Total built up area in sq ft(built-up area + Common area = Super built-up area)
   * @return superBuiltUpArea
  **/
  @ApiModelProperty(value = "Total built up area in sq ft(built-up area + Common area = Super built-up area)")
  
    @Valid
    public BigDecimal getSuperBuiltUpArea() {
    return superBuiltUpArea;
  }

  public void setSuperBuiltUpArea(BigDecimal superBuiltUpArea) {
    this.superBuiltUpArea = superBuiltUpArea;
  }

  public ConstructionDetail constructionType(String constructionType) {
    this.constructionType = constructionType;
    return this;
  }

  /**
   * Construction type is defined in MDMS ConstructionTypeMaster.
   * @return constructionType
  **/
  @ApiModelProperty(value = "Construction type is defined in MDMS ConstructionTypeMaster.")
  
  @Size(min=1,max=64)   public String getConstructionType() {
    return constructionType;
  }

  public void setConstructionType(String constructionType) {
    this.constructionType = constructionType;
  }

  public ConstructionDetail constructionDate(Long constructionDate) {
    this.constructionDate = constructionDate;
    return this;
  }

  /**
   * The date when the property was constructed
   * @return constructionDate
  **/
  @ApiModelProperty(value = "The date when the property was constructed")
  
    public Long getConstructionDate() {
    return constructionDate;
  }

  public void setConstructionDate(Long constructionDate) {
    this.constructionDate = constructionDate;
  }

  public ConstructionDetail dimensions(Object dimensions) {
    this.dimensions = dimensions;
    return this;
  }

  /**
   * The dimensions of the plot or building or any unit
   * @return dimensions
  **/
  @ApiModelProperty(value = "The dimensions of the plot or building or any unit")
  
    public Object getDimensions() {
    return dimensions;
  }

  public void setDimensions(Object dimensions) {
    this.dimensions = dimensions;
  }

  public ConstructionDetail auditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
    return this;
  }

  /**
   * Get auditDetails
   * @return auditDetails
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public AuditDetails getAuditDetails() {
    return auditDetails;
  }

  public void setAuditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
  }

  public ConstructionDetail additionalDetails(Object additionalDetails) {
    this.additionalDetails = additionalDetails;
    return this;
  }

  /**
   * The json (array of '#/definitions/Factor')
   * @return additionalDetails
  **/
  @ApiModelProperty(value = "The json (array of '#/definitions/Factor')")
  
    public Object getAdditionalDetails() {
    return additionalDetails;
  }

  public void setAdditionalDetails(Object additionalDetails) {
    this.additionalDetails = additionalDetails;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ConstructionDetail constructionDetail = (ConstructionDetail) o;
    return Objects.equals(this.id, constructionDetail.id) &&
        Objects.equals(this.carpetArea, constructionDetail.carpetArea) &&
        Objects.equals(this.builtUpArea, constructionDetail.builtUpArea) &&
        Objects.equals(this.plinthArea, constructionDetail.plinthArea) &&
        Objects.equals(this.superBuiltUpArea, constructionDetail.superBuiltUpArea) &&
        Objects.equals(this.constructionType, constructionDetail.constructionType) &&
        Objects.equals(this.constructionDate, constructionDetail.constructionDate) &&
        Objects.equals(this.dimensions, constructionDetail.dimensions) &&
        Objects.equals(this.auditDetails, constructionDetail.auditDetails) &&
        Objects.equals(this.additionalDetails, constructionDetail.additionalDetails);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, carpetArea, builtUpArea, plinthArea, superBuiltUpArea, constructionType, constructionDate, dimensions, auditDetails, additionalDetails);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ConstructionDetail {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    carpetArea: ").append(toIndentedString(carpetArea)).append("\n");
    sb.append("    builtUpArea: ").append(toIndentedString(builtUpArea)).append("\n");
    sb.append("    plinthArea: ").append(toIndentedString(plinthArea)).append("\n");
    sb.append("    superBuiltUpArea: ").append(toIndentedString(superBuiltUpArea)).append("\n");
    sb.append("    constructionType: ").append(toIndentedString(constructionType)).append("\n");
    sb.append("    constructionDate: ").append(toIndentedString(constructionDate)).append("\n");
    sb.append("    dimensions: ").append(toIndentedString(dimensions)).append("\n");
    sb.append("    auditDetails: ").append(toIndentedString(auditDetails)).append("\n");
    sb.append("    additionalDetails: ").append(toIndentedString(additionalDetails)).append("\n");
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
