package org.egov.swservice.web.models;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Contains the ResponseHeader and the created/updated property
 */
@ApiModel(description = "Contains the ResponseHeader and the created/updated property")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-10-24T10:29:25.253+05:30[Asia/Kolkata]")

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
public class SewerageConnectionResponse {
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo = null;

	@JsonProperty("SewerageConnections")
	@Valid
	private List<SewerageConnection> sewerageConnections = null;

	@JsonProperty("TotalCount")
	private Integer totalCount = 0;
	
	public SewerageConnectionResponse responseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
		return this;
	}

	/**
	 * Get responseInfo
	 * 
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

	public SewerageConnectionResponse sewerageConnections(List<SewerageConnection> sewerageConnections) {
		this.sewerageConnections = sewerageConnections;
		return this;
	}

	public SewerageConnectionResponse addSewerageConnectionsItem(SewerageConnection sewerageConnectionsItem) {
		if (this.sewerageConnections == null) {
			this.sewerageConnections = new ArrayList<SewerageConnection>();
		}
		this.sewerageConnections.add(sewerageConnectionsItem);
		return this;
	}

	/**
	 * Get sewerageConnections
	 * 
	 * @return sewerageConnections
	 **/
	@ApiModelProperty(value = "")
	@Valid
	public List<SewerageConnection> getSewerageConnections() {
		return sewerageConnections;
	}

	public void setSewerageConnections(List<SewerageConnection> sewerageConnections) {
		this.sewerageConnections = sewerageConnections;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		SewerageConnectionResponse sewerageConnectionResponse = (SewerageConnectionResponse) o;
		return Objects.equals(this.responseInfo, sewerageConnectionResponse.responseInfo)
				&& Objects.equals(this.sewerageConnections, sewerageConnectionResponse.sewerageConnections);
	}

	/**
	 * Get totalCount
	 * 
	 * @return totalCount
	 **/
	@ApiModelProperty(value = "")

	@Valid
	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(responseInfo, sewerageConnections,totalCount);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class SewerageConnectionResponse {\n");

		sb.append("    responseInfo: ").append(toIndentedString(responseInfo)).append("\n");
		sb.append("    sewerageConnections: ").append(toIndentedString(sewerageConnections)).append("\n");
		sb.append("    totalCount: ").append(toIndentedString(totalCount)).append("\n");
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
