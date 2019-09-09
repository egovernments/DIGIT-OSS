package org.egov.tracer.model;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * All APIs will return ErrorRes in case of failure which will carry ResponseInfo as metadata and Error object as actual representation of error. In case of bulk apis, some apis may chose to return the array of Error objects to indicate individual failure.
 */
@Setter
@Getter
@ToString
public class ErrorRes   {
  
  @JsonProperty("ResponseInfo")
  private ResponseInfo responseInfo = null;

  @JsonProperty("Errors")
  private List<Error> errors = null;
}

