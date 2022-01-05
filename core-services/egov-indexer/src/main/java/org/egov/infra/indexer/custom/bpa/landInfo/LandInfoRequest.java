package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.Objects;

/**
 * Contract class to receive request. Array of Property items  are used in case of create . Where as single Property item is used for update
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandInfoRequest   {
  @JsonProperty("RequestInfo")
  private RequestInfo requestInfo = null;

  @JsonProperty("LandInfo")
  private LandInfo landInfo = null;

  public LandInfoRequest requestInfo(RequestInfo requestInfo) {
    this.requestInfo = requestInfo;
    return this;
  }

  /**
   * Get requestInfo
   * @return requestInfo
  **/

    @Valid
    public RequestInfo getRequestInfo() {
    return requestInfo;
  }

  public void setRequestInfo(RequestInfo requestInfo) {
    this.requestInfo = requestInfo;
  }

  public LandInfoRequest landInfo(LandInfo landInfo) {
    this.landInfo = landInfo;
    return this;
  }

  /**
   * Get landInfo
   * @return landInfo
  **/

    @Valid
    public LandInfo getLandInfo() {
    return landInfo;
  }

  public void setLandInfo(LandInfo landInfo) {
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
    LandInfoRequest landInfoRequest = (LandInfoRequest) o;
    return Objects.equals(this.requestInfo, landInfoRequest.requestInfo) &&
        Objects.equals(this.landInfo, landInfoRequest.landInfo);
  }

  @Override
  public int hashCode() {
    return Objects.hash(requestInfo, landInfo);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class LandInfoRequest {\n");
    
    sb.append("    requestInfo: ").append(toIndentedString(requestInfo)).append("\n");
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
