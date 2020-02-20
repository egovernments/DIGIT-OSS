package org.egov.pt.models.oldProperty;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Unit
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class OldUnit   {

        @Size(max=64)
        @JsonProperty("id")
        private String id;

        @Size(max=256)
        @JsonProperty("tenantId")
        private String tenantId;

        @Size(max=64)
        @JsonProperty("floorNo")
        private String floorNo;

        @Size(max=64)
        @JsonProperty("unitType")
        private String unitType;

        @JsonProperty("unitArea")
        private Float unitArea;

        @Size(max=64)
        @JsonProperty("usageCategoryMajor")
        private String usageCategoryMajor;

        @Size(max=64)
        @JsonProperty("usageCategoryMinor")
        private String usageCategoryMinor;

        @Size(max=64)
        @JsonProperty("usageCategorySubMinor")
        private String usageCategorySubMinor;

        @Size(max=64)
        @JsonProperty("usageCategoryDetail")
        private String usageCategoryDetail;

        @Size(max=64)
        @JsonProperty("occupancyType")
        private String occupancyType;

        @JsonProperty("occupancyDate")
        private Long occupancyDate;

        @Size(max=64)
        @JsonProperty("constructionType")
        private String constructionType;

        @Size(max=64)
        @JsonProperty("constructionSubType")
        private String constructionSubType;

        @JsonProperty("arv")
        private BigDecimal arv;

        @JsonProperty("active")
        private Boolean active;

        @JsonProperty("additionalDetails")
        private Object additionalDetails;

}

