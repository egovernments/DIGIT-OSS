package org.egov.user.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@AllArgsConstructor
@Getter
public class UserSearchResponse {
    @JsonProperty("responseInfo")
	ResponseInfo responseInfo;

    @JsonProperty("user")
    List<UserSearchResponseContent> userSearchResponseContent;
}
