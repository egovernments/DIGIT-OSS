package org.egov.swservice.web.models;

import java.util.Objects;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
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
 * Contract class to receive request. Array of Property items are used in case
 * of create . Where as single Property item is used for update
 */
@ApiModel(description = "Contract class to receive request. Array of Property items  are used in case of create . Where as single Property item is used for update")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-10-24T10:29:25.253+05:30[Asia/Kolkata]")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
public class SewerageConnectionRequest {
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo = null;

	@JsonProperty("SewerageConnection")
	private SewerageConnection sewerageConnection = null;

	@Builder.Default
	@JsonProperty("isCreateCall")
	private boolean isCreateCall = false;

	@Builder.Default
	@JsonProperty("isOldDataEncryptionRequest")
	private boolean isOldDataEncryptionRequest = false;

	@JsonProperty("disconnectRequest")
	private boolean disconnectRequest;

	public SewerageConnectionRequest requestInfo(RequestInfo requestInfo) {
		this.requestInfo = requestInfo;
		return this;
	}

	/**
	 * Get requestInfo
	 * 
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

	public SewerageConnectionRequest sewerageConnection(SewerageConnection sewerageConnection) {
		this.sewerageConnection = sewerageConnection;
		return this;
	}
	
	public SewerageConnectionRequest disconnectionRequest(boolean isDisconnectionRequest) {
		this.disconnectRequest = isDisconnectionRequest;
		return this;
	}

	/**
	 * Get sewerageConnection
	 * 
	 * @return sewerageConnection
	 **/
	@ApiModelProperty(value = "")

	@Valid
	public SewerageConnection getSewerageConnection() {
		return sewerageConnection;
	}

	public void setSewerageConnection(SewerageConnection sewerageConnection) {
		this.sewerageConnection = sewerageConnection;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		SewerageConnectionRequest sewerageConnectionRequest = (SewerageConnectionRequest) o;
		return Objects.equals(this.requestInfo, sewerageConnectionRequest.requestInfo)
				&& Objects.equals(this.sewerageConnection, sewerageConnectionRequest.sewerageConnection);
	}

	@Override
	public int hashCode() {
		return Objects.hash(requestInfo, sewerageConnection);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class SewerageConnectionRequest {\n");

		sb.append("    requestInfo: ").append(toIndentedString(requestInfo)).append("\n");
		sb.append("    sewerageConnection: ").append(toIndentedString(sewerageConnection)).append("\n");
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
