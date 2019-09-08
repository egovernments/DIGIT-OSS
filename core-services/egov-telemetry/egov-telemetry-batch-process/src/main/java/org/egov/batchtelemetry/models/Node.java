package org.egov.batchtelemetry.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Node {

    private String nodeId;

    @JsonProperty("@timestamp")
    private String timestamp;

    private String type;

    private String pathId;

    private String sessionId;

    private String nodeName;

    private String url;

    private Long nodeTime;

    private Long timeSpent;

}
