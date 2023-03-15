package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InboxMetricCriteria {

    @Valid
    @JsonProperty("tenantId")
    private String tenantId;

    @Valid
    @JsonProperty("module")
    private String module;
}
