package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandInfoResponse   {
  @JsonProperty("ResponseInfo")
  private ResponseInfo responseInfo = null;

  @JsonProperty("landInfo")
  private List<LandInfo> landInfo = null;

  public LandInfoResponse responseInfo(ResponseInfo responseInfo) {
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

  public LandInfoResponse landInfo(List<LandInfo> landInfo) {
    this.landInfo = landInfo;
    return this;
  }

  /**
   * Get landInfo
   * @return landInfo
  **/

    @Valid
    public List<LandInfo> getLandInfo() {
    return landInfo;
  }

  public void setLandInfo(List<LandInfo> landInfo) {
    this.landInfo = landInfo;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    LandInfoResponse landInfoResponse = (LandInfoResponse) o;
    return Objects.equals(this.responseInfo, landInfoResponse.responseInfo) &&
        Objects.equals(this.landInfo, landInfoResponse.landInfo);
  }

  @Override
  public int hashCode() {
    return Objects.hash(responseInfo, landInfo);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class LandInfoResponse {\n");
    
    sb.append("    responseInfo: ").append(toIndentedString(responseInfo)).append("\n");
    sb.append("    landInfo: ").append(toIndentedString(landInfo)).append("\n");
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
