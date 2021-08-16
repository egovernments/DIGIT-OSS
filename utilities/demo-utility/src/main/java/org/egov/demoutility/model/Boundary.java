package org.egov.demoutility.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Boundary
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-09T07:13:46.742Z[GMT]")

@AllArgsConstructor
@EqualsAndHashCode
@NoArgsConstructor
@ToString
@Builder
public class Boundary   {
  @SafeHtml
  @JsonProperty("code")
  private String code = null;

  @SafeHtml
  @JsonProperty("name")
  private String name = null;

  @SafeHtml
  @JsonProperty("label")
  private String label = null;

  @SafeHtml
  @JsonProperty("latitude")
  private String latitude = null;

  @SafeHtml
  @JsonProperty("longitude")
  private String longitude = null;

  @JsonProperty("children")
  @Valid
  private List<Boundary> children = null;

  @SafeHtml
  @JsonProperty("materializedPath")
  private String materializedPath = null;

  public Boundary code(String code) {
    this.code = code;
    return this;
  }

  /**
   * code of the boundary.
   * @return code
   **/
 
      @NotNull

    public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public Boundary name(String name) {
    this.name = name;
    return this;
  }

  /**
   * name of the boundary.
   * @return name
   **/
  
      @NotNull

    public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Boundary label(String label) {
    this.label = label;
    return this;
  }

  /**
   * localized label for the boundry.
   * @return label
   **/
  
  
    public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public Boundary latitude(String latitude) {
    this.latitude = latitude;
    return this;
  }

  /**
   * latitude of the boundary.
   * @return latitude
   **/
  
  
    public String getLatitude() {
    return latitude;
  }

  public void setLatitude(String latitude) {
    this.latitude = latitude;
  }

  public Boundary longitude(String longitude) {
    this.longitude = longitude;
    return this;
  }

  /**
   * longitude of the boundary.
   * @return longitude
   **/
  
  
    public String getLongitude() {
    return longitude;
  }

  public void setLongitude(String longitude) {
    this.longitude = longitude;
  }

  public Boundary children(List<Boundary> children) {
    this.children = children;
    return this;
  }

  public Boundary addChildrenItem(Boundary childrenItem) {
    if (this.children == null) {
      this.children = new ArrayList<Boundary>();
    }
    this.children.add(childrenItem);
    return this;
  }

  /**
   * Get children
   * @return children
   **/
  
      @Valid
    public List<Boundary> getChildren() {
    return children;
  }

  public void setChildren(List<Boundary> children) {
    this.children = children;
  }

  public Boundary materializedPath(String materializedPath) {
    this.materializedPath = materializedPath;
    return this;
  }

  /**
   * materialized path of the boundary - this would be of the format tenantid.[code] from parentt till teh current boundary
   * @return materializedPath
   **/
  
  
    public String getMaterializedPath() {
    return materializedPath;
  }

  public void setMaterializedPath(String materializedPath) {
    this.materializedPath = materializedPath;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Boundary boundary = (Boundary) o;
    return Objects.equals(this.code, boundary.code) &&
        Objects.equals(this.name, boundary.name) &&
        Objects.equals(this.label, boundary.label) &&
        Objects.equals(this.latitude, boundary.latitude) &&
        Objects.equals(this.longitude, boundary.longitude) &&
        Objects.equals(this.children, boundary.children) &&
        Objects.equals(this.materializedPath, boundary.materializedPath);
  }

  @Override
  public int hashCode() {
    return Objects.hash(code, name, label, latitude, longitude, children, materializedPath);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Boundary {\n");
    
    sb.append("    code: ").append(toIndentedString(code)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    label: ").append(toIndentedString(label)).append("\n");
    sb.append("    latitude: ").append(toIndentedString(latitude)).append("\n");
    sb.append("    longitude: ").append(toIndentedString(longitude)).append("\n");
    sb.append("    children: ").append(toIndentedString(children)).append("\n");
    sb.append("    materializedPath: ").append(toIndentedString(materializedPath)).append("\n");
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
