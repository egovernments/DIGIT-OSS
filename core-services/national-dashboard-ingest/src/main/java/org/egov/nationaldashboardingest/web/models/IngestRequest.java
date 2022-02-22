package org.egov.nationaldashboardingest.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class IngestRequest {

    @Valid
    @NotNull
    @NotEmpty
    @JsonProperty("Data")
    private List<Data> ingestData;

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

}
