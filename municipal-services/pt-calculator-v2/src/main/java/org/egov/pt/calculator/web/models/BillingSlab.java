package org.egov.pt.calculator.web.models;

import javax.validation.constraints.NotNull;

import org.egov.pt.calculator.web.models.property.AuditDetails;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * BillingSlab
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(exclude={"unitRate","arvPercent","unBuiltUnitRate","id","auditDetails" /*, "fromPlotSize", "toPlotSize", "fromFloor", "toFloor"*/})
public class BillingSlab   {
	
		@NotNull
        @JsonProperty("tenantId")
        private String tenantId;

        @JsonProperty("id")
        private String id;

        @NotNull
        @JsonProperty("propertyType")
        private String propertyType;

        @NotNull
        @JsonProperty("propertySubType")
        private String propertySubType;

        @NotNull
        @JsonProperty("usageCategoryMajor")
        private String usageCategoryMajor;

        @NotNull
        @JsonProperty("usageCategoryMinor")
        private String usageCategoryMinor;

        @NotNull
        @JsonProperty("usageCategorySubMinor")
        private String usageCategorySubMinor;

        @NotNull
        @JsonProperty("usageCategoryDetail")
        private String usageCategoryDetail;

        @NotNull
        @JsonProperty("ownerShipCategory")
        private String ownerShipCategory;

        @NotNull
        @JsonProperty("subOwnerShipCategory")
        private String subOwnerShipCategory;

        @NotNull
        @JsonProperty("areaType")
        private String areaType;

        @NotNull
        @JsonProperty("fromPlotSize")
        private Double fromPlotSize;

        @NotNull
        @JsonProperty("toPlotSize")
        private Double toPlotSize;
        
        @NotNull
        @JsonProperty("occupancyType")
        private String occupancyType;
        
        @NotNull
        @JsonProperty("fromFloor")
        private Double fromFloor;

        @NotNull
        @JsonProperty("toFloor")
        private Double toFloor;

        @JsonProperty("unitRate")
        private Double unitRate;
        
        @NotNull
        @JsonProperty("isPropertyMultiFloored")
        private Boolean isPropertyMultiFloored;
        
        @JsonProperty("unBuiltUnitRate")
        private Double unBuiltUnitRate;
        
        @JsonProperty("arvPercent")
        private Double arvPercent;
        
/*        @NotNull
        @JsonProperty("fromDate")
        private Long fromDate;*/
        
        @JsonProperty("auditDetails")
        private AuditDetails auditDetails;
}

