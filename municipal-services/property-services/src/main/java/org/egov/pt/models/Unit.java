package org.egov.pt.models;

import javax.validation.constraints.NotNull;

import org.egov.pt.models.enums.OccupancyType;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Unit
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Unit   {
	
        @JsonProperty("id")
        private String id;

        @JsonProperty("floorNo")
        private String floorNo;

        @JsonProperty("unitArea")
        @NotNull
        private Double unitArea;

        @JsonProperty("usageCategory")
        @NotNull
        private String usageCategory;

        @JsonProperty("occupancyType")
        @NotNull
        private OccupancyType occupancyType;

        @JsonProperty("occupancyDate")
        @NotNull
        private Long occupancyDate;

        @JsonProperty("constructionType")
        @NotNull
        private String constructionType;
        
        @JsonProperty("active")
        private Boolean active;

        @JsonProperty("arv")
        private Double arv;
        
        @JsonProperty("auditDetails")
        private AuditDetails auditDetails;


}

