package org.egov.wf.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Builder
@Data
public class Escalation {

    @NotNull
    @JsonProperty("status")
    private String status;

    @JsonProperty("businessService")
    private String businessService;

    @NotNull
    @JsonProperty("moduleName")
    private String moduleName;

    @NotNull
    @JsonProperty("action")
    private String action;

    @JsonProperty("stateSlaExceededBy")
    private Long stateSlaExceededBy;

    @JsonProperty("businessSlaExceededBy")
    private Long businessSlaExceededBy;

    @JsonProperty("topic")
    private String topic;


}
