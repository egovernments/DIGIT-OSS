package org.egov.inbox.web.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * All APIs will return ErrorRes in case of failure which will carry ResponseHeader as metadata and Error object as actual representation of error. In case of bulk apis, some apis may chose to return the array of Error objects to indicate individual failure.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorRes   {
  @JsonProperty("ResponseInfo")
  private ResponseInfo responseHeader = null;

  @JsonProperty("Errors")
  @Valid
  private List<Error> errors = null;

  public ErrorRes responseHeader(ResponseInfo responseHeader) {
    this.responseHeader = responseHeader;
    return this;
  }

  /**
   * Get responseHeader
   * @return responseHeader
   **/
      @NotNull

    @Valid
    public ResponseInfo getResponseHeader() {
    return responseHeader;
  }

  public void setResponseHeader(ResponseInfo responseHeader) {
    this.responseHeader = responseHeader;
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
   * Error response array corresponding to Request Object array. In case of single object submission or _search related paths this may be an array of one error element
   * @return errors
   **/
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
    return Objects.equals(this.responseHeader, errorRes.responseHeader) &&
        Objects.equals(this.errors, errorRes.errors);
  }

  @Override
  public int hashCode() {
    return Objects.hash(responseHeader, errors);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ErrorRes {\n");
    
    sb.append("    responseHeader: ").append(toIndentedString(responseHeader)).append("\n");
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
