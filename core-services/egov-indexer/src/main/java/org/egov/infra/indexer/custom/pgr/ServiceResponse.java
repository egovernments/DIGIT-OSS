package org.egov.infra.indexer.custom.pgr;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Response to the service request
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2018-03-23T08:00:37.661Z")

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ServiceResponse {
	@JsonProperty("ResponseInfo")
	public ResponseInfo responseInfo = null;

	@JsonProperty("services")
	@Valid
	public List<Service> services = new ArrayList<Service>();

	@JsonProperty("actionHistory")
	@Valid
	public List<ActionHistory> actionHistory = null;
}
