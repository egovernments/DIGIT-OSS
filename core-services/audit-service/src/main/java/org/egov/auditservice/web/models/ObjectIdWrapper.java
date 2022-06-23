package org.egov.auditservice.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ObjectIdWrapper {

    @JsonProperty("objectId")
    private String objectId;

}
