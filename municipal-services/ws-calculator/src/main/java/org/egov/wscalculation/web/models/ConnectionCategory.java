package org.egov.wscalculation.web.models;

import java.util.Objects;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

/**
 * ConnectionCategory
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-10-24T10:29:25.253+05:30[Asia/Kolkata]")
public class ConnectionCategory {
	@JsonProperty("code")
	private String code = null;

	@JsonProperty("active")
	private Boolean active = null;

	public ConnectionCategory code(String code) {
		this.code = code;
		return this;
	}

	/**
	 * code of the connection category
	 * 
	 * @return code
	 **/
	@ApiModelProperty(required = true, value = "code of the connection category")
	@NotNull

	@Size(min = 2, max = 64)
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public ConnectionCategory active(Boolean active) {
		this.active = active;
		return this;
	}

	/**
	 * describes Whether propertyType is Active or not.
	 * 
	 * @return active
	 **/
	@ApiModelProperty(value = "describes Whether propertyType is Active or not.")

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
		ConnectionCategory connectionCategory = (ConnectionCategory) o;
		return Objects.equals(this.code, connectionCategory.code)
				&& Objects.equals(this.active, connectionCategory.active);
	}

	@Override
	public int hashCode() {
		return Objects.hash(code, active);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class ConnectionCategory {\n");

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
