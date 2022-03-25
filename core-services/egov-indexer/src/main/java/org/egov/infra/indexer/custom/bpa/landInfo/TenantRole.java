package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.Role;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * User role carries the tenant related role information for the user. A user can have multiple roles per tenant based on the need of the tenant. A user may also have multiple roles for multiple tenants.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantRole   {
  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("roles")
  @Valid
  private List<Role> roles = new ArrayList<Role>();

  public TenantRole tenantId(String tenantId) {
    this.tenantId = tenantId;
    return this;
  }

  /**
   * tenantid for the tenant
   * @return tenantId
  **/
      @NotNull

    public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }

  public TenantRole roles(List<Role> roles) {
    this.roles = roles;
    return this;
  }

  public TenantRole addRolesItem(Role rolesItem) {
    this.roles.add(rolesItem);
    return this;
  }

  /**
   * Roles assigned for a particular tenant - array of role codes/names
   * @return roles
  **/
      @NotNull
    @Valid
    public List<Role> getRoles() {
    return roles;
  }

  public void setRoles(List<Role> roles) {
    this.roles = roles;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TenantRole tenantRole = (TenantRole) o;
    return Objects.equals(this.tenantId, tenantRole.tenantId) &&
        Objects.equals(this.roles, tenantRole.roles);
  }

  @Override
  public int hashCode() {
    return Objects.hash(tenantId, roles);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class TenantRole {\n");
    
    sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
    sb.append("    roles: ").append(toIndentedString(roles)).append("\n");
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
