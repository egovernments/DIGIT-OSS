package org.egov.wscalculation.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.*;

/**
 * minimal representation of the Roles in the system to be carried along in
 * UserInfo with RequestInfo meta data. Actual authorization service to extend
 * this to have more role related attributes
 */
@ApiModel(description = "minimal representation of the Roles in the system to be carried along in UserInfo with RequestInfo meta data. Actual authorization service to extend this to have more role related attributes ")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-10-24T10:29:25.253+05:30[Asia/Kolkata]")
public class Role {
	@JsonProperty("name")
	private String name = null;

	@JsonProperty("code")
	private String code = null;

	@JsonProperty("description")
	private String description = null;

	public Role name(String name) {
		this.name = name;
		return this;
	}

	/**
	 * Unique name of the role
	 * 
	 * @return name
	 **/
	@ApiModelProperty(required = true, value = "Unique name of the role")
	@NotNull

	@Size(max = 64)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Role code(String code) {
		this.code = code;
		return this;
	}

	/**
	 * Unique code of the role
	 * 
	 * @return code
	 **/
	@ApiModelProperty(value = "Unique code of the role")

	@Size(max = 64)
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Role description(String description) {
		this.description = description;
		return this;
	}

	/**
	 * brief description of the role
	 * 
	 * @return description
	 **/
	@ApiModelProperty(value = "brief description of the role")

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		Role role = (Role) o;
		return Objects.equals(this.name, role.name) && Objects.equals(this.code, role.code)
				&& Objects.equals(this.description, role.description);
	}

	@Override
	public int hashCode() {
		return Objects.hash(name, code, description);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class Role {\n");

		sb.append("    name: ").append(toIndentedString(name)).append("\n");
		sb.append("    code: ").append(toIndentedString(code)).append("\n");
		sb.append("    description: ").append(toIndentedString(description)).append("\n");
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
