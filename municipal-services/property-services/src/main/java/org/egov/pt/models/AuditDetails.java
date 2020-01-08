package org.egov.pt.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditDetails {
	
        @JsonProperty("createdBy")
        private String createdBy ;

        @JsonProperty("lastModifiedBy")
        private String lastModifiedBy ;

        @JsonProperty("createdTime")
        private Long createdTime ;

        @JsonProperty("lastModifiedTime")
        private Long lastModifiedTime ;
}

