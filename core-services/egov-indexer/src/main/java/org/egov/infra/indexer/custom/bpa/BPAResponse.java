package org.egov.infra.indexer.custom.bpa;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

/**
 * Contains the ResponseHeader and the created/updated property
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class BPAResponse   {
  @JsonProperty("ResponseInfo")
  private ResponseInfo responseInfo;

  @JsonProperty("BPA")
  private List<BPA> BPA;
  
  @JsonProperty("Count")
  private int count;

  public BPAResponse responseInfo(ResponseInfo responseInfo) {
    this.responseInfo = responseInfo;
    return this;
  }

  /**
   * Get responseInfo
   * @return responseInfo
  **/

    @Valid
    public ResponseInfo getResponseInfo() {
    return responseInfo;
  }

  public void setResponseInfo(ResponseInfo responseInfo) {
    this.responseInfo = responseInfo;
  }

  public BPAResponse BPA(List<BPA> BPA) {
    this.BPA = BPA;
    return this;
  }

  /**
   * Get BPA
   * @return BPA
  **/

//    @Valid
//    public List<BPA> getBPA() {
//    return BPAR;
//  }

//  public void setBPA(List<BPA> BPA) {
//    this.BPAR = BPA;
//  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    BPAResponse bpAResponse = (BPAResponse) o;
    return Objects.equals(this.responseInfo, bpAResponse.responseInfo) &&
        Objects.equals(this.BPA, bpAResponse.BPA);
  }

  @Override
  public int hashCode() {
    return Objects.hash(responseInfo, BPA);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class BPAResponse {\n");
    
    sb.append("    responseInfo: ").append(toIndentedString(responseInfo)).append("\n");
    sb.append("    BPA: ").append(toIndentedString(BPA)).append("\n");
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
