package org.egov.commons.web.contract;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.egov.common.contract.response.ResponseInfo;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BusinessCategoryResponse {
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("BusinessCategory")
	private List<BusinessCategory> businessCategoryInfo;

}
