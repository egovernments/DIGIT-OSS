package org.egov.auditservice.persisterauditclient.models.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PersisterClientInput {

    @JsonProperty("topic")
    private String topic;

    @JsonProperty("json")
    private String json;
}
