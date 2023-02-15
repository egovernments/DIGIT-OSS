package org.egov.swservice.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Size;

/**
 * Address
 */
@Validated
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EncryptionCount {

    @Size(max = 64)
    @JsonProperty("id")
    private String id;

    @JsonProperty("batchOffset")
    private Long batchOffset;

    @JsonProperty("limit")
    private Long limit;

    @JsonProperty("createdTime")
    private Long createdTime;

    @JsonProperty("tenantid")
    private String tenantid;

    @JsonProperty("recordCount")
    private Long recordCount;

    @JsonProperty("message")
    private String message;

    @JsonProperty("auditTopic")
    private String auditTopic;

    @JsonProperty("encryptiontime")
    private Long encryptiontime;

}