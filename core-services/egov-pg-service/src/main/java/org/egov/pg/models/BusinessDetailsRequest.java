package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Setter
@Getter
@Builder
public class BusinessDetailsRequest {

    private String tenantId;

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("businessDetailsCodes")
    private List<String> businessCodes;
}
