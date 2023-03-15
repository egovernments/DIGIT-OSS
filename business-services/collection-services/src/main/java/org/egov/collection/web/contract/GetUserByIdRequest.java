package org.egov.collection.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Setter
@Getter
@Builder
public class GetUserByIdRequest {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    private List<Long> id;

    private String tenantId;
}
