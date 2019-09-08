package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Getter
@AllArgsConstructor

public class IdGenerationRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    private List<IdRequest> idRequests;

}

