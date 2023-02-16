package org.egov.auditservice.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ObjectIdWrapper {

    @JsonProperty("objectId")
    private String objectId;

    @JsonProperty("keyValuePairs")
    private Map<String, Object> keyValuePairs = null;

}
