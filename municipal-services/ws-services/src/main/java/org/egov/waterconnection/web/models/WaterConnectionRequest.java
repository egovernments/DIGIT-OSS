package org.egov.waterconnection.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;

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
public class WaterConnectionRequest {
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo = null;

	@JsonProperty("WaterConnection")
	private WaterConnection waterConnection = null;
	
	@JsonProperty("disconnectRequest")
	private boolean disconnectRequest;

	@Builder.Default
	@JsonProperty("isCreateCall")
	private boolean isCreateCall = false;

	@Builder.Default
	@JsonProperty("isOldDataEncryptionRequest")
	private boolean isOldDataEncryptionRequest = false;

	public WaterConnectionRequest requestInfo(RequestInfo requestInfo) {
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

	public WaterConnectionRequest waterConnection(WaterConnection waterConnection) {
		this.waterConnection = waterConnection;
		return this;
	}
	
	public WaterConnectionRequest disconnectionRequest(boolean isDisconnectionRequest) {
		this.disconnectRequest = isDisconnectionRequest;
		return this;
	}

	/**
	 * Get waterConnection
	 * 
	 * @return waterConnection
	 **/
	@ApiModelProperty(value = "")

	@Valid
	public WaterConnection getWaterConnection() {
		return waterConnection;
	}

	public void setWaterConnection(WaterConnection waterConnection) {
		this.waterConnection = waterConnection;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		WaterConnectionRequest waterConnectionRequest = (WaterConnectionRequest) o;
		return Objects.equals(this.requestInfo, waterConnectionRequest.requestInfo)
				&& Objects.equals(this.waterConnection, waterConnectionRequest.waterConnection);
	}

	@Override
	public int hashCode() {
		return Objects.hash(requestInfo, waterConnection);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class WaterConnectionRequest {\n");

		sb.append("    requestInfo: ").append(toIndentedString(requestInfo)).append("\n");
		sb.append("    waterConnection: ").append(toIndentedString(waterConnection)).append("\n");
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
