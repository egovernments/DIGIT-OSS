package org.egov.collection.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Getter
@AllArgsConstructor
@ToString
public class IdGenerationRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    private List<IdRequest> idRequests;

}

