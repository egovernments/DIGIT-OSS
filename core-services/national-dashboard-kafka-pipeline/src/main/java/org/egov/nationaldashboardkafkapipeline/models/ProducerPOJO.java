package org.egov.nationaldashboardkafkapipeline.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ProducerPOJO {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("Records")
    private List<JsonNode> records;

}