package org.egov.batchtelemetry.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Session {

    private String type;

    private String sessionId;

    @JsonProperty("@timestamp")
    private String timestamp;

    private String deviceId;

    private String userId;

    private boolean isNewUser;

    private Long startTime;

    private Long endTime;

    private SessionDetails sessionDetails;

    private Edata edata;


}
