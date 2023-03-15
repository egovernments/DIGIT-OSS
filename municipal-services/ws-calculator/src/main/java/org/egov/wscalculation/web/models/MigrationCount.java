package org.egov.wscalculation.web.models;

import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Address
 */
@Validated
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MigrationCount   {

    @Size(max=64)
    @JsonProperty("id")
    private String id;

    @JsonProperty("offset")
    private Long offset;

    @JsonProperty("limit")
    private Long limit;

    @JsonProperty("createdTime")
    private Long createdTime;

    @JsonProperty("tenantid")
    private String tenantid;

    @JsonProperty("recordCount")
    private Long recordCount;

    @JsonProperty("businessService")
    private String businessService;

    @JsonProperty("message")
    private String message;

    @JsonProperty("auditTopic")
    private String auditTopic;

    @JsonProperty("auditTime")
    private Long auditTime;
}