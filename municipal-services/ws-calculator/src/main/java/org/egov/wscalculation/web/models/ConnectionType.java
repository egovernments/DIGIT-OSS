package org.egov.wscalculation.web.models;

import java.util.Objects;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

/**
 * ConnectionType
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-10-24T10:29:25.253+05:30[Asia/Kolkata]")
public class ConnectionType {
	@JsonProperty("code")
	private String code = null;

	@JsonProperty("active")
	private Boolean active = null;

	public ConnectionType code(String code) {
		this.code = code;
		return this;
	}

	/**
	 * code of the connection type
	 * 
	 * @return code
	 **/
	@ApiModelProperty(required = true, value = "code of the connection type")
	@NotNull

	@Size(min = 2, max = 64)
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public ConnectionType active(Boolean active) {
		this.active = active;
		return this;
	}

	/**
	 * Whether UsageCategoryMajor is Active or not.
	 * 
	 * @return active
	 **/
	@ApiModelProperty(value = "Whether UsageCategoryMajor is Active or not.")

	public Boolean isActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		ConnectionType connectionType = (ConnectionType) o;
		return Objects.equals(this.code, connectionType.code) && Objects.equals(this.active, connectionType.active);
	}

	@Override
	public int hashCode() {
		return Objects.hash(code, active);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class ConnectionType {\n");

		sb.append("    code: ").append(toIndentedString(code)).append("\n");
		sb.append("    active: ").append(toIndentedString(active)).append("\n");
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
