package org.egov.bpa.web.model.landInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.Role;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * This is acting ID token of the authenticated user on the server. Any value provided by the clients will be ignored and actual user based on authtoken will be used on the server.
 */
@ApiModel(description = "This is acting ID token of the authenticated user on the server. Any value provided by the clients will be ignored and actual user based on authtoken will be used on the server.")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfo   {
  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("uuid")
  private String uuid = null;

  @JsonProperty("userName")
  private String userName = null;

  @JsonProperty("password")
  private String password = null;

  @JsonProperty("idToken")
  private String idToken = null;

  @JsonProperty("mobile")
  private String mobile = null;

  @JsonProperty("email")
  private String email = null;

  @JsonProperty("primaryrole")
  @Valid
  private List<Role> primaryrole = new ArrayList<Role>();

  @JsonProperty("additionalroles")
  @Valid
  private List<TenantRole> additionalroles = null;

  public UserInfo tenantId(String tenantId) {
    this.tenantId = tenantId;
    return this;
  }

  /**
   * Unique Identifier of the tenant to which user primarily belongs
   * @return tenantId
  **/
  @ApiModelProperty(required = true, value = "Unique Identifier of the tenant to which user primarily belongs")
      @NotNull

    public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }

  public UserInfo uuid(String uuid) {
    this.uuid = uuid;
    return this;
  }

  /**
   * System Generated User id of the authenticated user.
   * @return uuid
  **/
  @ApiModelProperty(value = "System Generated User id of the authenticated user.")
  
    public String getUuid() {
    return uuid;
  }

  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

  public UserInfo userName(String userName) {
    this.userName = userName;
    return this;
  }

  /**
   * Unique user name of the authenticated user
   * @return userName
  **/
  @ApiModelProperty(required = true, value = "Unique user name of the authenticated user")
      @NotNull

    public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public UserInfo password(String password) {
    this.password = password;
    return this;
  }

  /**
   * password of the user.
   * @return password
  **/
  @ApiModelProperty(value = "password of the user.")
  
    public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public UserInfo idToken(String idToken) {
    this.idToken = idToken;
    return this;
  }

  /**
   * This will be the OTP.
   * @return idToken
  **/
  @ApiModelProperty(value = "This will be the OTP.")
  
    public String getIdToken() {
    return idToken;
  }

  public void setIdToken(String idToken) {
    this.idToken = idToken;
  }

  public UserInfo mobile(String mobile) {
    this.mobile = mobile;
    return this;
  }

  /**
   * mobile number of the autheticated user
   * @return mobile
  **/
  @ApiModelProperty(value = "mobile number of the autheticated user")
  
    public String getMobile() {
    return mobile;
  }

  public void setMobile(String mobile) {
    this.mobile = mobile;
  }

  public UserInfo email(String email) {
    this.email = email;
    return this;
  }

  /**
   * email address of the authenticated user
   * @return email
  **/
  @ApiModelProperty(value = "email address of the authenticated user")
  
    public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public UserInfo primaryrole(List<Role> primaryrole) {
    this.primaryrole = primaryrole;
    return this;
  }

  public UserInfo addPrimaryroleItem(Role primaryroleItem) {
    this.primaryrole.add(primaryroleItem);
    return this;
  }

  /**
   * List of all the roles for the primary tenant
   * @return primaryrole
  **/
  @ApiModelProperty(required = true, value = "List of all the roles for the primary tenant")
      @NotNull
    @Valid
    public List<Role> getPrimaryrole() {
    return primaryrole;
  }

  public void setPrimaryrole(List<Role> primaryrole) {
    this.primaryrole = primaryrole;
  }

  public UserInfo additionalroles(List<TenantRole> additionalroles) {
    this.additionalroles = additionalroles;
    return this;
  }

  public UserInfo addAdditionalrolesItem(TenantRole additionalrolesItem) {
    if (this.additionalroles == null) {
      this.additionalroles = new ArrayList<TenantRole>();
    }
    this.additionalroles.add(additionalrolesItem);
    return this;
  }

  /**
   * array of additional tenantids authorized for the authenticated user
   * @return additionalroles
  **/
  @ApiModelProperty(value = "array of additional tenantids authorized for the authenticated user")
      @Valid
    public List<TenantRole> getAdditionalroles() {
    return additionalroles;
  }

  public void setAdditionalroles(List<TenantRole> additionalroles) {
    this.additionalroles = additionalroles;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UserInfo userInfo = (UserInfo) o;
    return Objects.equals(this.tenantId, userInfo.tenantId) &&
        Objects.equals(this.uuid, userInfo.uuid) &&
        Objects.equals(this.userName, userInfo.userName) &&
        Objects.equals(this.password, userInfo.password) &&
        Objects.equals(this.idToken, userInfo.idToken) &&
        Objects.equals(this.mobile, userInfo.mobile) &&
        Objects.equals(this.email, userInfo.email) &&
        Objects.equals(this.primaryrole, userInfo.primaryrole) &&
        Objects.equals(this.additionalroles, userInfo.additionalroles);
  }

  @Override
  public int hashCode() {
    return Objects.hash(tenantId, uuid, userName, password, idToken, mobile, email, primaryrole, additionalroles);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UserInfo {\n");
    
    sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
    sb.append("    uuid: ").append(toIndentedString(uuid)).append("\n");
    sb.append("    userName: ").append(toIndentedString(userName)).append("\n");
    sb.append("    password: ").append(toIndentedString(password)).append("\n");
    sb.append("    idToken: ").append(toIndentedString(idToken)).append("\n");
    sb.append("    mobile: ").append(toIndentedString(mobile)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    primaryrole: ").append(toIndentedString(primaryrole)).append("\n");
    sb.append("    additionalroles: ").append(toIndentedString(additionalroles)).append("\n");
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
