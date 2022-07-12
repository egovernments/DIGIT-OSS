package org.egov.auditservice.persisterauditclient.models.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PersisterClientInput {

    @JsonProperty("topic")
    private String topic;

    @JsonProperty("json")
    private String json;
}
