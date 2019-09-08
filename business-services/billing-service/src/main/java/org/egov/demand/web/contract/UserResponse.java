package org.egov.demand.web.contract;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class UserResponse {
    @JsonProperty("responseInfo")
	ResponseInfo responseInfo;

    @JsonProperty("user")
    List<User> user;
}
