package org.egov.noc.web.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * Contains the ResponseMetadate and the main application contract
 */
@ApiModel(description = "Contains the ResponseMetadate and the main application contract")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-07-30T05:43:01.798Z[GMT]")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NocResponse   {
  @JsonProperty("ResponseInfo")
  private ResponseInfo responseInfo = null;

  @JsonProperty("Noc")
  @Valid
  private List<Noc> noc = null;
  
  @JsonProperty("count")
  private Integer count;

  public NocResponse responseInfo(ResponseInfo responseInfo) {
    this.responseInfo = responseInfo;
    return this;
  }

  /**
   * Get responseInfo
   * @return responseInfo
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public ResponseInfo getResponseInfo() {
    return responseInfo;
  }

  public void setResponseInfo(ResponseInfo responseInfo) {
    this.responseInfo = responseInfo;
  }

  public NocResponse noc(List<Noc> noc) {
    this.noc = noc;
    return this;
  }

  public NocResponse addNocItem(Noc nocItem) {
    if (this.noc == null) {
      this.noc = new ArrayList<Noc>();
    }
    this.noc.add(nocItem);
    return this;
  }

  /**
   * Get noc
   * @return noc
  **/
  @ApiModelProperty(value = "")
      @Valid
    public List<Noc> getNoc() {
    return noc;
  }

  public void setNoc(List<Noc> noc) {
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
    NocResponse nocResponse = (NocResponse) o;
    return Objects.equals(this.responseInfo, nocResponse.responseInfo) &&
        Objects.equals(this.noc, nocResponse.noc);
  }

  @Override
  public int hashCode() {
    return Objects.hash(responseInfo, noc);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class NocResponse {\n");
    
    sb.append("    responseInfo: ").append(toIndentedString(responseInfo)).append("\n");
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
