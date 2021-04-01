package org.egov.pt.models.oldProperty;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.pt.models.OwnerInfo;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class OldUserDetailResponse {
    @JsonProperty("responseInfo")
    ResponseInfo responseInfo;

    @JsonProperty("user")
    List<OldOwnerInfo> user;
}
