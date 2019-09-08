package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Setter
@Getter
@ToString
@AllArgsConstructor
public class BusinessDetailsResponse {

	@JsonProperty("ResponseInfo")
    @JsonIgnore
	private ResponseInfo responseInfo;

	@JsonProperty("BusinessDetails")
	private List<BusinessDetailsRequestInfo> businessDetails;
}
