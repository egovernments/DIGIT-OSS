package org.egov.dataupload.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.egov.common.contract.request.RequestInfo;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ModuleDefRequest   {
  
	@JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

}

