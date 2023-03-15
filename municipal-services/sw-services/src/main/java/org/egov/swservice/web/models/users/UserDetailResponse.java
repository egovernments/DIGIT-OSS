package org.egov.swservice.web.models.users;

import java.util.List;

import lombok.Setter;
import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.egov.swservice.web.models.OwnerInfo;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDetailResponse {
    @JsonProperty("responseInfo")
    ResponseInfo responseInfo;

    @JsonProperty("user")
    List<OwnerInfo> user;
}
