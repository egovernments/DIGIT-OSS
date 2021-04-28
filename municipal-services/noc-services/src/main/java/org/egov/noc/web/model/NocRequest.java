package org.egov.noc.web.model;

import java.util.Objects;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * A object to bind the metadata contract and main application contract
 */
@ApiModel(description = "A object to bind the metadata contract and main application contract")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-07-30T05:26:25.138Z[GMT]")
public class NocRequest   {
  @JsonProperty("RequestInfo")
  private RequestInfo requestInfo = null;

  @JsonProperty("Noc")
  private Noc noc = null;

  public NocRequest requestInfo(RequestInfo requestInfo) {
    this.requestInfo = requestInfo;
    return this;
  }

  /**
   * Get requestInfo
   * @return requestInfo
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public RequestInfo getRequestInfo() {
    return requestInfo;
  }

  public void setRequestInfo(RequestInfo requestInfo) {
    this.requestInfo = requestInfo;
  }

  public NocRequest noc(Noc noc) {
    this.noc = noc;
    return this;
  }

  /**
   * Get noc
   * @return noc
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public Noc getNoc() {
    return noc;
  }

  public void setNoc(Noc noc) {
    this.noc = noc;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    NocRequest nocRequest = (NocRequest) o;
    return Objects.equals(this.requestInfo, nocRequest.requestInfo) &&
        Objects.equals(this.noc, nocRequest.noc);
  }

  @Override
  public int hashCode() {
    return Objects.hash(requestInfo, noc);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class NocRequest {\n");
    
    sb.append("    requestInfo: ").append(toIndentedString(requestInfo)).append("\n");
    sb.append("    noc: ").append(toIndentedString(noc)).append("\n");
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
