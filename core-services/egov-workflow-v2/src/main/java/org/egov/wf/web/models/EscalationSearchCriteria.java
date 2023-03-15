package org.egov.wf.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Builder
@Data
public class EscalationSearchCriteria {


    @NotNull
    @JsonProperty("tenantId")
    private String tenantId;

    @NotNull
    @JsonProperty("status")
    private String status;

    @NotNull
    @JsonProperty("businessService")
    private String businessService;

    @JsonProperty("stateSlaExceededBy")
    private Long stateSlaExceededBy;

    @JsonProperty("businessSlaExceededBy")
    private Long businessSlaExceededBy;

}
