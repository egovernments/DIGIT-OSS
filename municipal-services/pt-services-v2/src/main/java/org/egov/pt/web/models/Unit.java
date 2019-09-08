package org.egov.pt.web.models;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.HashSet;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Unit
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-11T14:12:44.497+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(exclude={"usage"})
public class Unit   {

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

}

