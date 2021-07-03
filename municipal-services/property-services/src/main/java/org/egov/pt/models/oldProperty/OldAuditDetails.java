package org.egov.pt.models.oldProperty;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Collection of audit related fields used by most models
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class OldAuditDetails {
        @JsonProperty("createdBy")
        private String createdBy;

        @JsonProperty("lastModifiedBy")
        private String lastModifiedBy;

        @JsonProperty("createdTime")
        private Long createdTime;

        @JsonProperty("lastModifiedTime")
        private Long lastModifiedTime;


}

