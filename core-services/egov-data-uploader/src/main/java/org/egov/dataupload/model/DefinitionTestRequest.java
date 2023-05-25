package org.egov.dataupload.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class DefinitionTestRequest {

    @JsonProperty("headers")
    private List<Object> headers;

    @JsonProperty("data")
    private List<List<Object>> data;

    @JsonProperty("definition")
    private Definition definition;

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
}

