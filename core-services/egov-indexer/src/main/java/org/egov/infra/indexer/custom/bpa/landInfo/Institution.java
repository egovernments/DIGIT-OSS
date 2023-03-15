package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Size;
import java.util.Objects;

/**
 * Institution
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Institution   {
  @JsonProperty("id")
  private String id = null;

  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("type")
  private String type = null;

  @JsonProperty("designation")
  private String designation = null;

  @JsonProperty("nameOfAuthorizedPerson")
  private String nameOfAuthorizedPerson = null;

  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;

  public Institution id(String id) {
    this.id = id;
    return this;
  }

  /**
   * Unique Identifier of the Institution(UUID).
   * @return id
  **/

  @Size(max=64)   public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Institution tenantId(String tenantId) {
    this.tenantId = tenantId;
    return this;
  }

  /**
   * tenant id of the Property
   * @return tenantId
  **/

  @Size(max=256)   public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }

  public Institution type(String type) {
    this.type = type;
    return this;
  }

  /**
   * Institution type.
   * @return type
  **/

  @Size(max=64)   public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Institution designation(String designation) {
    this.designation = designation;
    return this;
  }

  /**
   * Designation of the person creating/updatingentity on behalf of the institution
   * @return designation
  **/

  @Size(max=64)   public String getDesignation() {
    return designation;
  }

  public void setDesignation(String designation) {
    this.designation = designation;
  }

  public Institution nameOfAuthorizedPerson(String nameOfAuthorizedPerson) {
    this.nameOfAuthorizedPerson = nameOfAuthorizedPerson;
    return this;
  }

  /**
   * Name of the person who is taking action on behalf of institution
   * @return nameOfAuthorizedPerson
  **/

  @Size(max=256)   public String getNameOfAuthorizedPerson() {
    return nameOfAuthorizedPerson;
  }

  public void setNameOfAuthorizedPerson(String nameOfAuthorizedPerson) {
    this.nameOfAuthorizedPerson = nameOfAuthorizedPerson;
  }

  public Institution additionalDetails(Object additionalDetails) {
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


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Institution institution = (Institution) o;
    return Objects.equals(this.id, institution.id) &&
        Objects.equals(this.tenantId, institution.tenantId) &&
        Objects.equals(this.type, institution.type) &&
        Objects.equals(this.designation, institution.designation) &&
        Objects.equals(this.nameOfAuthorizedPerson, institution.nameOfAuthorizedPerson) &&
        Objects.equals(this.additionalDetails, institution.additionalDetails);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, tenantId, type, designation, nameOfAuthorizedPerson, additionalDetails);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Institution {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
    sb.append("    type: ").append(toIndentedString(type)).append("\n");
    sb.append("    designation: ").append(toIndentedString(designation)).append("\n");
    sb.append("    nameOfAuthorizedPerson: ").append(toIndentedString(nameOfAuthorizedPerson)).append("\n");
    sb.append("    additionalDetails: ").append(toIndentedString(additionalDetails)).append("\n");
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
