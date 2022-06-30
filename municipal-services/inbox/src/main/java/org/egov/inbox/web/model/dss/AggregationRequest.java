package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import java.util.Map;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AggregationRequest {

    @Valid
    @JsonProperty("headers")
    private Map<String, Object> headers;

    @Valid
    @JsonProperty("aggregationRequestDto")
    private AggregateRequestDto aggregationRequestDto;

}
