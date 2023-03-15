package org.egov.auditservice.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AuditLogSearchCriteria {

    @JsonProperty("objectId")
    private String objectId;

    @JsonProperty("id")
    private String id;

    @JsonProperty("module")
    private String module;

    @JsonProperty("userUUID")
    private String userUUID;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

}
