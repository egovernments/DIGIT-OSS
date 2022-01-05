package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Objects;

/**
 * minimal representation of the Roles in the system to be carried along in UserInfo with RequestInfo meta data. Actual authorization service to extend this to have more role related attributes 
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role   {
  @JsonProperty("name")
  private String name = null;

  @JsonProperty("code")
  private String code = null;

  @JsonProperty("description")
  private String description = null;

  public Role name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Unique name of the role
   * @return name
  **/
      @NotNull

  @Size(max=64)   public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Role code(String code) {
    this.code = code;
    return this;
  }

  /**
   * Unique code of the role
   * @return code
  **/

  @Size(max=64)   public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public Role description(String description) {
    this.description = description;
    return this;
  }

  /**
   * brief description of the role
   * @return description
  **/

    public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Role role = (Role) o;
    return Objects.equals(this.name, role.name) &&
        Objects.equals(this.code, role.code) &&
        Objects.equals(this.description, role.description);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, code, description);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Role {\n");
    
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    code: ").append(toIndentedString(code)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
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
