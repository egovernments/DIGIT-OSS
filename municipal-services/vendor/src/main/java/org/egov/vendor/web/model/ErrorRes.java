package org.egov.vendor.web.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * All APIs will return ErrorRes in case of failure which will carry
 * ResponseHeader as metadata and Error object as actual representation of
 * error. In case of bulk apis, some apis may chose to return the array of Error
 * objects to indicate individual failure.
 */
//@Schema(description = "All APIs will return ErrorRes in case of failure which will carry ResponseHeader as metadata and Error object as actual representation of error. In case of bulk apis, some apis may chose to return the array of Error objects to indicate individual failure.")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2021-01-06T05:34:12.238Z[GMT]")

public class ErrorRes {
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo = null;

	@JsonProperty("Errors")
	@Valid
	private List<Error> errors = null;

	public ErrorRes responseHeader(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
		return this;
	}

	/**
	 * Get responseHeader
	 * 
	 * @return responseHeader
	 **/
	// @Schema(required = true, description = "")
	@NotNull

	@Valid
	public ResponseInfo getResponseHeader() {
		return responseInfo;
	}

	public void setResponseHeader(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public ErrorRes errors(List<Error> errors) {
		this.errors = errors;
		return this;
	}

	public ErrorRes addErrorsItem(Error errorsItem) {
		if (this.errors == null) {
			this.errors = new ArrayList<Error>();
		}
		this.errors.add(errorsItem);
		return this;
	}

	/**
	 * Error response array corresponding to Request Object array. In case of single
	 * object submission or _search related paths this may be an array of one error
	 * element
	 * 
	 * @return errors
	 **/
	// @Schema(description = "Error response array corresponding to Request Object
	// array. In case of single object submission or _search related paths this may
	// be an array of one error element")
	@Valid
	public List<Error> getErrors() {
		return errors;
	}

	public void setErrors(List<Error> errors) {
		this.errors = errors;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		ErrorRes errorRes = (ErrorRes) o;
		return Objects.equals(this.responseInfo, errorRes.responseInfo) && Objects.equals(this.errors, errorRes.errors);
	}

	@Override
	public int hashCode() {
		return Objects.hash(responseInfo, errors);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class ErrorRes {\n");

		sb.append("    responseHeader: ").append(toIndentedString(responseInfo)).append("\n");
		sb.append("    errors: ").append(toIndentedString(errors)).append("\n");
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
