package org.egov.land.web.models;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class UserDetailResponse {

	@JsonProperty("responseInfo")
    ResponseInfo responseInfo;
	
    @JsonProperty("user")
    List<OwnerInfo> user;
}
