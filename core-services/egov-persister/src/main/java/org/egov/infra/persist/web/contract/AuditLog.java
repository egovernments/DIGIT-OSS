package org.egov.infra.persist.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Builder
@Data
public class AuditLog   {

    @JsonProperty("id")
    private String id = null;

    @JsonProperty("userUUID")
    private String userUUID = null;

    @JsonProperty("module")
    private String module = null;

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("transactionCode")
    private String transactionCode = null;

    @JsonProperty("changeDate")
    private Long changeDate = null;

    @JsonProperty("entityName")
    private String entityName = null;

    @JsonProperty("objectId")
    private String objectId = null;

    @JsonProperty("keyValueMap")
    private Map<String, Object> keyValueMap = null;

    @JsonProperty("operationType")
    private String operationType = null;

    @JsonProperty("integrityHash")
    private String integrityHash = null;

}