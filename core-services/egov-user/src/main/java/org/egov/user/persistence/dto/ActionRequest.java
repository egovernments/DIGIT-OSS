package org.egov.user.persistence.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Getter
@Setter
@Builder
public class ActionRequest {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    @JsonProperty("roleCodes")
    private List<String> roleCodes;
    @JsonProperty("tenantId")
    private String tenantId;
    @JsonProperty("actionMaster")
    private String actionMaster;
}
