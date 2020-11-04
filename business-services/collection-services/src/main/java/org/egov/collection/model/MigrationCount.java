package org.egov.collection.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Address
 */
@Validated
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MigrationCount   {

    @Size(max=64)
    @JsonProperty("id")
    private String id;

    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

    @JsonProperty("createdTime")
    private Long createdTime;

    @JsonProperty("tenantid")
    private String tenantid;

    @JsonProperty("recordCount")
    private Integer recordCount;

}

